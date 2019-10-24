/*
http://code.visualstudio.com/docs/languages/markdown
https://help.github.com/articles/markdown-basics/
https://dev.azure.com/cseitel/
https://code.visualstudio.com/api/get-started/your-first-extension
https://phrase.com/blog/posts/step-step-guide-javascript-localization/
*/
  import * as ßß_vsCode from 'vscode';
  import * as ßß_impl   from './implementation';
  import * as ßß_cp     from 'child_process';
  import * as ßß_fs     from 'fs';
  import * as ßß_util   from 'util';
//==============================================================================
  const ß_id_cmd:string = 'extension.openInNpp' ; // package.json
  const ß_id_exe:string = 'openInNpp.Executable';
  const ß_id_mi :string = 'openInNpp.multiInst' ;
  const ß_exe_path = {
    x86_32bit: "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
  , x64_64bit: "C:\\Program Files\\Notepad++\\notepad++.exe"
  , path_env: "notepad++.exe"
  , previous: ""
  }
//==============================================================================
export function activate(ü_extContext: ßß_vsCode.ExtensionContext) {

  const disposable = ßß_vsCode.commands.registerCommand( ß_id_cmd, ß_commandImpl );

  ü_extContext.subscriptions.push( disposable );
}

export function deactivate() {}

//==============================================================================

interface IConfig {
  exeName: string;
  mi: boolean;
}

function ß_getConfig():IConfig | null {
  const ü_config = ßß_vsCode.workspace.getConfiguration();
//
   let ü_exeName:string = ü_config.get( ß_id_exe ) || '';
  if ( ü_exeName.length === 0 ) {
         if (                   ß_exe_path.previous.length > 0
           && ßß_fs.existsSync( ß_exe_path.previous  ) ) { ü_exeName = ß_exe_path.previous ; }
    else if ( ßß_fs.existsSync( ß_exe_path.x64_64bit ) ) { ü_exeName = ß_exe_path.previous = ß_exe_path.x64_64bit; }
    else if ( ßß_fs.existsSync( ß_exe_path.x86_32bit ) ) { ü_exeName = ß_exe_path.previous = ß_exe_path.x86_32bit; }
    else                                                 { ü_exeName = ß_exe_path.previous = ß_exe_path.path_env ; }
  } else if ( ! ßß_fs.existsSync( ü_exeName ) ) {
      ßß_vsCode.window.showInformationMessage( `Notepad++ executable not found: ${ ü_exeName }` );
      return null;
  }
//
  return { exeName: ü_exeName
         , mi: <boolean> ü_config.get( ß_id_mi )
         };
}

function ß_commandImpl() {
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
  ü_config = ( <IConfig> ü_config );
//
  let ü_args = [ü_fileName];
  if ( ü_config.mi ) {
    ü_args.push( "-multiInst" ); 
  }
//
  const execFile = ßß_util.promisify( ßß_cp.execFile );
  execFile( ü_config.exeName, ü_args ).then( ü_proc => {
    ßß_vsCode.window.showInformationMessage( 'XXXX ' + ü_fileName );
  });
  return;
//

}

//==============================================================================
/*
  const ü_proc = ßß_cp.execFile( ü_config.exeName, ü_args, ß_callback );
function ß_callback( err: Error | null, stdout: string, stderr: string) {
  //console.log('stdout: ' + stdout);
  //console.log('stderr: ' + stderr);
  if ( err ) {
        console.error( 'error: ' + err );
  } else {
  }
}
*/