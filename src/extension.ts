/*
*/
  import * as ßß_vsCode from 'vscode';
  import { i18n    as ßß_i18n
         , textIds as ßß_text
         } from './i18n';
//------------------------------------------------------------------------------
  import { ß_trc } from './trace';
  import { IConfig
         , defaultNppExecutable
         , spawnProcess
         } from './implementation';
  import { isExe
         } from './lib/any';
  import { ß_getConfig
         , ß_parseConfig
         } from './configHandler';
//------------------------------------------------------------------------------
  const ß_showInformationMessage = ßß_vsCode.window.showInformationMessage;
  const ß_showWarningMessage     = ßß_vsCode.window.showWarningMessage    ;
  const ß_showErrorMessage       = ßß_vsCode.window.showErrorMessage      ;
//==============================================================================
  const ß_IDs = {
    openInNppActive : 'extension.openInNpp'
  , openInNppCurrent: 'extension.openInNppX'
  , Executable    : 'openInNpp.Executable'
  , multiInst     : 'openInNpp.multiInst'
  , preserveCursor: 'openInNpp.preserveCursorPosition'
  };
//------------------------------------------------------------------------------
  let ß_config:IConfig;
  let ß_previousExecutable:string | undefined ;
//==============================================================================

export async function activate( ü_extContext: ßß_vsCode.ExtensionContext ) {
  ß_config = ß_getConfig();
  try {
    await ß_parseConfig( ß_config );
  } catch ( ü_eX ) {
    ß_showErrorMessage( ü_eX.message );
  }
//
//
  let ü_disposable:ßß_vsCode.Disposable;
  ü_extContext.subscriptions.push(
                   ßß_vsCode.commands.registerCommand( ß_IDs.openInNppActive , ß_executeCommand )
  , ü_disposable = ßß_vsCode.commands.registerCommand( ß_IDs.openInNppCurrent, ß_executeCommand )
  );

//ü_disposable.dispose();
//const ü_nls = process.env.VSCODE_NLS_CONFIG || '{}'; const ü_config = JSON.parse( ü_nls );
//const ü_disposabl_ = ßß_vsCode.commands.registerTextEditorCommand( ß_IDs.openInNppActive, ß_a );
}

export function deactivate() {}

//==============================================================================

async function ß_executeCommand( ü_fileUri:ßß_vsCode.Uri | undefined ):Promise<number> {
  let ü_pid = -1;
//
  let ü_fileName:string;
  const ü_activeEditor = ßß_vsCode.window.activeTextEditor;
  if ( ü_activeEditor === undefined ) {
    if ( ü_fileUri === undefined ) {
      ß_showInformationMessage( ßß_i18n( ßß_text.no_active_file ) );
      return -1;
    } else {
      ü_fileName = ü_fileUri.fsPath;
    }
  } else {
    if ( ü_fileUri === undefined ) {
      ü_fileName = ü_activeEditor.document.fileName;
    } else {
      ü_fileName = ü_fileUri.fsPath;
    }
    if ( ß_config.preserveCursor
      && ü_activeEditor.selection.isEmpty
      && ü_activeEditor.document.fileName === ü_fileName
       ) {
      ß_config.lineNumber = 1 + ü_activeEditor.selection.active.line;
      if(ß_trc){ß_trc( ß_config.lineNumber );}
    }
  }
//
  if(ß_trc){ß_trc( ü_fileName );}
//
  try {
    ü_pid = await spawnProcess( ß_config, ü_fileName );
  } catch ( ü_eX ) {
    console.log( ü_eX );
    switch ( ü_eX.code ) {
      case 'UNKNOWN': ß_showErrorMessage( ßß_i18n( ßß_text.exe_not_found, ß_config.executable             ) ); break;
      default       : ß_showErrorMessage( ßß_i18n( ßß_text.exe_error    , ß_config.executable, ü_eX.message ) );
    }
    ß_previousExecutable = undefined; // store failure
  }
//
  return ü_pid;
}

//==============================================================================

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

//==============================================================================
/*
*/