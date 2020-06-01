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
//
  const ü_dir = ßß_path.normalize( __dirname + ßß_path.sep + 'empty' )
                       .replace( 'out', 'src' );
  const ü_uri = ßß_vscode.Uri.file( ü_dir );
  ö_ws.updateWorkspaceFolders( 0, null, { uri: ü_uri } );
//
  return new Promise<void>( (ö_resolve,ü_reject) => {
    ö_ws.onDidChangeWorkspaceFolders( ü_e => {
      ö_resolve();
    });
  });
}

//==============================================================================
/*
*/