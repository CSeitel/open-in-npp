# open-in-npp (Notepad++)

## Features

The command palette of [Visual Studio Code](https://code.visualstudio.com/) is enriched by an additional command for opening the active file with [Notepad++](https://notepad-plus-plus.org/).

![](https://user-images.githubusercontent.com/43964178/68082571-cb03ab00-fe1e-11e9-8727-14cf950e0503.PNG)

### Keyboard Shortcut
A keyboard shortcut `Ctrl+K Ctrl+N` is set for triggering this command.

### Context menus
The context menus of the VS Code editor and explorer are extended correspondingly by an additional entry.

## Requirements

Notepad++ needs to be installed. See https://notepad-plus-plus.org/downloads/

## Extension Settings

The following settings are provided:

* `openInNpp.Executable`: Specifies the path of the Notepad++ executable, if not set a lookup in the following order is made
  1. `C:\Program Files\Notepad++\notepad++.exe`
  2. `C:\Program Files (x86)\Notepad++\notepad++.exe`
  3. `notepad++.exe` (fallback lookup via the folders of the Windows *PATH* environment variable)
* `openInNpp.multiInst`: Open a separate instance of Notepad++ for each command execution (default: *false*)
* `openInNpp.preserveCursorPosition`: Let Notepad++ preserve the cursor position of the VS Code editor (default: *true*); if set to *false*  Notepad++ will position the cursor on the first line
* `openInNpp.extendExplorerContextMenu`: The context menu of the explorer will be extended by *Open in Notepad++*
* `openInNpp.extendEditorContextMenu`: The context menu of the editor will be extended by *Open in Notepad++*

## Known Issues

... not yet; tested on Windows 10 64bit only

-----------------------------------------------------------------------------------------------------------

## Icon
[Icons8](https://icons8.com/)

-----------------------------------------------------------------------------------------------------------
### Source Code

[Git-Repository](https://github.com/CSeitel/open-in-npp)