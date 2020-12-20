/*
*/
  import * as ßß_vsCode from 'vscode';
  import * as ßß_assert from 'assert';
  import * as ßß_path   from 'path';
// import * as myExtension from '../extension';
  import { expandEnvVariables
         , whenDelay
         } from '../../../lib/any';
//------------------------------------------------------------------------------
//==============================================================================

class VscTestSpec {

static async test_0():Promise<void> {
    const ü_folders = ßß_vsCode.workspace.workspaceFolders;
    console.log( __dirname, ü_folders );
}

static async test_2():Promise<void> {
    const ü_delay = await whenDelay( 4000 );
    console.log( ü_delay );
    const ü_act = expandEnvVariables( '%TEMP%' );
    const ü_exp = process.env.TEMP;
    ßß_assert.strictEqual( ü_act, ü_exp );
    ßß_vsCode.window.showInformationMessage( 'Done' );
}

static async openInNpp():Promise<void> {
    const ü_pid = ( await ßß_vsCode.commands.executeCommand<number>( 'extension.openInNpp' ) )!;
    if ( ü_pid > 0 ) { process.kill( ü_pid ); }
    else {
      ßß_assert.fail( 'pid <= 0' );
    }
}

}

//==============================================================================

async function prepareWs( ö_ws:typeof ßß_vsCode.workspace ):Promise<void> {
//
  const ü_dir = ßß_path.normalize( __dirname + ßß_path.sep + 'empty' )
                       .replace( 'out', 'src' );
  const ü_uri = ßß_vsCode.Uri.file( ü_dir );
  ö_ws.updateWorkspaceFolders( 0, null, { uri: ü_uri } );
//
  return new Promise<void>( (ö_resolve,ü_reject) => {
    ö_ws.onDidChangeWorkspaceFolders( ü_e => {
      ö_resolve();
    });
  });
}

//==============================================================================
export default VscTestSpec;