/*
*/
  import { type TTestResult
         } from '../../../types/lib.testUtil.d';
  import { type TOpenInNpp
         , type IHistoryData
         } from '../../../types/runtime.d';
  import { CExtensionId
         , CECommands
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
  import { MementoFacade
         } from '../../../vsc/histUtil';
  import { whenTextEditorOpened
         } from '../../../lib/vsc';
  import {
          whenDelay
         } from '../../../lib/asyncUtil';
  import { expandEnvVariables
         } from '../../../lib/textUtil';
  import { testSrc
         , testSummary
         , testEqual
         , testNotEqual
         , testCondition
         } from '../../../lib/testUtil';
  //let ß_trc           :TRuntimeContext['developerTrace']
//====================================================================

export async function tst_b(){
    const ü_extn = await ß_RuntimeContext.whenActive();
  //
    const ü_dummyHist = ü_extn.globalHistory.dummy;
    const ü_dummyData = ü_dummyHist.dataRef;
    console.log( 'rrr' + ü_dummyData );
    testNotEqual( ü_dummyData.length, 0 );
                  ü_dummyData.length = 0;
                  ü_dummyData.push( 6 );
                  ü_dummyHist.triggerCommit();
    console.log( 'rrr' + ü_dummyData );
    console.log( testSummary( strictEqual, 'tst_' ) );
    return;
  //
  //
    const ü_dummy_1 = new MementoFacade<'dummy',IHistoryData>( 'dummy', []    );
    const ü_dummy_2 = new MementoFacade<'dummy',IHistoryData>( 'dummy', [0,8] );
    const ü_r1 = ü_dummy_1.dataRef;
    const ü_r2 = ü_dummy_2.dataRef;
    testEqual( ü_r1, ü_r2 );
    testEqual( ü_r1.length, 2 , 'Dummy 1' );
    testEqual( ü_r2.length, 2 , 'Dummy 2' );
    ü_dummy_1.dataRef[0] = 35 ;
    const ü_when = ü_dummy_1.whenCommitted();
  //ü_dummy_2.reset();
    testEqual( ü_r2.length             , 2 , 'Dummy 2' ) && testEqual( ü_r2             [1],  8 );
    testEqual( ü_dummy_2.dataRef.length, 2 , 'Dummy 2' ) && testEqual( ü_dummy_2.dataRef[0], 33 );
    await ü_when;
    testEqual( ü_dummy_1.dataRef.length, 1 , 'Dummy 1' ) && testEqual( ü_dummy_1.dataRef[0], 33 );
}

//====================================================================

export async function tst_(){
    const ü_extn = await ß_RuntimeContext.whenActive();
  //
    const ü_adminHist = ü_extn.globalHistory.admin;
    const ü_adminData = ü_adminHist.dataRef;
    testEqual( ü_adminData.version, 15 );
  //
    await whenTextEditorOpened( testSrc( '../etc/test/workspaceFolder/a.txt' ) )
    const ü_pid = await commands.executeCommand<number>( CECommands.oActive );
    await whenDelay( 2000 );
    testNotEqual( ü_pid, 0, 'pid' ) && testEqual( process.kill( ü_pid ), true, 'Killed' );
    console.log( typeof( ü_pid), ü_pid );
  //
    console.log( testSummary( strictEqual, 'tst_' ) );
}

//====================================================================

export async function tst_a(){
    const ü_extn = extensions.getExtension<TOpenInNpp>( CExtensionId )!;
    if ( ! testNotEqual( ü_extn, undefined ) ) { return; }
    testEqual( ü_extn.id, CExtensionId );
    testEqual( ü_extn.isActive, false, 'isActive' );
    await ü_extn.activate();
    testEqual( ü_extn.isActive, true , 'isActive' );
  /*
    const ü_hist = ü_extn.exports.globalHistory;
    const ü_config = await ü_hist.whenConfig();
    testEqual( ü_config .executable   , ''  );
          const ü_done = ü_hist.release( 'config' );
    testEqual( ü_done, true );
  */
  //
    console.log( testSummary( strictEqual, 'tst_' ) );
  //
}

//====================================================================

class VscTestSpec {

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