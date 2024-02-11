/*
*/
  import { type TTestResult
         } from '../../../types/lib.testUtil.d';
  import { type TOpenInNpp
         } from '../../../types/runtime.d';
  import { CExtensionId
         } from '../../../constants/extension';
//--------------------------------------------------------------------
  import * as ßß_vsCode from 'vscode';
  import * as ßß_assert from 'assert';
  import * as ßß_path   from 'path';
//--------------------------------------------------------------------
  import { strictEqual
         } from 'assert';
  import { commands
         , extensions
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_RuntimeContext
         , ß_trc
         } from '../../../core/runtime';
  import { whenTextEditorOpened
         } from '../../../lib/vsc';
  import {
          whenDelay
         } from '../../../lib/asyncUtil';
  import { expandEnvVariables
         } from '../../../lib/textUtil';
  import { testSrc
         , testSummary
         , testEquals
         } from '../../../lib/testUtil';
  //let ß_trc           :TRuntimeContext['developerTrace']
//====================================================================

export async function tst_(){
    const ü_tests = [] as TTestResult[];
    const ü_extn = extensions.getExtension<TOpenInNpp>( CExtensionId );
    ü_tests.push(  testEquals( ü_extn?.id      , CExtensionId )
                ,  testEquals( ü_extn?.isActive, false        )
                );
    await ü_extn?.activate();
    ü_tests.push(  testEquals( ü_extn?.isActive, true         )
                );
    //console.dir( ü_extn?.exports);
    const ü_hist_ =            ü_extn?.exports.globalHistory
    const ü_admin  = await ü_hist_!.whenAdmin ();
    ü_tests.push(  
       testEquals( ü_admin .version   , 0  )
                );
    testSummary( ü_tests
               , strictEqual );
    return;
  //console.dir( ü_a );
  //ß_RuntimeContext.activeInstance.extensionApi.exports.dummy();
    await whenTextEditorOpened( testSrc( '../etc/test/workspaceFolder/a.txt' ) )
    const ü_pid = ( await commands.executeCommand<number>( 'extension.openInNpp' ) )!;
  //
    const ü_hist = ß_RuntimeContext.activeInstance.globalHistory;
  //const ü_admin  = await ü_hist.whenAdmin ( { version: -1 } );
  //const ü_admin  = await ü_hist.whenAdmin ();
    const ü_config = await ü_hist.whenConfig( { executable: '' } );
    testSummary(
       testEquals( ü_admin .version   , 0  )
               , testEquals( ü_config.executable, '' )
               , strictEqual );
  //
    try {
  //await ß_RuntimeContext.whenActive();
  //await ß_RuntimeContext.whenActive();

    } finally {
    // await whenDelay( 5000 );
    }
  //
}

//====================================================================

class VscTestSpec {

static async rectify():Promise<void> {
  //
  //ß_RuntimeContext =
    await ß_RuntimeContext.whenActive();
  //ß_trc            = ß_RuntimeContext.developerTrace;
	  ßß_vsCode.window.showInformationMessage(' all tests.');
  //
	  ßß_vsCode.window.showInformationMessage('Start all tests.');
    console.log( 'Hello World' );
  //
    
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
    const ü_activeInstance = ß_RuntimeContext.activeInstance;
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