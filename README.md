# Open in Notepad++

## Features

The command palette of [Visual Studio Code](https://code.visualstudio.com/) is enriched by an additional command for opening the active file with [Notepad++](https://notepad-plus-plus.org/).
Multiple configuration options are available (see below).

![](https://user-images.githubusercontent.com/43964178/68082571-cb03ab00-fe1e-11e9-8727-14cf950e0503.PNG)

### Keyboard Shortcut
A keyboard shortcut `Ctrl+K Ctrl+N` is set for triggering this command.

### Context menus
The context menus of the _VS-Code_ editor and explorer are extended correspondingly by an additional entry.
This can be configured via the extension settings (see below).

## Requirements

_Notepad++_ needs to be installed. See https://notepad-plus-plus.org/downloads/

## Extension Settings

The following settings are provided and can conveniently be opened via command `Open Settings for 'Open in Notepad++'`:

* `openInNpp.Executable`: Specifies the path of the _Notepad++_ executable; if not set a lookup in the following order is made
  1. `%ProgramFiles%\Notepad++\notepad++.exe`
  2. `%ProgramFiles(x86)%\Notepad++\notepad++.exe`
  3. `C:\Program Files\Notepad++\notepad++.exe`
  4. `C:\Program Files (x86)\Notepad++\notepad++.exe`
  5. `notepad++.exe` (fallback lookup via the folders of the Windows *%PATH%* environment variable)
* `openInNpp.spawnOptions`: Expert mode: Specifies additional options for child process creation; details are available [here](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
* `openInNpp.workingDirectory`: Specifies the path of the folder used as [working directory](https://en.wikipedia.org/wiki/Working_directory) during the execution of _Notepad++_; if not set the folder containing the file to be opened is enforced as _working directory_ or - when a folder is opened - the folder itself is also used as _working directory_; if a relative path is specified here it will be based on the [first workspace folder](https://code.visualstudio.com/docs/editor/multi-root-workspaces) of _VS-Code_
* `openInNpp.decoupledExecution`: Run _Notepad++_ independently of _VS-Code_, in particular, do not close _Notepad++_ upon exit of _VS-Code_ (default: *true*); corresponds to option [detached](https://nodejs.org/api/child_process.html#child_process_options_detached) of child process creation
* `openInNpp.commandLineArguments`: Specifies additional arguments to be passed along to _Notepad++_; a comprehensive overview of the command line parameters of _Notepad++_ is available [here](https://npp-user-manual.org/docs/command-prompt/)
* `openInNpp.multiInst`: Open a separate [instance](https://npp-user-manual.org/docs/preferences/#multi-instance) of _Notepad++_ for each command execution (default: *false*); corresponds to command line parameter [-multiInst](https://npp-user-manual.org/docs/command-prompt/)
* `openInNpp.skipSessionHandling`: Prevent _Notepad++_ from loading the [previous session](https://npp-user-manual.org/docs/preferences/#backup) and changing its state (default: *false*); corresponds to command line parameter [-nosession](https://npp-user-manual.org/docs/command-prompt/)
* `openInNpp.openFolderAsWorkspace`: When passing a folder path along to _Notepad++_ let this folder be handled as a _workspace_ (default: *false*); corresponds to command line parameter [-openFoldersAsWorkspace](https://npp-user-manual.org/docs/command-prompt/)
* `openInNpp.filesInFolderPattern`: Instead of passing a folder path along to _Notepad++_ find all files (relative to this folder) matching the specified [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) and let the result list become the arguments of the execution of _Notepad++_; _Notepad++_'s default handling of a folder path likely corresponds to applying the pattern _``**/*.*``_ (i.e. subfolders are recursively taken into account, due to this the pattern ``*.*`` is possibly a good choice)
* `openInNpp.preserveCursorPosition`: Let _Notepad++_ preserve the cursor position of the _VS-Code_ editor (default: *true*); corresponds to command line parameters [-n / -c](https://npp-user-manual.org/docs/command-prompt/); if set to *false* _Notepad++_ will position the cursor on the first line
* `openInNpp.extendExplorerContextMenu`: Add _Open in Notepad++_ to the context menu of the _VS-Code_ explorer (default: *true*)
* `openInNpp.extendEditorContextMenu`: Add _Open in Notepad++_ to the context menu of the _VS-Code_ editor (default: *true*)


## Known Issues

* _None_
[Please report @](https://github.com/CSeitel/open-in-npp/issues)

-----------------------------------------------------------------------------------------------------------

## Icon
Sponsored by [Icons8](https://icons8.com/)

-----------------------------------------------------------------------------------------------------------
### Source Code

[Git-Repository](https://github.com/CSeitel/open-in-npp)