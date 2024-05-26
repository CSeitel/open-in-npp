# Open in Notepad++

## Features

The command palette of [Visual Studio Code](https://code.visualstudio.com/) is enriched by an additional command for opening the active file with [Notepad++](https://notepad-plus-plus.org/).
Multiple configuration options are available (see below).

![](https://user-images.githubusercontent.com/43964178/68082571-cb03ab00-fe1e-11e9-8727-14cf950e0503.PNG)

### Keyboard Shortcut
A keyboard shortcut `Ctrl+K Ctrl+N` is set for triggering this command.

### Context Menus
The context menus of the _VS-Code_ editor and explorer are extended correspondingly by an additional entry.
This can be configured via the extension settings (see below).

### Whats's New (June 2024)
Support for displaying [_virtual documents_](https://code.visualstudio.com/api/extension-guides/virtual-documents) as described below by the corresponding configuration options

## Requirements

_Notepad++_ needs to be installed. See https://notepad-plus-plus.org/downloads/

## Extension Settings (Configuration Options)

The following settings are provided and can conveniently be accessed via command `Open Settings for 'Open in Notepad++'`:

#### Integration into _VS-Code_
* `openInNpp.extendExplorerContextMenu`: Add _Open in Notepad++_ to the context menu of the _VS-Code_ explorer (default: *true*)
* `openInNpp.extendEditorContextMenu`: Add _Open in Notepad++_ to the context menu of the _VS-Code_ editor (default: *true*)
* `openInNpp.decoupledExecution`: Run _Notepad++_ independently of _VS-Code_, in particular, do not close _Notepad++_ upon exit of _VS-Code_ (default: *true*); corresponds to option [detached](https://nodejs.org/api/child_process.html#child_process_options_detached) of child process creation
#### Cursor Position
* `openInNpp.preserveCursorPosition`: Let _Notepad++_ preserve the cursor position of the _VS-Code_ editor (default: *true*); corresponds to command line parameters [-n / -c](https://npp-user-manual.org/docs/command-prompt/); if set to *false* _Notepad++_ will position the cursor at the beginning of the first line
#### _Notepad++_ Execution
* `openInNpp.Executable`: Specifies the path of the _Notepad++_ executable; if not explicitly set a lookup in the following order is made
  1. `%ProgramFiles%\Notepad++\notepad++.exe`
  2. `%ProgramFiles(x86)%\Notepad++\notepad++.exe`
  3. `C:\Program Files\Notepad++\notepad++.exe`
  4. `C:\Program Files (x86)\Notepad++\notepad++.exe`
  5. `notepad++.exe` (fallback lookup via the folders of the Windows *%PATH%* environment variable)
* `openInNpp.workingDirectory`: Specifies the path of the folder used as [working directory](https://en.wikipedia.org/wiki/Working_directory) during the execution of _Notepad++_; if not explicitly set the folder containing the file to be opened is enforced as _working directory_ or - when a folder is opened - the folder itself is also used as _working directory_; if a relative path is specified here it will be based on the [first workspace folder](https://code.visualstudio.com/docs/editor/multi-root-workspaces) of _VS-Code_
#### Instances & Sessions
* `openInNpp.multiInst`: Open a separate [instance](https://npp-user-manual.org/docs/preferences/#multi-instance) of _Notepad++_ for each command execution (default: *false*); corresponds to command line parameter [-multiInst](https://npp-user-manual.org/docs/command-prompt/)
* `openInNpp.skipSessionHandling`: Prevent _Notepad++_ from loading the [previous session](https://npp-user-manual.org/docs/preferences/#backup) and changing its state (default: *false*); corresponds to command line parameter [-nosession](https://npp-user-manual.org/docs/command-prompt/)
#### Folder handling
* `openInNpp.openFolderAsWorkspace`: When passing a folder path along to _Notepad++_ let this folder be handled as a _workspace_ (default: *false*); corresponds to command line parameter [-openFoldersAsWorkspace](https://npp-user-manual.org/docs/command-prompt/)
* `openInNpp.filesInFolderPattern`: Instead of passing a folder path along to _Notepad++_ find all files (relative to this folder) matching the specified [glob pattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern) and let the result list become the arguments of the execution of _Notepad++_; _Notepad++_'s default handling of a folder path likely corresponds to applying the pattern _``**/*.*``_ (i.e. subfolders are recursively taken into account, due to this the pattern ``*.*`` is possibly a good choice)
#### Virtual Documents
* `openInNpp.virtualDocumentsDirectory`: When a file does not exist in the local filesystem as it is actually a [_virtual document_](https://code.visualstudio.com/api/extension-guides/virtual-documents) a _shadow_ copy of this document will automatically be created in the specified folder and then shown in _Notepad++_. If no folder is specified here an info message will present the options to either accept a file path comprising the _Windows_ standard temporary folder _%TEMP%_ or to perform a _File-Save-As_ selection.
* `openInNpp.virtualDocumentsFileReuse"`: When file reuse is enabled all _VS-Code_ editor instances referring to the same [_virtual document_](https://code.visualstudio.com/api/extension-guides/virtual-documents) will share a common file _shadow_ for being opened in _Notepad++_. Note that _VS-Code_ editor instances may show different versions of the same _virtual document_ and hence their contents may not be identical. As a consequence the contents of the shadow file will be overwritten to always reflect the particular version to be opened in _Notepad++_.
#### Expert Settings
* `openInNpp.commandLineArguments`: Specifies additional arguments to be passed along to _Notepad++_; a comprehensive overview of the command line parameters of _Notepad++_ is available [here](https://npp-user-manual.org/docs/command-prompt/)
* `openInNpp.spawnOptions`: Specifies additional options for child process creation; details are available [here](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
* `openInNpp.developerTrace`: Specifies whether extended information is logged to the _Developer Tools_ console



## How to

* Using a [shortcut/link](https://en.wikipedia.org/wiki/Shortcut_(computing)#Microsoft_Windows) as value for option `openInNpp.Executable`: the value _{ shell: true }_ for option `openInNpp.spawnOptions` is required when specifying a _Windows_ shortcut pointing to the _Notepad++_ executable



## Known Issues

* _None_:
Please report [here](https://github.com/CSeitel/open-in-npp/issues)

* _Good to know for expert setting `openInNpp.spawnOptions`_:
Issue [windowsverbatimarguments](https://stackoverflow.com/questions/78422012/executable-name-gets-argument-with-windowsverbatimarguments-true-node-child)

-----------------------------------------------------------------------------------------------------------

## Icon
Sponsored by [Icons8](https://icons8.com/)

-----------------------------------------------------------------------------------------------------------
### Source Code

[Git-Repository](https://github.com/CSeitel/open-in-npp)