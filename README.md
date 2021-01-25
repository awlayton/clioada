# clioada

CLI OADA

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/clioada.svg)](https://npmjs.org/package/clioada)
[![Downloads/week](https://img.shields.io/npm/dw/clioada.svg)](https://npmjs.org/package/clioada)
[![License](https://img.shields.io/npm/l/clioada.svg)](https://github.com/awlayton/clioada/blob/master/package.json)

<!-- toc -->
* [clioada](#clioada)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g clioada
$ oada COMMAND
running command...
$ oada (-v|--version|version)
clioada/1.0.0 linux-x64 node-v15.6.0
$ oada --help [COMMAND]
USAGE
  $ oada COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`oada autocomplete [SHELL]`](#oada-autocomplete-shell)
* [`oada delete PATHS...`](#oada-delete-paths)
* [`oada fs:copy PATHS... PATH`](#oada-fscopy-paths-path)
* [`oada fs:link PATHS... PATH`](#oada-fslink-paths-path)
* [`oada fs:move PATHS... PATH`](#oada-fsmove-paths-path)
* [`oada fs:remove PATHS...`](#oada-fsremove-paths)
* [`oada get PATHS...`](#oada-get-paths)
* [`oada head PATHS...`](#oada-head-paths)
* [`oada help [COMMAND]`](#oada-help-command)
* [`oada plugins`](#oada-plugins)
* [`oada plugins:install PLUGIN...`](#oada-pluginsinstall-plugin)
* [`oada plugins:link PLUGIN`](#oada-pluginslink-plugin)
* [`oada plugins:uninstall PLUGIN...`](#oada-pluginsuninstall-plugin)
* [`oada plugins:update`](#oada-pluginsupdate)
* [`oada post PATHS... PATH`](#oada-post-paths-path)
* [`oada put PATHS... PATH`](#oada-put-paths-path)

## `oada autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ oada autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ oada autocomplete
  $ oada autocomplete bash
  $ oada autocomplete zsh
  $ oada autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.3.0/src/commands/autocomplete/index.ts)_

## `oada delete PATHS...`

perform an OADA DELETE

```
USAGE
  $ oada delete PATHS...

ARGUMENTS
  PATHS...  OADA path(s) to GET

OPTIONS
  -R, --recursive
  --domain=domain  [default: localhost] default OADA API domain
  --token=token    [default: god] default OADA API token
  --[no-]tty       format output for TTY
  --[no-]ws        use WebSockets for OADA API

ALIASES
  $ oada d
  $ oada rm
  $ oada DELETE
```

_See code: [src/commands/delete.ts](https://github.com/awlayton/clioada/blob/v1.0.0/src/commands/delete.ts)_

## `oada fs:copy PATHS... PATH`

perform an "OADA copy"

```
USAGE
  $ oada fs:copy PATHS... PATH

ARGUMENTS
  PATHS...  path(s) to copy
  PATH      OADA path to which to copy

OPTIONS
  --domain=domain  [default: localhost] default OADA API domain
  --token=token    [default: god] default OADA API token
  --[no-]tty       format output for TTY
  --[no-]ws        use WebSockets for OADA API

ALIASES
  $ oada cp
```

_See code: [src/commands/fs/copy.ts](https://github.com/awlayton/clioada/blob/v1.0.0/src/commands/fs/copy.ts)_

## `oada fs:link PATHS... PATH`

perform an "OADA link"

```
USAGE
  $ oada fs:link PATHS... PATH

ARGUMENTS
  PATHS...  path(s) to link
  PATH      OADA path in which to link

OPTIONS
  -f, --force      delete conflicting existing data/links
  -r, --versioned  make versioned link(s)
  --domain=domain  [default: localhost] default OADA API domain
  --token=token    [default: god] default OADA API token
  --[no-]tty       format output for TTY
  --[no-]ws        use WebSockets for OADA API

ALIASES
  $ oada ln
```

_See code: [src/commands/fs/link.ts](https://github.com/awlayton/clioada/blob/v1.0.0/src/commands/fs/link.ts)_

## `oada fs:move PATHS... PATH`

perform an "OADA move"

```
USAGE
  $ oada fs:move PATHS... PATH

ARGUMENTS
  PATHS...  path(s) to move
  PATH      OADA path to which to move

OPTIONS
  --domain=domain  [default: localhost] default OADA API domain
  --token=token    [default: god] default OADA API token
  --[no-]tty       format output for TTY
  --[no-]ws        use WebSockets for OADA API

ALIASES
  $ oada mv
```

_See code: [src/commands/fs/move.ts](https://github.com/awlayton/clioada/blob/v1.0.0/src/commands/fs/move.ts)_

## `oada fs:remove PATHS...`

perform an OADA DELETE

```
USAGE
  $ oada fs:remove PATHS...

ARGUMENTS
  PATHS...  OADA path(s) to GET

OPTIONS
  -R, --recursive
  --domain=domain  [default: localhost] default OADA API domain
  --token=token    [default: god] default OADA API token
  --[no-]tty       format output for TTY
  --[no-]ws        use WebSockets for OADA API

ALIASES
  $ oada d
  $ oada rm
  $ oada DELETE
```

_See code: [src/commands/fs/remove.ts](https://github.com/awlayton/clioada/blob/v1.0.0/src/commands/fs/remove.ts)_

## `oada get PATHS...`

perform an OADA GET (read)

```
USAGE
  $ oada get PATHS...

ARGUMENTS
  PATHS...  OADA path(s) to GET

OPTIONS
  -R, --recursive
  -m, --meta
  -o, --out=out    [default: -]
  --domain=domain  [default: localhost] default OADA API domain
  --token=token    [default: god] default OADA API token
  --[no-]tty       format output for TTY
  --[no-]ws        use WebSockets for OADA API

ALIASES
  $ oada g
  $ oada GET

EXAMPLE
  $ oada get /bookmark
  {
     "_id": "resources/default:resources_bookmarks_321",
     "_rev": 45,
     "_type": "application/vnd.oada.bookmarks.1+json",
     "_meta": {
       "_id": "resources/default:resources_bookmarks_321/_meta",
       "_rev": 45
     }
  }
```

_See code: [src/commands/get.ts](https://github.com/awlayton/clioada/blob/v1.0.0/src/commands/get.ts)_

## `oada head PATHS...`

perform an OADA HEAD

```
USAGE
  $ oada head PATHS...

ARGUMENTS
  PATHS...  OADA path(s) to HEAD

OPTIONS
  --domain=domain  [default: localhost] default OADA API domain
  --token=token    [default: god] default OADA API token
  --[no-]tty       format output for TTY
  --[no-]ws        use WebSockets for OADA API

ALIASES
  $ oada h
  $ oada HEAD
```

_See code: [src/commands/head.ts](https://github.com/awlayton/clioada/blob/v1.0.0/src/commands/head.ts)_

## `oada help [COMMAND]`

display help for oada

```
USAGE
  $ oada help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `oada plugins`

list installed plugins

```
USAGE
  $ oada plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ oada plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/index.ts)_

## `oada plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ oada plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in 
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ oada plugins:add

EXAMPLES
  $ oada plugins:install myplugin 
  $ oada plugins:install https://github.com/someuser/someplugin
  $ oada plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/install.ts)_

## `oada plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ oada plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' 
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ oada plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/link.ts)_

## `oada plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ oada plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ oada plugins:unlink
  $ oada plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/uninstall.ts)_

## `oada plugins:update`

update installed plugins

```
USAGE
  $ oada plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/update.ts)_

## `oada post PATHS... PATH`

Perform an OADA POST

```
USAGE
  $ oada post PATHS... PATH

ARGUMENTS
  PATHS...  paths to POST
  PATH      destination OADA path

OPTIONS
  -R, --recursive
  --domain=domain  [default: localhost] default OADA API domain
  --token=token    [default: god] default OADA API token
  --[no-]tty       format output for TTY
  --[no-]ws        use WebSockets for OADA API

ALIASES
  $ oada po
  $ oada POST
```

_See code: [src/commands/post.ts](https://github.com/awlayton/clioada/blob/v1.0.0/src/commands/post.ts)_

## `oada put PATHS... PATH`

Perform an OADA PUT

```
USAGE
  $ oada put PATHS... PATH

ARGUMENTS
  PATHS...  paths to PUT
  PATH      destination OADA path

OPTIONS
  -R, --recursive
  --domain=domain  [default: localhost] default OADA API domain
  --token=token    [default: god] default OADA API token
  --[no-]tty       format output for TTY
  --[no-]ws        use WebSockets for OADA API

ALIASES
  $ oada pu
  $ oada PUT
```

_See code: [src/commands/put.ts](https://github.com/awlayton/clioada/blob/v1.0.0/src/commands/put.ts)_
<!-- commandsstop -->