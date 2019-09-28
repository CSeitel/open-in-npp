  import * as ßß_vsCode from 'vscode';
  import * as ßß_cp     from 'child_process';
  import * as ßß_fs     from 'fs';
//==============================================================================
  const ß_id_cmd:string = 'extension.openInNpp';
  const ß_id_exe:string = 'openInNpp.Executable';
//==============================================================================
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ßß_vsCode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "open-in-npp" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = ßß_vsCode.commands.registerCommand( ß_id_cmd, ß_command );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

//==============================================================================

function ß_command() {
//
  const ü_activeEditor = ßß_vsCode.window.activeTextEditor;
  if ( ü_activeEditor === undefined ) {
    ßß_vsCode.window.showInformationMessage('Hello World!');
    return;
  }
  const ü_fileName = ü_activeEditor.document.fileName;
//
  const ü_config = ßß_vsCode.workspace.getConfiguration()
  const ü_exeName:string = ü_config.get( ß_id_exe ) || '';
  if ( ! ßß_fs.existsSync( ü_exeName ) ) {
    ßß_vsCode.window.showInformationMessage( `Exe not found: ${ ü_exeName }` );
    return;
  }
//
  const ü_proc = ßß_cp.execFile( ü_exeName, [ü_fileName],
   (err, stdout, stderr) => {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (err) {
        console.log('error: ' + err);
    }
});
    ßß_vsCode.window.showInformationMessage( 'Done' + ü_fileName );

}

//==============================================================================
/*
*/