# open-in-npp README

## Features

This installs a command palette for opening the active file with [Notepad++](https://notepad-plus-plus.org/).

[feature X](images/VSC.png)


## Requirements

Notepad++ needs to be installed.
https://notepad-plus-plus.org/downloads/

## Extension Settings

The following settings are provided:

* `openInNpp.Executable`: Specifies the path of the Notepad++ executable, if not set a lookup in the following order is made
  - 1. `C:\Program Files\Notepad++\notepad++.exe` or
  - `C:\Program Files (x86)\Notepad++\notepad++.exe`
  - 2. path_env: `notepad++.exe`
* `openInNpp.multiInst` : Open a separate instance of Notepad++ for each command execution

## Known Issues

... not yet

-----------------------------------------------------------------------------------------------------------

## Release Notes

### 0.0.1

Initial release