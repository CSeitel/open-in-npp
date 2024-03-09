/*
*/
  export const SINITIAL = Symbol();
  export type  TINITIAL = typeof SINITIAL
//--------------------------------------------------------------------
  export type TXtnConfigKeys = keyof typeof EConfigurationIds
  export type TXtnConfigJSON = Record<TXtnConfigKeys,{ type:string }>
//--------------------------------------------------------------------
  export const CXtnTxtScheme = 'open-in-npp-echo-text';
  export const CXtnId  = 'CSeitel.open-in-npp';
  export const CExtensionUrl = 'https://marketplace.visualstudio.com/items/CSeitel.open-in-npp';
//export const CExtensionUrl = 'https://marketplace.visualstudio.com/items?itemName=CSeitel.open-in-npp';
//====================================================================
  export const enum CEXtnCommands {
      oSettings = 'openInNpp.openSettings'
    , oActive   = 'extension.openInNpp'
    , oEditor   = 'extension.openInNppX'
    , oExplorer = 'extension.openInNppY'
    };
//--------------------------------------------------------------------
  export const CPrefix = 'openInNpp';
  export const EConfigurationIds = {
      extendExplorerContextMenu : 'openInNpp.extendExplorerContextMenu'
    , extendEditorContextMenu   : 'openInNpp.extendEditorContextMenu'
    , extendEditorTitleMenu     : 'openInNpp.extendEditorTitleMenu'
  //
    , executable                : 'openInNpp.Executable'
    , spawnOptions              : 'openInNpp.spawnOptions'
    , workingDirectory          : 'openInNpp.workingDirectory'
    , decoupledExecution        : 'openInNpp.decoupledExecution'
    , commandLineArguments      : 'openInNpp.commandLineArguments'
    , multiInst                 : 'openInNpp.multiInst'
    , skipSessionHandling       : 'openInNpp.skipSessionHandling'
  //
    , openFolderAsWorkspace     : 'openInNpp.openFolderAsWorkspace'
    , filesInFolderPattern      : 'openInNpp.filesInFolderPattern'
    , matchingFilesLimit        : 'openInNpp.matchingFilesLimit'
    , virtualDocumentsDirectory : 'openInNpp.virtualDocumentsDirectory'
    , preserveCursor            : 'openInNpp.preserveCursorPosition'
  //
    , developerTrace            : 'openInNpp.developerTrace'
    };
//====================================================================
  export const enum CETrigger
    { None   = 0
    , UNTITLED
    , PALETTE
    , EDITOR
    , EXPLORER
    };
  export const enum CEExecutable
    { x64_64bit  =          "%ProgramFiles%\\Notepad++\\notepad++.exe"
    , x64_64bit_ =       "C:\\Program Files\\Notepad++\\notepad++.exe"
    , x86_32bit  =      "%PrograFiles(x86)%\\Notepad++\\notepad++.exe"
    , x86_32bit_ = "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
    , path_env   =                                     "notepad++.exe"
    };
//--------------------------------------------------------------------
  export const enum CECliArgument
    { multipleInstances      = '-multiInst'
    , openFoldersAsWorkspace = '-openFoldersAsWorkspace'
    , skipSessionHandling    = '-nosession'
    ,   lineNumber           = '-n'
    , columnNumber           = '-c'
    };
//====================================================================
/*
*/