/*
*/
  import * as ßß_vsCode from 'vscode';
  import { i18n    as ßß_i18n
         , textIds as ßß_text
         } from './i18n';
//------------------------------------------------------------------------------
  import { CNaLineNumber
         , spawnProcess
         } from './implementation';
  import { ConfigSnapshot
         } from './configHandler';
//------------------------------------------------------------------------------
  const ß_showInformationMessage = ßß_vsCode.window.showInformationMessage;
  const ß_showWarningMessage     = ßß_vsCode.window.showWarningMessage    ;
  const ß_showErrorMessage       = ßß_vsCode.window.showErrorMessage      ;
//------------------------------------------------------------------------------
    const enum ESystemErrorCodes {
      ENOENT    = 'ENOENT'
    , ENOTDIR   = 'ENOTDIR'
    , EPERM     = 'EPERM'
    , ENOTEMPTY = 'ENOTEMPTY'
    }
export const enum EExtensionIds
    { fullName         = 'CSeitel.open-in-npp'
    , prefix           = 'openInNpp'
    , openInNppActive  = 'extension.openInNpp'
    , openInNppContext = 'extension.openInNppX'
    , openNppSettings  =           'openInNpp.openSettings'
    , openWbSettings   = 'workbench.action.openSettings'
    };
//------------------------------------------------------------------------------
  let ß_config:ConfigSnapshot;
//==============================================================================

export async function activate( ü_extContext: ßß_vsCode.ExtensionContext ) {
  //
    ß_config = await ConfigSnapshot.getInstance();
    try {
    } catch ( ü_eX ) {
      ß_showErrorMessage( ü_eX.message );
    }
  //
    let ü_disposable:ßß_vsCode.Disposable;
    ü_extContext.subscriptions.push(
      ßß_vsCode.commands.registerCommand( EExtensionIds.openInNppActive , ß_executeCommand )
    , ßß_vsCode.commands.registerCommand( EExtensionIds.openInNppContext, ß_executeCommand )
    , ßß_vsCode.commands.registerCommand( EExtensionIds.openNppSettings , ß_openSettings   )
    );
  //
    ßß_vsCode.workspace.onDidChangeConfiguration( ß_updateConfig );
  
}

export function deactivate() {}


async function ß_updateConfig( ü_change:ßß_vsCode.ConfigurationChangeEvent ):Promise<void> {
    if ( ü_change.affectsConfiguration( EExtensionIds.prefix ) ) {
      ß_config = await ConfigSnapshot.getInstance();
    //console.log( ß_config );
    }
}

async function ß_openSettings() {
    await ßß_vsCode.commands.executeCommand( EExtensionIds.openWbSettings, EExtensionIds.prefix );
}

//==============================================================================

async function ß_executeCommand( ü_fileUri:ßß_vsCode.Uri | undefined ):Promise<number> {
    const ü_activeEditor = ßß_vsCode.window.activeTextEditor;
  //
    let ü_selection :ßß_vsCode.Selection | undefined
    let ü_files     :string[]            | undefined
    let ü_fileName  :string
    if ( ü_fileUri === undefined ) {

      if ( ü_activeEditor === undefined ) {
        ß_showInformationMessage( ßß_i18n( ßß_text.no_active_file ) );
        return -1;
      }

                                       ü_fileName  = ü_activeEditor.document.fileName;
      if ( ß_config.preserveCursor ) { ü_selection = ü_activeEditor.selection; }
    } else { //-----------------------------------------------------------------
                                       ü_fileName  = ü_fileUri.fsPath;
      if ( ß_config.preserveCursor
        && ü_activeEditor                   !== undefined
        && ü_activeEditor.document.fileName === ü_fileName
                                   ) { ü_selection = ü_activeEditor.selection; }
      if ( ü_selection === undefined // selection = file
        && ( ß_config.filesInFolderPattern.length > 0 || ß_config.openFolderAsWorkspace )
        && await isDirectory( ü_fileUri )
         ) {
        ü_files = ß_config.filesInFolderPattern.length > 0
                ? await findFiles( ü_fileName, ß_config.filesInFolderPattern )
                : []
                ;
      }
    }
  //
    if ( ü_selection !== undefined
      && ü_selection.isEmpty
       ) { ß_config.  lineNumber = ü_selection.active.line      + 1;
           ß_config.columnNumber = ü_selection.active.character + 1; }
    else { ß_config.  lineNumber = CNaLineNumber;
           ß_config.columnNumber = CNaLineNumber; }
  //
  let ü_pid = -1;
  try {
    ü_pid = await spawnProcess( ß_config, ü_fileName, ü_files );
  } catch ( ü_eX ) {
    console.error( ü_eX );
    switch ( ü_eX.code ) {
      case 'UNKNOWN': ß_showErrorMessage( ßß_i18n( ßß_text.exe_not_found, ß_config.executable             ) ); break;
      case ESystemErrorCodes.ENOENT:
        if ( ! await exists( ß_config.workingDirectory, true ) ) {
          ß_showErrorMessage( `Not a valid working directory: "${ ß_config.workingDirectory }";  ${ ü_eX.message }` );
        }
        if ( ! await exists( ß_config.executable ) ) {
          ß_showErrorMessage( ßß_i18n( ßß_text.exe_error    , ß_config.executable, ü_eX.message ) );
        }
        break;
      default       : 
        ß_showErrorMessage( ßß_i18n( ßß_text.exe_error    , ß_config.executable, ü_eX.message ) );
    }
  }
//
  return ü_pid;
}

async function findFiles( ü_folder:string, ü_pattern:string ):Promise<string[]> {
    const ü_glob = new ßß_vsCode.RelativePattern( ü_folder, ü_pattern );
    const ü_hits = await ßß_vsCode.workspace.findFiles( ü_glob );
  //
    ß_showInformationMessage( `${ ü_hits.length } matches for "${ ü_pattern }" @ "${ ü_folder }"` );
  //
    return ü_hits.map( ü_fileUri => ü_fileUri.fsPath );
}

async function isDirectory( ü_fileUri:ßß_vsCode.Uri ):Promise<boolean> {
  //
      const ü_stat = await ßß_vsCode.workspace.fs.stat( ü_fileUri );
      return ü_stat.type === ßß_vsCode.FileType.Directory;
}

async function exists( ü_path:string, ü_isDirectory = false ):Promise<boolean> {
  //
    try {
      const ü_stat = await ßß_vsCode.workspace.fs.stat( ßß_vsCode.Uri.file( ü_path ) );
      return ü_isDirectory
           ? ü_stat.type === ßß_vsCode.FileType.Directory
           : true
           ;
    } catch ( ü_eX ) {
      console.log( ü_eX );
      return false;
    }
}

//==============================================================================
  //ü_disposable.dispose();
  //const ü_nls = process.env.VSCODE_NLS_CONFIG || '{}'; const ü_config = JSON.parse( ü_nls );
  //const ü_disposabl_ = ßß_vsCode.commands.registerTextEditorCommand( ß_IDs.openInNppActive, ß_a );
/*

async function ß_a( ü_editor: ßß_vsCode.TextEditor, ü_edit: ßß_vsCode.TextEditorEdit ) {
  const ü_selection = (() => {
  if ( ü_editor.selection.end.isAfter( ü_editor.selection.start ) ) {
                return ü_editor.selection;
  } else {
    const ü_lastLine = ü_editor.document.lineAt(ü_editor.document.lineCount - 1);
    return new ßß_vsCode.Selection(
             new ßß_vsCode.Position( 0, 0 )
           , new ßß_vsCode.Position( ü_lastLine.lineNumber, ü_lastLine.text.length )
                );
  }
        })();
  return ü_editor.edit( (builder) => {
            builder.replace(ü_selection, ü_editor.document.getText(ü_selection));
        });
}
*/