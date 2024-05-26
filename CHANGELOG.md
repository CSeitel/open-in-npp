# Change Log

## [0.0.4] - 2019-11-03
This is the initial release. 

## [0.0.5] - 2019-11-14
### Added
- editor context menu entry: `Open in Notepad++`
- configuration option: `openInNpp.preserveCursorPosition`

## [0.1.0] - 2019-11-27
### Added
- explorer context menu entry: `Open in Notepad++`
- configuration options:
  1. `openInNpp.extendExplorerContextMenu`
  2. `openInNpp.extendEditorContextMenu`

## [0.1.5] - 2020-06-02
### Added

- command: `Open Settings for 'Open in Notepad++'`
- configuration options:
  1. `openInNpp.spawnOptions`
  2. `openInNpp.workingDirectory`
  3. `openInNpp.decoupledExecution`
  4. `openInNpp.commandLineArguments`
  5. `openInNpp.skipSessionHandling`
  6. `openInNpp.openFolderAsWorkspace`
  7. `openInNpp.filesInFolderPattern`
- enablement of option `openInNpp.Executable` for consumption of path names containing windows environment variables

## [0.2.0] - 2024-05-30
### Added

- Handling of [_Virtual Documents_](https://code.visualstudio.com/api/extension-guides/virtual-documents)
- configuration options:
  1. `openInNpp.virtualDocumentsDirectory`
  2. `openInNpp.virtualDocumentsFileReuse`
  3. `openInNpp.developerTrace`