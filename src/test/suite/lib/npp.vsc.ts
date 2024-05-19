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
  import { ß_whenXtnActivated_External
         } from '../../../runtime/context-XTN';
  import { ß_trc
         } from '../../../runtime/context';
  import { whenDelay
         } from '../../../lib/asyncUtil';
  import { ErrorWithUixMessage
         } from '../../../lib/errorUtil';
  import { asyncNullOperation
         } from '../../../lib/functionUtil';
  import { testSrc
         , testEqual
         , testNotEqual
         , testRejected
         , testCondition
         } from '../../../lib/testUtil';
//--------------------------------------------------------------------
  import { whenConfigSet
         } from '../../../vsc/anyUtil';
  import { whenTextEditorOpened
         , whenNewTextEditorOpened
         } from '../../../vsc/docUtil';
  import { CVscFs
         , fileToUri
         , firstWorkspaceFolder
         } from '../../../vsc/fsUtil';
//====================================================================
  export const tst_dispatch = true ? tst_settings
                                   : asyncNullOperation;
//====================================================================
    const ß_setExe = ( whenConfigSet<string> ).bind( null, CXtnCfgId.executable                );
    const ß_setDir = ( whenConfigSet<string> ).bind( null, CXtnCfgId.workingDirectory          );
    const ß_setVDc = ( whenConfigSet<string> ).bind( null, CXtnCfgId.virtualDocumentsDirectory );
  //const ö_setEx_ = bindAppending( setConfig<string>, CXtnCfgId.executable );
//====================================================================

export async function tst_settings(){
    ß_trc&& ß_trc( __dirname    , 'source' );
    ß_trc&& ß_trc( process.cwd(), 'cwd'    );
  //await commands.executeCommand<unknown>( CEXtnCommands.oSettings );
    const ü_extn_0 = await ß_whenXtnActivated_External();
    const ü_cfgApi = ü_extn_0.configApi;
  //ß_trc&& ß_trc( ü_extn_0.globalHistory.dummy, 'Global-History' );
  //await whenDelay( 2000 );
  //
//
  try {
  //
    const ü_cfg_0 = ü_cfgApi.configSnapshot;
    ß_trc&& ß_trc( Object.assign( {}, ü_cfg_0 ), 'Initial Config' );
    const ü_exe_0 = await ü_cfg_0.whenExecutable;
  //
    const ü_whenMod_exe_0 = ß_setExe( '' );
    testEqual( ü_cfgApi.configSnapshot, ü_cfg_0, 'Old Snapshot' );
    await ü_whenMod_exe_0;
    testEqual( ü_cfgApi.configSnapshot, ü_cfg_0, 'Old Snapshot' );
  //
    const ü_new_exe = '2otepad.exe';
    const ü_whenMod_exe_1 = await ß_setExe( ü_new_exe );
    const ü_cfg_1 = ü_cfgApi.configSnapshot;
    testNotEqual( ü_cfg_1, ü_cfg_0, 'New Snapshot' );
    testEqual( await ü_cfg_1.whenExecutable, ü_new_exe, 'New value' );
  //
    const ü_dirNot = join( process.cwd(), '../aaaaa' );
    await ß_setDir( ü_dirNot );
    const ü_cfg_2 = ü_cfgApi.configSnapshot;
    await testRejected( ü_cfg_2.whenWorkingDir, ü_dirNot, ü_eX => ü_eX instanceof ErrorWithUixMessage );
  //
  } finally {
      await ß_setExe('');
      await ß_setDir('');
      await ß_setVDc('%TEMP%');
  }
}

//====================================================================

export async function tst_readFile(){
    const ü_home = firstWorkspaceFolder()?.fsPath;
    const ü_wsCfg = join( ü_home??'', '.vscode', 'settings.json' );
    ß_trc&& ß_trc( ü_home       , 'home'     );
    ß_trc&& ß_trc( ü_wsCfg      , 'home-cfg' );
  //
    const ü_data = await CVscFs.readFile( fileToUri( ü_wsCfg ) );
    const ü_jso_ = JSON.parse( Buffer.from( ü_data ).toString( 'utf8' ) );
    const ü_doc = await workspace.openTextDocument( fileToUri( ü_wsCfg ) );
        //ü_doc.
    const ü_json = JSON.parse( ü_doc.getText() ) as Record<'openInNpp.Executable',string>;
    ß_trc&& ß_trc( ü_json, 'Json' );
    const ü_extn_0 = await ß_whenXtnActivated_External();
    const ü_exe    = ü_extn_0.configApi.configSnapshot.executable;
    testEqual( ü_exe, ü_json['openInNpp.Executable'], 'Exe' );
}

//====================================================================

export async function tst_history(){
  //
    const ü_extn_0 = extensions.getExtension<XtnOpenInNpp>( CXtnId )!;
    testEqual( ü_extn_0.id      , CXtnId );
  //testEqual( ü_extn_0.isActive, false, 'isActive' );
         await ü_extn_0.activate();
    testEqual( ü_extn_0.isActive, true , 'isActive' );
  //
    const ü_extn_1 = ü_extn_0.exports;
    const ü_extn_2 = await ß_whenXtnActivated_External();
    testEqual( ü_extn_1, ü_extn_2, 'Npp' );
  //
    const ü_dummyHist = ü_extn_1.globalHistory.dummy;
    ß_trc&& ß_trc( ü_dummyHist.dataRef, 'Dummy-History' );
    testEqual( await ü_dummyHist.whenCommitted(), 1, 'Count' );
  //
    const ü_dummyDat1 = [] as IGlobalHistoryData['dummy'];
    const ü_dummyDat2 = [] as IGlobalHistoryData['dummy'];
  //
    testNotEqual(
               ü_dummyHist.dataRef , ü_dummyDat1, 'DataRef' );
               ü_dummyHist.dataRef = ü_dummyDat2;
               ü_dummyHist.dataRef = ü_dummyDat1;
    testEqual( ü_dummyHist.dataRef , ü_dummyDat1, 'DataRef' );
    testEqual( await ü_dummyHist.whenCommitted(), 2, 'Count' );
    testEqual( await ü_dummyHist.whenCommitted(), 1, 'Count' );
  //
    ü_dummyHist.dataRef.push(1);
    ü_dummyHist.triggerCommit();
    testEqual( await ü_dummyHist.whenCommitted(), 1, 'Count' );
  //
    const ü_adminHist = ü_extn_1.globalHistory.admin;
    const ü_adminData = ü_adminHist.dataRef;
    testEqual( ü_adminData.version, ü_extn_1.version, 'Version' );
  //
    const ü_exe     = ü_extn_1.configApi.configSnapshot.executable;
    const ü_cfgHist = ü_extn_1.globalHistory.config;
    const ü_cfgData = ü_cfgHist.dataRef;
    testEqual( await ü_cfgHist.whenCommitted(), 1, 'Npp count' );
    testEqual( ü_cfgData.executable, ü_exe, 'Executable' );
  //
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
    await whenTextEditorOpened( join( firstWorkspaceFolder()!.fsPath, 'b b.txt' ) );
    const ü_pid_3 = await commands.executeCommand<number>( CEXtnCommands.oActive );
  //
    await whenDelay( 1000 );
  //
    let ü_pid:number
    ü_pid = ü_pid_1; if ( testEqual( ü_pid>0, true, `PID: ${ ü_pid }` ) ) { !true || ü_noKill || process.kill( ü_pid ); }
    ü_pid = ü_pid_2; if ( testEqual( ü_pid>0, true, `PID: ${ ü_pid }` ) ) {  true || ü_noKill || process.kill( ü_pid ); }
    ü_pid = ü_pid_3; if ( testEqual( ü_pid>0, true, `PID: ${ ü_pid }` ) ) {  true || ü_noKill || process.kill( ü_pid ); }
}

//====================================================================
/*
*/