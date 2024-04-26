/*
*/
  import { type TOrderedPairArray
         } from '../../../types/lib.arrayUtil.d';
//--------------------------------------------------------------------
//--------------------------------------------------------------------
  import { expect
         } from '../../../lib/errorUtil';
  import { whenPromiseSettled
         } from '../../../lib/asyncUtil';
  import { pickDuplet
         , projection
         } from '../../../lib/arrayUtil';
  import { whenFileInfoRead
         , whenKnownAsFolder
         , whenKnownAsSymLink
         , whenKnownAsFile
         , isWin32Executable
         , isExecutable
         } from '../../../lib/fsUtil';
  import { whenChildProcessSpawned
         } from '../../../lib/cpUtil';
  import { bindArguments
         } from '../../../lib/functionUtil';
  import { testSrc
         , testSummary_
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_whenFileInfoRead(){
    const ö_info = ( await whenFileInfoRead( testSrc( 'real_1' ) ) )!;
    const ü_data = [ 'virtual_2_d'
                   , 'virtual_1_d' ].map( ü_name => [testSrc( ü_name ), '0.1' ] as [string,string] )
    await whenAsyncFunctionTested( ö_whenCtime, ü_data );
    testSummary_();

async function ö_whenCtime( ü_path:string ):Promise<string> {
    const ü_info = ( await whenFileInfoRead( ü_path ) )!;
    return ( ü_info.ctimeMs - ö_info.ctimeMs )
         + '.'
         + ( ü_info.mtimeMs - ö_info.mtimeMs )
         ;
}
}

export async function tst_whenKnownAsFolder():Promise<void> {
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
      ];
  //
    const ü_01 = ü_data.map( pickDuplet<string,boolean|null>( 0, 1 ) );
    const ü_02 = ü_data.map( ü_row => projection<string,boolean|null>( ü_row, 0, 2 ) );
    const ü_03 = ü_data.map( ü_row => projection<string,boolean|null>( ü_row, 0, 3 ) );
    const ü_04 = ü_data.map( ü_row => projection<string,boolean|null>( ü_row, 0, 4 ) );
    const ü_05 = ü_data.map( ü_row => projection<string,boolean|null>( ü_row, 0, 5 ) );
    const ü_06 = ü_data.map( ü_row => projection<string,boolean|null>( ü_row, 0, 6 ) );
  //
    const ü_LFolder  = bindArguments( whenKnownAsFolder , { realFirst:true }, true );
    const ü_LSymLink = bindArguments( whenKnownAsSymLink, { realFirst:true }, true );
    const ü_LFile    = bindArguments( whenKnownAsFile   , { realFirst:true }, true );
  //
    await whenAsyncFunctionTested( whenKnownAsFolder , ü_01, (ü_x,ü_eX)=>{ return ü_x.endsWith( 'virtual_3_d' ) && expect( ü_eX, 'ELOOP', true ); } );
    await whenAsyncFunctionTested( ü_LFolder         , ü_02  );
    await whenAsyncFunctionTested( whenKnownAsSymLink, ü_03, (ü_x,ü_eX)=>{ return ü_x.endsWith( 'virtual_3_d' ) && expect( ü_eX, 'ELOOP', true ); } );
    await whenAsyncFunctionTested( ü_LSymLink        , ü_04  );
    await whenAsyncFunctionTested( whenKnownAsFile   , ü_05, (ü_x,ü_eX)=>{ return ü_x.endsWith( 'virtual_3_d' ) && expect( ü_eX, 'ELOOP', true ); } );
    await whenAsyncFunctionTested( ü_LFile           , ü_06  );
    testSummary_();
}

export async function tst_isExe(){
    const ü_data =
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
      ] as TOrderedPairArray<string,boolean>;
  //
    await whenAsyncFunctionTested( isWin32Executable, ü_data )
    testSummary_();
//await isExe( await ßß_impl.defaultNppExecutable()                 );
}

export async function tst_win32Exe(){
    const ü_data =
      [ [ testSrc( 'cmd.cmd' ), true ]
      , [ testSrc( 'bat.bat' ), true ]
      , [ testSrc( 'lnk.lnk' ), true ]
      ] as TOrderedPairArray<string,boolean>;
    
    await whenAsyncFunctionTested( isWin32Executable, ü_data );
    await whenAsyncFunctionTested( ö_whenSpwaned    , ü_data );
    testSummary_();
  //a( ßß_assert.strictEqual )
async function ö_whenSpwaned( ü_exe:string ):Promise<boolean> {
    const ü_cp = await whenPromiseSettled( whenChildProcessSpawned( 'cmd.exe', ['/C',ü_exe] ) );
    return ! ü_cp.rejected;
}
}

//====================================================================
/*
*/