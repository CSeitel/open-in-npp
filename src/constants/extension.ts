/*
*/
  export const SINITIAL = Symbol();
  export type  TINITIAL = typeof SINITIAL
//--------------------------------------------------------------------
  export type TExtensionConfig = {
      [P in EConfigurationIds] :{ type:string }
    }
  export const CExtensionId  = 'CSeitel.open-in-npp';
  export const CExtensionUrl = 'https://marketplace.visualstudio.com/items/CSeitel.open-in-npp';
//export const CExtensionUrl = 'https://marketplace.visualstudio.com/items?itemName=CSeitel.open-in-npp';
//====================================================================
  export const enum CECommands {
      oSettings = 'openInNpp.openSettings'
    , oActive   = 'extension.openInNpp'
    , oEditor   = 'extension.openInNppX'
    , oExplorer = 'extension.openInNppY'
    };
//--------------------------------------------------------------------
  export const enum EConfigurationIds {
      extendExplorerContextMenu = 'openInNpp.extendExplorerContextMenu'
    , extendEditorContextMenu   = 'openInNpp.extendEditorContextMenu'
    , extendEditorTitleMenu     = 'openInNpp.extendEditorTitleMenu'
  //
    , executable                = 'openInNpp.Executable'
    , spawnOptions              = 'openInNpp.spawnOptions'
    , workingDirectory          = 'openInNpp.workingDirectory'
    , decoupledExecution        = 'openInNpp.decoupledExecution'
    , commandLineArguments      = 'openInNpp.commandLineArguments'
    , multiInst                 = 'openInNpp.multiInst'
    , skipSessionHandling       = 'openInNpp.skipSessionHandling'
  //
    , openFolderAsWorkspace     = 'openInNpp.openFolderAsWorkspace'
    , filesInFolderPattern      = 'openInNpp.filesInFolderPattern'
    , matchingFilesLimit        = 'openInNpp.matchingFilesLimit'
    , preserveCursor            = 'openInNpp.preserveCursorPosition'
    };
//====================================================================
/*
*/