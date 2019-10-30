/*
http://code.visualstudio.com/docs/languages/markdown
https://help.github.com/articles/markdown-basics/
https://dev.azure.com/cseitel/
https://code.visualstudio.com/api/get-started/your-first-extension
https://phrase.com/blog/posts/step-step-guide-javascript-localization/
*/
import * as ßß_vsCode from 'vscode';
import * as ßß_fs     from 'fs'    ;
import { IConfig
       , isExe
       , defaultNppExecutable
       , spawnProcess } from './implementation';
  const ß_IDs = {
    Extension : 'extension.openInNpp' // package.json
  , Executable: 'openInNpp.Executable'
  , multiInst : 'openInNpp.multiInst'
  };
//==============================================================================

export function activate(ü_extContext: ßß_vsCode.ExtensionContext) {

  const disposable = ßß_vsCode.commands.registerCommand( ß_IDs.Extension, ß_executeCommand );

  ü_extContext.subscriptions.push( disposable );
}

export function deactivate() {}

//==============================================================================

async function ß_getConfig():Promise<IConfig> {
  const ü_config = ßß_vsCode.workspace.getConfiguration();
//
   let ü_exeName:string = ü_config.get( ß_IDs.Executable ) || '';
  if ( ü_exeName.length === 0 ) {
       ü_exeName = await defaultNppExecutable();
  } else if ( ! await isExe( ü_exeName ) ) {
    const msg = `Notepad++ executable not found: ${ ü_exeName }`;
    throw new Error( msg );
  }
//
  return { Executable: ü_exeName
         , multiInst: <boolean> ü_config.get( ß_IDs.multiInst )
         };
}

//------------------------------------------------------------------------------

async function ß_executeCommand():Promise<number> {
//
  const ü_activeEditor = ßß_vsCode.window.activeTextEditor;
  if ( ü_activeEditor === undefined ) {
    const msg = 'No Active File';
    ßß_vsCode.window.showInformationMessage( msg );
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
  return spawnProcess( ü_config, ü_fileName ).catch( eX => {
    const msg = `Exe_ ${ ü_config.Executable } Error ${ eX.message }`;
    ßß_vsCode.window.showErrorMessage( msg );
    return -1;
  });
//
}

//==============================================================================
/*
*/