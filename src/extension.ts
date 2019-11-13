/*
*/
import * as ßß_vsCode from 'vscode';
import * as ßß_fs     from 'fs'    ;
import { i18n    as ßß_i18n,
         textIds as ßß_text }    from './i18n';
//------------------------------------------------------------------------------
import { IConfig
       , isExe
       , defaultNppExecutable
       , spawnProcess } from './implementation';
//==============================================================================
  const ß_IDs = {
    Extension : 'extension.openInNpp' // package.json
  , Executable: 'openInNpp.Executable'
  , multiInst : 'openInNpp.multiInst'
  };
  let ß_previousExecutable:string | undefined ;
//==============================================================================

export function activate(ü_extContext: ßß_vsCode.ExtensionContext) {

  const ü_disposable = ßß_vsCode.commands.registerCommand( ß_IDs.Extension, ß_executeCommand );
  ü_extContext.subscriptions.push( ü_disposable );

//const ü_nls = process.env.VSCODE_NLS_CONFIG || '{}'; const ü_config = JSON.parse( ü_nls );
}

export function deactivate() {}

//==============================================================================

async function ß_getConfig():Promise<IConfig> {
//
  const ü_config = ßß_vsCode.workspace.getConfiguration();
  let ü_exeName:string = ü_config.get( ß_IDs.Executable ) || '';
  const ü_change = ß_previousExecutable !== ü_exeName;
//
  if ( ü_exeName.length === 0 ) { // default
    ü_exeName = ü_change
              ? await defaultNppExecutable()
              : <string> ß_previousExecutable
              ;
  } else if ( ü_change
           && ! await isExe( ü_exeName ) ) {
    throw new Error( ßß_i18n( ßß_text.exe_not_found, ü_exeName ) );
  }
//
  return { executable: ß_previousExecutable = ü_exeName
         , multiInst: <boolean> ü_config.get( ß_IDs.multiInst )
         , detached: true
         , lineNumber: 0
         };
}

//------------------------------------------------------------------------------

async function ß_executeCommand():Promise<number> {
//
  const ü_activeEditor = ßß_vsCode.window.activeTextEditor;
  if ( ü_activeEditor === undefined ) {
    ßß_vsCode.window.showInformationMessage( ßß_i18n( ßß_text.no_active_file ) );
    return -1;
  }
  const ü_fileName = ü_activeEditor.document.fileName;
//
  let ü_config:IConfig;
  try {
    ü_config = await ß_getConfig();
  } catch ( eX ) {
    ßß_vsCode.window.showErrorMessage( eX.message );
    return -1;
  }
//
  if ( ü_activeEditor.selection.isEmpty ) {
    ü_config.lineNumber = 1 + ü_activeEditor.selection.active.line;
  //console.log( ü_config.lineNumber );
  }
//
  return spawnProcess( ü_config, ü_fileName ).catch( eX => {
    console.error( eX );
    switch ( eX.code ) {
      case 'UNKNOWN': ßß_vsCode.window.showErrorMessage( ßß_i18n( ßß_text.exe_not_found, ü_config.executable             ) ); break;
      default       : ßß_vsCode.window.showErrorMessage( ßß_i18n( ßß_text.exe_error    , ü_config.executable, eX.message ) );
    }
    ß_previousExecutable = undefined; // store failure
    return -1;
  });
//
}

//==============================================================================
/*
*/