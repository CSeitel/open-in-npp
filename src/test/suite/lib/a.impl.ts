/*
*/
  import * as ßß_vsCode from 'vscode';
  import * as ßß_assert from 'assert';
  import * as ßß_path   from 'path';
//------------------------------------------------------------------------------
/*
*/
  import   ExtensionRuntime
           from '../../../extension';
  import { History
         } from '../../../extension';
  import   TestRuntime
           from '../index';
  const ß_trc = TestRuntime.developerTrace;
//------------------------------------------------------------------------------
  import { whenTextEditorOpened
         } from '../../../lib/vsc';
  import { expandEnvVariables
         , whenDelay
         } from '../../../lib/any';
//==============================================================================

class VscTestSpec {

static async rectify():Promise<void> {
  //
    await VscTestSpec._whenActive();
  //
    const ü_hist = ExtensionRuntime.activeInstance.globalHistory;
    const ü_admin  = await ü_hist.whenAdmin ( { version: 0 } );
    ßß_assert.strictEqual( ü_admin .version   , 0 );
    const ü_config = await ü_hist.whenConfig( { executable: '' } );
    ßß_assert.strictEqual( ü_config.executable, '' );
}

static async test_0():Promise<void> {
  //
    const ü_wsFolders = ßß_vsCode.workspace.workspaceFolders;
    const ü_folders   = ü_wsFolders?.map( ü_folder => ü_folder.uri.fsPath );
    await ßß_vsCode.commands.executeCommand<unknown>( 'openInNpp.openSettings' );
    const ü_file = ßß_path.join( ü_folders![0], 'Has Blank ß.txt' );
    if(ß_trc){ß_trc( `Test: "${ __filename }"` );}
    if(ß_trc){ß_trc( `Workspace: "${ ü_file }"` );}
    await whenTextEditorOpened( ü_file );
  //
    const ü_activeInstance = ExtensionRuntime.activeInstance;
    if(ß_trc){ß_trc( `Extension: "${ ü_activeInstance.extensionApi.id }"` );}
  //
    const ü_hist = ü_activeInstance.globalHistory;
    let   ü_dummy1 = ü_hist.dummy;
          ü_dummy1.push( 9 );
    let   ü_count  = await ü_hist.whenCommitted( 'dummy' );
    let   ü_dummy2 = ü_hist.dummy;
    ßß_assert.strictEqual( ü_count , 0        );
    ßß_assert.strictEqual( ü_dummy1, ü_dummy2 );
                     ü_hist.dummy = ü_dummy1;
          ü_count  = await ü_hist.whenCommitted( 'dummy' );
          ü_dummy2 = ü_hist.dummy;
    ßß_assert.strictEqual( ü_count , 1        );
    ßß_assert.strictEqual( ü_dummy1, ü_dummy2 );
  /*
                          ü_dummy1.push( 6 );
    ßß_assert.strictEqual( ü_count , 0        );
    ßß_assert.strictEqual( ü_dummy1, ü_dummy2 );
  //
                     ü_hist.dummy = ü_dummy1;
                     await whenDelay( 1 );
          ü_dummy2 = ü_hist.dummy;
    ßß_assert.notStrictEqual ( ü_dummy1, ü_dummy2 );
    ßß_assert.deepStrictEqual( ü_dummy1, ü_dummy2 );
  //
          ü_count  = await ü_hist.whenIdle();
          ü_dummy2 = ü_hist.dummy;
    ßß_assert.strictEqual    ( ü_count , 1        );
    ßß_assert.notStrictEqual ( ü_dummy1, ü_dummy2 );
    ßß_assert.deepStrictEqual( ü_dummy1, ü_dummy2 );
  //
          ü_dummy2 = ü_hist.dummy = ü_dummy1 = [3,4,5];
    ßß_assert.strictEqual( ü_dummy1, ü_dummy2 );
                          ü_dummy1.shift();
          ü_dummy2 = ü_hist.dummy;
    ßß_assert.strictEqual( ü_dummy1, ü_dummy2 );
          ü_count  = await ü_hist.whenIdle();
          ü_dummy2 = ü_hist.dummy;
    ßß_assert.strictEqual    ( ü_count , 1        );
    ßß_assert.notStrictEqual ( ü_dummy1, ü_dummy2 );
    ßß_assert.deepStrictEqual( ü_dummy1, ü_dummy2 );
  */
}

static async test_2():Promise<void> {
  //const ü_delay = await whenDelay( 4000 );
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

private static async _whenActive():Promise<void> {
    await ßß_vsCode.commands.executeCommand<unknown>( 'openInNpp.openSettings' );
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