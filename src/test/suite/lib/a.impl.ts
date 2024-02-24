/*
*/
  import { type TTestResult
         } from '../../../types/lib.testUtil.d';
  import { type TOpenInNpp
         , type IHistoryData
         } from '../../../types/vsc.extension.d';
  import { CExtensionId
         , CEXtnCommands
         } from '../../../constants/extension';
//--------------------------------------------------------------------
  import * as ßß_vsCode from 'vscode';
  import * as ßß_assert from 'assert';
  import { join
         } from 'path';
//--------------------------------------------------------------------
  import { commands
         , extensions
         , workspace
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_RuntimeContext
         , ß_trc
         } from '../../../core/runtime';
  import { MementoFacade
         } from '../../../vsc/histUtil';
  import { CVscFs
         , fileToUri
         } from '../../../vsc/fsUtil';
  import { whenTextEditorOpened
         , whenNewTextEditorOpened
         } from '../../../vsc/docUtil';
  import { whenDelay
         } from '../../../lib/asyncUtil';
  import { expandEnvVariables
         } from '../../../lib/textUtil';
  import { testSrc
         , testSummary
         , testEqual
         , testNotEqual
         , testCondition
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_dbg(){
    return tst_history();

    console.log( __filename );
    throw new Error( __dirname )
}

//====================================================================

export async function tst_history(){
    const ü_extn = await ß_RuntimeContext.whenActive();
  //
    const ü_home = workspace.workspaceFolders![0].uri.fsPath
    ß_trc&& ß_trc( ü_home );
    const ü_wsCfg = join( ü_home, '.vscode', 'settings.json' );
    const ü_data = await CVscFs.readFile( fileToUri( ü_wsCfg ) );
    const ü_jso_ = JSON.parse( Buffer.from( ü_data ).toString( 'utf8' ) );
    const ü_doc = await workspace.openTextDocument( fileToUri( ü_wsCfg ) );
        //ü_doc.
    const ü_json = JSON.parse( ü_doc.getText() );
    ß_trc&& ß_trc( ü_json );
  //
    const ü_dummyHist = ü_extn.globalHistory.dummy;
    ß_trc&& ß_trc( 'Hello'+ JSON.stringify( ü_dummyHist.dataRef ) );
  //testEqual( ü_dummyHist.dataRef[0], 2, 'DataRef[0]' );
    const ü_dummyDat1 = [] as IHistoryData['dummy'];
    const ü_dummyDat2 = [] as IHistoryData['dummy'];
    ü_dummyHist.dataRef = ü_dummyDat1;
    testEqual( ü_dummyHist.dataRef, ü_dummyDat1, 'DataRef' );
    ü_dummyDat1.push( 1 );
    testEqual( ü_dummyHist.dataRef[0], ü_dummyDat1[0], 'DataRef[0]' );
    ü_dummyHist.dataRef = ü_dummyDat2;
    testEqual( ü_dummyHist.dataRef, ü_dummyDat2, 'DataRef' );
  //
    ü_dummyDat2.push( 2 );
  //ü_dummyHist.triggerCommit();
    const ü_count = await ü_dummyHist.whenCommitted();
    ß_trc&& ß_trc( 'Co'+ ü_count );
  //
    const ü_adminHist = ü_extn.globalHistory.admin;
    const ü_adminData = ü_adminHist.dataRef;
    testEqual( ü_adminData.version, 15, 'Version' );
  //
    const ü_cfgHist = ü_extn.globalHistory.config;
    const ü_cfgData = ü_cfgHist.dataRef;
    testEqual( ü_cfgData.executable, '', 'Executable' );
  //
  //
    testSummary();
    return;
  //
}

export async function tst_b(){
    const ü_extn = await ß_RuntimeContext.whenActive();
  //
    await commands.executeCommand<unknown>( CEXtnCommands.oSettings );
    await whenTextEditorOpened( testSrc( '../etc/test/workspaceFolder/a.txt' ) );
    const ü_pid_1 = await commands.executeCommand<number>( CEXtnCommands.oActive );
    await whenDelay( 2000 );
    const ü_pid_2 = await commands.executeCommand<number>( CEXtnCommands.oActive );
    await whenDelay( 2000 );
    testEqual( ü_pid_1, ü_pid_2, 'Pid' );
  //
    testNotEqual( ü_pid_1, 0, 'pid' ) && testEqual( process.kill( ü_pid_1 ), true, 'Killed' );
    console.log( typeof( ü_pid_1), ü_pid_1 );
  //
    testSummary( 'tst_' );
  //
    return;
  /*
var setting: vscode.Uri = vscode.Uri.parse("untitled:" + "C:\summary.txt");
vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
    vscode.window.showTextDocument(a, 1, false).then(e => {
        e.edit(edit => {
            edit.insert(new vscode.Position(0, 0), "Your advertisement here");
        });
    });
}, (error: any) => {
    console.error(error);
    debugger;
});
  */
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

export async function tst_c(){
    await whenNewTextEditorOpened( { content:'{"a":33}' } );
    const ü_pid_1 = await commands.executeCommand<number>( CEXtnCommands.oActive );
    await whenDelay( 3 * 1000 );
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
    testSummary( 'tst_' );
  //
}

//====================================================================

class VscTestSpec {

static async test_0():Promise<void> {
  //
    const ü_wsFolders = ßß_vsCode.workspace.workspaceFolders;
    const ü_folders   = ü_wsFolders?.map( ü_folder => ü_folder.uri.fsPath );
    const ü_file = join( ü_folders![0], 'Has Blank ß.txt' );
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
