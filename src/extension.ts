/*
*/
  import * as ßß_vsCode from 'vscode';
  import { i18n    as ßß_i18n
         , textIds as ßß_text
         } from './i18n';
//------------------------------------------------------------------------------
  import { ß_trc } from './trace';
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
  const enum EExtensionIds
    { openInNppActive  = 'extension.openInNpp'
    , openInNppContext = 'extension.openInNppX'
    , openNppSettings  =           'openInNpp.openSettings'
    , openWbSettings   = 'workbench.action.openSettings'
    , prefix           = 'openInNpp'
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
    if ( ü_change.affectsConfiguration( 'openInNpp' ) ) {
      console.log( 'config' );
    ß_config = await ConfigSnapshot.getInstance();
    //ß_config = new ConfigSnapshot();
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
    let ü_fileName  :string
    if ( ü_fileUri === undefined ) {

      if ( ü_activeEditor === undefined ) {
        ß_showInformationMessage( ßß_i18n( ßß_text.no_active_file ) );
        return -1;
      }

                                       ü_fileName  = ü_activeEditor.document.fileName;
      if ( ß_config.preserveCursor ) { ü_selection = ü_activeEditor.selection; }
    } else {
      const ü_isFolder = await isDirectory( ü_fileUri );
                                       ü_fileName  = ü_fileUri.fsPath;
      if ( ß_config.preserveCursor
        && ! ü_isFolder
        && ü_activeEditor !== undefined 
        && ü_activeEditor.document.fileName === ü_fileName
                                   ) { ü_selection = ü_activeEditor.selection; }
    }
  //
    if ( ü_selection !== undefined
       && ü_selection.isEmpty
       ) { ß_config.  lineNumber = ü_selection.active.line      + 1;
           ß_config.columnNumber = ü_selection.active.character + 1; }
    else { ß_config.  lineNumber = CNaLineNumber;
           ß_config.columnNumber = CNaLineNumber; }
  //
    if(ß_trc){ß_trc( ß_config.lineNumber );}
    if(ß_trc){ß_trc( ü_fileName );}
//
  let ü_pid = -1;
  try {
    ü_pid = await spawnProcess( ß_config, ü_fileName );
  } catch ( ü_eX ) {
    console.log( ü_eX );
    switch ( ü_eX.code ) {
      case 'UNKNOWN': ß_showErrorMessage( ßß_i18n( ßß_text.exe_not_found, ß_config.executable             ) ); break;
      default       : ß_showErrorMessage( ßß_i18n( ßß_text.exe_error    , ß_config.executable, ü_eX.message ) );
    }
  }
//
  return ü_pid;
}

async function isDirectory( ü_fileUri:ßß_vsCode.Uri ):Promise<boolean> {
  //
    const ü_stat = await ßß_vsCode.workspace.fs.stat( ü_fileUri );
    return ü_stat.type === ßß_vsCode.FileType.Directory;
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