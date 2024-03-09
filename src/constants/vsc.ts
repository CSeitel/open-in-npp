//--------------------------------------------------------------------
  export const enum CELanguageId {
      txt = 'plaintext'
    }
//====================================================================

  export const enum CEFileType {
      Unknown        =  0
    , File           =  1
    , Folder         =  2
    , SymLinkUnknown = 64
    , SymLinkFile    = 65
    , SymLinkFolder  = 66
    }

//====================================================================

  export const enum CEVscCommands {
      openWbSettings   = 'workbench.action.openSettings'
    , vsCodeOpen       = 'vscode.open'
    , revealInExplorer = 'revealInExplorer'
    , revealFileInOS   = 'revealFileInOS'
    }
