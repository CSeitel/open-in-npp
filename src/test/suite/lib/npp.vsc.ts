/*
*/
  import { type XtnOpenInNpp
         , type IGlobalHistoryData
         } from '../../../types/vsc.extension.d';
  import { CXtnId
         , CEXtnCommands
         , CXtnCfgId
         } from '../../../constants/extension';
//--------------------------------------------------------------------
  import { join
         , resolve
         } from 'path';
//--------------------------------------------------------------------
  import { commands
         , extensions
         , workspace
         , ConfigurationTarget
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_whenXtnAvailable
         , ß_getConfigSnapshot
         } from '../../../runtime/context-XTN';
  import { ß_trc
         } from '../../../runtime/context';
  import { whenDelay
         } from '../../../lib/asyncUtil';
  import { ErrorWithUixMessage
         } from '../../../lib/errorUtil';
  import { bindAppending
         } from '../../../lib/functionUtil';
  import { testSrc
         , testEqual
         , testNotEqual
         , testRejected
         , testCondition
         } from '../../../lib/testUtil';
//--------------------------------------------------------------------
  import { setConfig
         } from '../../../vsc/anyUtil';
  import { CVscFs
         , fileToUri
         } from '../../../vsc/fsUtil';
  import { whenTextEditorOpened
         , whenNewTextEditorOpened
         } from '../../../vsc/docUtil';
//====================================================================
  export const tst_dispatch = tst_settings;
//====================================================================
    const ß_setExe = ( setConfig<string> ).bind( null, CXtnCfgId.executable                );
    const ß_setDir = ( setConfig<string> ).bind( null, CXtnCfgId.workingDirectory          );
    const ß_setVDc = ( setConfig<string> ).bind( null, CXtnCfgId.virtualDocumentsDirectory );
  //const ö_setEx_ = bindAppending( setConfig<string>, CXtnCfgId.executable );
//====================================================================

export async function tst_settings(){
    ß_trc&& ß_trc( __dirname    , 'src' );
    ß_trc&& ß_trc( process.cwd(), 'cwd' );
    ß_trc&& ß_trc( ((workspace.workspaceFolders??[])[0])?.uri.fsPath, 'ws0' );
    await commands.executeCommand<unknown>( CEXtnCommands.oSettings );
  /*
    const ü_extn = await ß_whenXtnAvailable();
    const ü_extn = extensions.getExtension<XtnOpenInNpp>( CXtnId )!;
    if ( ! testNotEqual( ü_extn, undefined ) ) { return; }
    testEqual( ü_extn.id, CXtnId );
    testEqual( ü_extn.isActive, false, 'isActive' );
    await ü_extn.activate();
    testEqual( ü_extn.isActive, true , 'isActive' );
  */
//
  try {
  //
    const ü_cfg_0 = ß_getConfigSnapshot();
    ß_trc&& ß_trc( Object.assign( {}, ü_cfg_0 ), 'Initial Config' );
    const ü_exe_0 = await ü_cfg_0.whenExecutable;
  //
    const ü_whenMod_exe_0 = ß_setExe( '' );
    testEqual( ß_getConfigSnapshot(), ü_cfg_0, 'Old Snapshot' );
    await ü_whenMod_exe_0;
    testEqual( ß_getConfigSnapshot(), ü_cfg_0, 'Old Snapshot' );
  //
    const ü_new_exe = '2otepad.exe';
    const ü_whenMod_exe_1 = await ß_setExe( ü_new_exe );
    const ü_cfg_1 = ß_getConfigSnapshot();
    testNotEqual( ü_cfg_1, ü_cfg_0, 'New Snapshot' );
    testEqual( await ü_cfg_1.whenExecutable, ü_new_exe, 'New value' );
  //
    const ü_dirNot = join( process.cwd(), '../aaaaa' );
    await ß_setDir( ü_dirNot );
    const ü_cfg_2 = ß_getConfigSnapshot();
    await testRejected( ü_cfg_2.whenWorkingDir, ü_dirNot, ü_eX => ü_eX instanceof ErrorWithUixMessage );
  //
  } finally {
      await ß_setExe('');
      await ß_setDir('');
      await ß_setVDc('%TEMP%');
  }
}

//====================================================================

export async function tst_history(){
    const ü_extn = await ß_whenXtnAvailable();
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
    const ü_dummyDat1 = [] as IGlobalHistoryData['dummy'];
    const ü_dummyDat2 = [] as IGlobalHistoryData['dummy'];
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
}

//====================================================================

export async function tst_b(){
  /*
var setting: vscode.Uri = vscode.Uri.parse("untitled:" + "C:\summary.txt");
vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
    vscode.window.showTextDocument(a, 1, false).then(e => {
        e.edit(edit => {
            edit.insert(new vscode.Position(0, 0), "Your advertisement here");
        });
    });
}, (error: any) => {
    debugger;
});
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
  */
}

//====================================================================

export async function tst_openInNpp(){
    const ü_noKill = !true;
  //
    await whenTextEditorOpened( fileToUri( __filename ) );
    const ü_pid_1 = await commands.executeCommand<number>( CEXtnCommands.oActive );
  //
    await whenNewTextEditorOpened( { content:'{"a":33}' } );
    const ü_pid_2 = await commands.executeCommand<number>( CEXtnCommands.oActive );
    testNotEqual( ü_pid_1, ü_pid_2, '2 Pids' );
  //
    await whenDelay( 2000 );
  //
    let ü_pid:number
    ü_pid = ü_pid_1; if ( testEqual( ü_pid>0, true, `PID: ${ ü_pid }` ) ) { !true || ü_noKill || process.kill( ü_pid ); }
    ü_pid = ü_pid_2; if ( testEqual( ü_pid>0, true, `PID: ${ ü_pid }` ) ) {  true || ü_noKill || process.kill( ü_pid ); }
  //testNotEqual( ü_pid_1, 0, 'pid' ) && testEqual( process.kill( ü_pid_1 ), true, 'Killed' );
}

//====================================================================

  /*
    const ü_hist = ü_extn.exports.globalHistory;
    const ü_config = await ü_hist.whenConfig();
    testEqual( ü_config .executable   , ''  );
          const ü_done = ü_hist.release( 'config' );
    testEqual( ü_done, true );
  */
class VscTestSpec {

static async test_0():Promise<void> {
  //
    const ü_wsFolders = workspace.workspaceFolders;
    const ü_folders   = ü_wsFolders?.map( ü_folder => ü_folder.uri.fsPath );
    const ü_file = join( ü_folders![0], 'Has Blank ß.txt' );
    if(ß_trc){ß_trc( `Test: "${ __filename }"` );}
    if(ß_trc){ß_trc( `Workspace: "${ ü_file }"` );}
    await whenTextEditorOpened( ü_file );
  //
    const ü_activeInstance = await ß_whenXtnAvailable();
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

}
