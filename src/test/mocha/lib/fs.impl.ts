/*
*/
  import { type Stats
         } from 'fs';
  import { type TOrderedPairs
         } from '../../../types/generic.d';
  import { CEExecutable
         } from '../../../constants/extension';
//--------------------------------------------------------------------
  import { pickPair
         } from '../../../lib/arrayUtil';
  import { whenPromiseSettled
         , whenDoneAndPostProcessed
         , createAsyncPostProcessor
         } from '../../../lib/asyncUtil';
  import { whenChildProcessSpawned
         } from '../../../lib/cpUtil';
  import { expectErrorCode
         } from '../../../lib/errorUtil';
  import { whenFileInfoRead
         , whenKnownAsFolder
         , whenKnownAsSymLink
         , whenKnownAsFile
         , isWin32ShellExecutable
         } from '../../../lib/fsUtil';
  import { expandEnvVariables
         , wrapDoubleQuotes
         } from '../../../lib/textUtil';
  import { bindArguments
         } from '../../../lib/functionUtil';
//--------------------------------------------------------------------
  import { testSrc
         , testEqual
         , testNotEqual
         , testFunction
         , whenAsyncFunctionTested
         } from '../../../lib/testUtil';
//====================================================================

  export const tst_dispatch = tst_isWin32Exe;

//====================================================================

export async function tst_whenFileInfoRead(){
    const ö_info = ( await whenFileInfoRead( testSrc( 'real_1' ) ) )!;
    testNotEqual( ö_info, null );
    const ü_data = [ 'real_1'
                   , 'virtual_1_d'
                   , 'virtual_2_d'
                   ].map( ü_name => [testSrc( ü_name ), '0.0' ] as [string,string] )
  //
    await whenAsyncFunctionTested( whenDoneAndPostProcessed( whenFileInfoRead, ö_delta ), ü_data );

function ö_delta( ü_info:Stats|null ):string {
    if ( ü_info === null ) { return ''; }
    return ( ü_info.ctimeMs - ö_info.ctimeMs )
         + '.'
         + ( ü_info.mtimeMs - ö_info.mtimeMs )
         ;
}
}

export async function tst_whenKnownAsFolder():Promise<void> {
/*
<SYMLINKD>     virtual_1_d [.\real_1]
<JUNCTION>     virtual_1_j [C:\zzz_Dev\node_modules\open-in-npp\.vscode-temp\real_1]
<SYMLINKD>     virtual_2_d [.\virtual_1_d]  2 -> 1 -> r1
<SYMLINKD>     virtual_3_d [.\virtual_4_d]  3 -> 4 -> 5 -> 3
<SYMLINKD>     virtual_4_d [.\virtual_5_d]  3 -> 4 -> 5 -> 3
<SYMLINKD>     virtual_5_d [.\virtual_3_d]  3 -> 4 -> 5 -> 3
<SYMLINKD>     virtual_6_d [.\real_0]       6 -> nul
*/
  //
    const ü_data =
      [
        [ __filename              , false, false, false, false, true , true  ]
      , [ __dirname               , true , true , false, false, false, false ]
      , [ '*'                     , false, false, false, false, false, false ]
      , [ ''                      , false, false, false, false, false, false ]
      , [ ' '                     , false, false, false, false, false, false ]
      , [ '.'                     , true , true , false, false, false, false ]
      , [ '..'                    , true , true , false, false, false, false ]
      , [ '../..'                 , true , true , false, false, false, false ]
      , [ testSrc( 'virtual_1_j' ), true , false, false, true , false, false ]
      , [ testSrc( 'virtual_1_d' ), true , false, false, true , false, false ]
      , [ testSrc( 'virtual_2_d' ), true , false, false, true , false, false ]
      , [ testSrc( 'virtual_3_d' ), null , false, null , true , null , false ]
      , [ testSrc( 'virtual_6_d' ), false, false, false, true , false, false ]
      ];                         // folder        symlink       file
  //
    const ü_01 = ü_data.map( pickPair<string,boolean|null>( 0, 1 ) );
    const ü_02 = ü_data.map( pickPair<string,boolean|null>( 0, 2 ) );
    const ü_03 = ü_data.map( pickPair<string,boolean|null>( 0, 3 ) );
    const ü_04 = ü_data.map( pickPair<string,boolean|null>( 0, 4 ) );
    const ü_05 = ü_data.map( pickPair<string,boolean|null>( 0, 5 ) );
    const ü_06 = ü_data.map( pickPair<string,boolean|null>( 0, 6 ) );
  //
    const ü_LFolder  = bindArguments( whenKnownAsFolder , { realFirst:true }, true );
    const ü_LSymLink = bindArguments( whenKnownAsSymLink, { realFirst:true }, true );
    const ü_LFile    = bindArguments( whenKnownAsFile   , { realFirst:true }, true );
  //
    await whenAsyncFunctionTested( whenKnownAsFolder , ü_01, ö_expectError );
    await whenAsyncFunctionTested(        ü_LFolder  , ü_02  );
    await whenAsyncFunctionTested( whenKnownAsSymLink, ü_03, ö_expectError );
    await whenAsyncFunctionTested(         ü_LSymLink, ü_04  );
    await whenAsyncFunctionTested( whenKnownAsFile   , ü_05, ö_expectError );
    await whenAsyncFunctionTested(         ü_LFile   , ü_06  );
 function ö_expectError( ü_path:string, ü_eX:any, ü_x_y:[string,boolean|null] ):boolean|null {
     return ü_path.endsWith( 'virtual_3_d' ) && expectErrorCode( ü_eX, 'ELOOP', null ); 
}
}

//====================================================================

export async function tst_isWin32Exe(){
    const ü_thenTrue = createAsyncPostProcessor<boolean,any>( ()=> true );
    const ü_detached = !true;
    const ü_files = [ testSrc( 'a b.txt' ) ];
    const ü_npp = expandEnvVariables( CEExecutable.x64_64bit );
  //
    const ü_data_cmd =
      [ [ testSrc( 'cmd.cmd' ), true ]
      , [ testSrc( 'bat.bat' ), true ]
    //, [ testSrc( 'lnk.lnk' ), true ]
      , [ testSrc( 'Notepad++.lnk' ), true ]
      , [ testSrc( 'txt.json' ), false ]
      ] as TOrderedPairs<string,boolean>;
    const ü_data = ü_data_cmd.concat(
      [ [ __filename  , false ]
      , [ __dirname   , false ]
      , [ '_dir ame &', false ]
      , [ 'C:\\zzz_Dev\\node_modules\\open-in-npp\\.gitignore', false ]
      , [ '*'       , false ]
      , [ ''        , false ]
      , [ ' '       , false ]
      , [ '.'       , false ]
      , [ '..'      , false ]
      , [ '../..'   , false ]
      ] as TOrderedPairs<string,boolean> );
    1&& await whenAsyncFunctionTested( isWin32ShellExecutable, ü_data );
  //
    const ü_cmd_cp_1 = bindArguments( whenChildProcessSpawned, { realFirst:true
                                                               , refine:ü_thenTrue },       []     , { shell:true, detached:ü_detached } );
    const ü_cmd_cp_2 = bindArguments( whenChildProcessSpawned, { arrangeReal:[1], prepare:{ 1:ü_exe => ['/C',ü_exe, ... ü_files] }
                                                               , refine:ü_thenTrue }, 'cmd.exe', [], {             detached:ü_detached } );
  //
    ü_data_cmd[3][1] = true;
  //ü_data_cmd.splice( 0, 4 );
    0&& await whenAsyncFunctionTested( ü_cmd_cp_1, ü_data_cmd );
    0&& await whenAsyncFunctionTested( ü_cmd_cp_2, ü_data_cmd );
  //
    const ü_npp_run_1 = await whenPromiseSettled( whenChildProcessSpawned(                   ü_npp, ü_files, { detached:ü_detached } ) );
    testEqual( ü_npp_run_1.rejected, false );
    const ü_npp_run_2 = await whenPromiseSettled( whenChildProcessSpawned( wrapDoubleQuotes( ü_npp ),    [], { detached:ü_detached, windowsVerbatimArguments:true } ) );
    testEqual( ü_npp_run_2.rejected, true  , 'Verbatim & quoted exe fails' );
    const ü_npp_run_3 = await whenPromiseSettled( whenChildProcessSpawned(                   ü_npp
                                                                         , ü_files.map( wrapDoubleQuotes ) , { detached:ü_detached, windowsVerbatimArguments:true } ) );
    testEqual( ü_npp_run_3.rejected, false );
  /*
  */
}

//====================================================================
/*
*/