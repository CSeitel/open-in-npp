/*
*/
//==============================================================================
  import * as ßß_assert from 'assert';
  import * as ßß_vscode from 'vscode';
  import * as ßß_path   from 'path';
// import * as myExtension from '../extension';

suite( 'Extension Test Suite', () => {

test( 'Execute Command', async () => {
  const ü_pid = <number> await ßß_vscode.commands.executeCommand( 'extension.openInNpp' );
//console.log( ü_pid );
  if ( ü_pid > 0 ) { process.kill( ü_pid ); }
  else {
    ßß_assert.fail( 'pid <= 0' );
  }
});

test( 'Second test', async () => {
  ßß_vscode.window.showInformationMessage( 'Done' );
});

});

//==============================================================================

async function prepareWs( ö_ws:typeof ßß_vscode.workspace ):Promise<void> {
//await prepareWs( ßß_vscode.workspace );
    //console.log( ö_ws.workspaceFile );
    //console.log( ö_ws.workspaceFolders );
//
  const ü_dir = ßß_path.normalize( __dirname + ßß_path.sep + 'empty' )
                       .replace( 'out', 'src' );
  const ü_uri = ßß_vscode.Uri.file( ü_dir );
  ö_ws.updateWorkspaceFolders( 0, null, { uri: ü_uri } );
//
  return new Promise<void>( (ö_resolve,ü_reject) => {
      console.log( ü_uri );
    ö_ws.onDidChangeWorkspaceFolders( ü_e => {
      console.log( ü_e.added );
      ö_resolve();
    });
  });
}

//==============================================================================
/*
*/