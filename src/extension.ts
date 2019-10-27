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
       , defaultNppExecutable
       , spawnProcess } from 'open-in-npp/src/implementation';
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

function ß_getConfig():IConfig | null {
  const ü_config = ßß_vsCode.workspace.getConfiguration();
//
   let ü_exeName:string = ü_config.get( ß_IDs.Executable ) || '';
  if ( ü_exeName.length === 0 ) { ü_exeName = defaultNppExecutable();
  } else if ( ! ßß_fs.existsSync( ü_exeName ) ) {
      ßß_vsCode.window.showErrorMessage( `Notepad++ executable not found: ${ ü_exeName }` );
      return null;
  }
//
  return { Executable: ü_exeName
         , multiInst: <boolean> ü_config.get( ß_IDs.multiInst )
         };
}

//------------------------------------------------------------------------------

function ß_executeCommand() {
//
  const ü_activeEditor = ßß_vsCode.window.activeTextEditor;
  if ( ü_activeEditor === undefined ) {
    ßß_vsCode.window.showInformationMessage( 'No Active File' );
    return;
  }
  const ü_fileName = ü_activeEditor.document.fileName;
//
  let ü_config = ß_getConfig();
  if ( ü_config == null ) {
    return;
  }
//
  spawnProcess( <IConfig> ü_config, ü_fileName );
  return;
}

//==============================================================================