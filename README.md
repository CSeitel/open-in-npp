# open-in-npp (Notepad++)

## Features

The command palette is enriched by an additional command for opening the active file with [Notepad++](https://notepad-plus-plus.org/).

![](images/VSC.png)

## Keyboard Shortcut
A keyboard shortcut `Ctrl+K Ctrl+N` is set for triggering this command.

## Requirements

Notepad++ needs to be installed. See https://notepad-plus-plus.org/downloads/

## Extension Settings

The following settings are provided:

* `openInNpp.Executable`: Specifies the path of the Notepad++ executable, if not set a lookup in the following order is made
  - 1. `C:\Program Files\Notepad++\notepad++.exe`
  - 2. `C:\Program Files (x86)\Notepad++\notepad++.exe`
  - 3. `notepad++.exe` (Fallback lookup via the folders of the Windows *PATH* environment variable)
* `openInNpp.multiInst` : Open a separate instance of Notepad++ for each command execution

## Known Issues

... not yet; tested on Windows 10 64bit only

-----------------------------------------------------------------------------------------------------------

## Release Notes

### 0.0.1

Initial release