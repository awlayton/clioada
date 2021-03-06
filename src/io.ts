import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { isAbsolute, extname, join } from 'path';
import { URL } from 'url';
import type { Readable, Writable } from 'stream';

import { Minimatch } from 'minimatch';
// concatenated JSON in, LJSON out
import { parse } from 'concatjson';
import { stringify } from 'ndjson';
import highlight from 'cli-highlight';
import { request } from 'gaxios';

import type { OADAClient } from '@oada/client';
import { oadaify } from '@oada/oadaify';

// Support input from TypeScript files
import 'ts-node/register/transpile-only';
// Support input from HJSON files
import 'hjson/lib/require-config';
// Support for input from JSON6 files
import 'json-6/lib/require';
// @ts-ignore Make json-6 load JSON5 (because it can)
require.extensions['.json5'] = require.extensions['.json6'];

import type { IConfig } from './BaseCommand';

/**
 * Supported input/output types
 */
export const enum IOType {
  /**
   * A realave file path or a file URL
   */
  File,
  /**
   * An absolute path within OADA
   */
  Oada,
  /**
   * A URL (not a file URL)
   */
  Url,
  /**
   * Standard in stream
   */
  Stdin,
  /**
   * Standard out stream
   */
  Stdout,
  /**
   * Standard out TTY
   */
  Tty,
}

// TODO: Refactor these two functions
function inputType(input: string, { domain, domains }: IConfig) {
  if (input === '-') {
    return IOType.Stdin;
  }

  // Assume absolute path means OADA
  if (isAbsolute(input)) {
    return IOType.Oada;
  }

  try {
    const { protocol, host } = new URL(input);
    if (protocol === 'file:') {
      return IOType.File;
    }
    if ([domain, ...Object.keys(domains)].includes(host)) {
      // Use OADA connection for known OADA domains
      return IOType.Oada;
    }
    return IOType.Url;
  } catch {
    // Assume it's a file path?
    return IOType.File;
  }
}
async function outputType(output: string, { tty }: IConfig) {
  if (output === '-') {
    if (tty) {
      return IOType.Tty;
    }
    return IOType.Stdout;
  }

  /*
  // Assume absolute path means OADA
  if (isAbsolute(output)) {
    return IOType.Oada;
  }
   */

  // TODO: Support multiple OADA domains?
  try {
    const { protocol } = new URL(output);
    return protocol === 'file:' ? IOType.File : IOType.Url;
  } catch {
    // Assume it's a file path?
    return IOType.File;
  }
}

/**
 * List of file extensions we can import
 *
 * Anything else, attempt to read in as Concatenated JSON
 *
 * @todo make this more extensible?
 * @todo support these extensions coming from remote??
 */
export const importable = <const>['.json6', '.json5', '.hjson', '.ts', '.js'];

/**
 * Load a support file as JSON
 */
export async function loadFile(input: string) {
  const path = join(process.cwd(), input);
  const { default: data } = await import(path);
  return data;
}

function inputChain(
  conn: OADAClient,
  input: string,
  config: IConfig
): [
  Readable | (() => AsyncGenerator<any>),
  ...(Readable | ((source: AsyncIterable<any>) => AsyncGenerator<any>))[]
] {
  switch (inputType(input, config)) {
    case IOType.Stdin:
      return [process.stdin, parse()];
    case IOType.File:
      const ext = extname(input);
      if ((importable as readonly string[]).includes(ext)) {
        return [
          async function* () {
            yield loadFile(input);
          },
        ];
      } else {
        return [createReadStream(input), parse()];
      }
    case IOType.Oada:
      return [
        // TODO: Use code from git subcommand?
        async function* () {
          const paths = expandPath(conn, input);
          for await (const path of paths) {
            const { data } = await conn.get({ path });
            yield data;
          }
        },
      ];
    case IOType.Url:
      return [
        async function* () {
          const { data } = await request({
            // TODO: support stream response?
            responseType: 'json',
            url: input,
          });
          yield data;
        },
      ];
  }
}

/**
 * Funtion for expanding * etc. in paths akin to shell expansion
 *
 * Only works with OADA paths
 *
 * @todo inefficient and gross
 */
export async function* expandPath(
  conn: OADAClient,
  path: string
): AsyncGenerator<string> {
  let parts: string[];
  let origin: string;
  try {
    // Try parsing path as URL
    let pathname;
    ({ pathname, origin } = new URL(path));
    parts = pathname.split('/');
  } catch {
    // Treat as absolute path in OADA
    parts = path.split('/');
    origin = '';
  }

  // Preserve trailing slash
  const trailing = path.endsWith('/');

  yield* expand('/', parts);

  async function* expand(
    r: string,
    parts: readonly string[]
  ): AsyncGenerator<string> {
    let p = [...parts];
    let root = r;
    for (const part of parts) {
      p.shift();

      // Use minimatch for star etc.
      const mm = new Minimatch(part);

      // TODO: Better way to test for non-minimatch key??
      if (
        mm.set.length <= 1 &&
        !(mm.set[0]?.length > 1) &&
        ['string', 'undefined'].includes(typeof mm.set[0]?.[0])
      ) {
        // Just move on to next part
        root = join(root, part);
        continue;
      }

      // "Shell expand"
      try {
        // Get all children
        const { data: children } = await conn.get({ path: join('/', root) });
        if (!children || typeof children !== 'object') {
          // Don't expand strings and such
          throw new Error('No children');
        }

        // Test chilren against pattern
        for (const child in oadaify(children) as {}) {
          if (mm.match(child)) {
            // Yield any matching children
            yield* expand(join(root, child), p);
          }
        }
      } catch {
        // If we fail to expand, don't error just yield nothing
      }

      return;
    }

    yield origin + join('/', root + (trailing ? '/' : ''));
  }
}

/**
 * Handles reading in input.
 *
 * @param file File to which to output (or `-` for stdout)
 * @todo Support "file" in OADA instead of local fs
 */
export async function input<T>(
  conn: OADAClient,
  paths: string | string[],
  config: IConfig,
  handler: (source: AsyncIterable<T>) => AsyncGenerator<T>
): Promise<void> {
  for (const path of Array.isArray(paths) ? paths : [paths]) {
    const [source, ...chain] = inputChain(conn, path, config);
    return pipeline(
      source,
      // TODO: Why is TS mad here??
      // @ts-ignore
      ...chain,
      handler
    );
  }
}
// TODO: Clean up this mess...
async function outputChain(
  output: string,
  config: IConfig
): Promise<
  [...(Writable | ((source: AsyncIterable<any>) => AsyncGenerator<any>))[]]
> {
  switch (await outputType(output, config)) {
    case IOType.Tty:
      return [
        async function* (source) {
          for await (const data of source) {
            yield highlight(JSON.stringify(data, null, 2) + '\n', {
              language: 'json',
            });
          }
        },
        process.stdout,
      ];
    case IOType.Stdout:
      return [stringify(), process.stdout];
    case IOType.File:
      return [stringify(), createWriteStream(output)];
    case IOType.Url:
      return [
        async function* (source) {
          for await (const data of source) {
            yield request({ url: output, data });
          }
        },
      ];
  }
}

/**
 * Handles sending data to output.
 *
 * @param file File to which to output (or `-` for stdout)
 * @todo check for non-JSON
 */
export async function output(
  file: string,
  handler: () => AsyncGenerator,
  config: IConfig
) {
  const chain = await outputChain(file, config);

  // TODO: Why is TS mad here??
  // @ts-ignore
  return pipeline(handler, ...chain);
}
