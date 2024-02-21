/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { strictEqual
         } from 'assert';
  import { basename
         } from 'path';
//--------------------------------------------------------------------
  import { expect
         } from '../../../lib/error';
  import { whenDelay
         } from '../../../lib/asyncUtil';
  import { pickDuplet
         , projection
         } from '../../../lib/arrayUtil';
  import { whenFileInfoRead
         , whenKnownAsFolder
         , whenKnownAsSymLink
         , whenKnownAsFile
         , isExe
         , isExecutable
         } from '../../../lib/fsUtil';
  import { testSrc
         , testSummary
         , testAsyncFunction
         , testFunction
         , testEqual
         , bind
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_testEquals_1(){
    testEqual( {}, {}, '9999' )
    testEqual(  0,  0 )
    testEqual(  0,  0 )
    const ü_fref = bind( ö_echo, { arrangeReal:[2] }, '_0','_1' )
    testFunction( ü_fref, [['A_','_0\t_1\tA_']] as TResultArray<string,string> )
    testSummary();
  //testSummary( ü_all, strictEqual )
    //strictEqual( 0, 1, ü_all.join('\r\n') )
function ö_echo<T>( ...ü_args:T[] ):string {
    return ü_args.join( '\t' );
}
}

export async function tst_testEquals(){
  //
    const ü_data_ = new Map<string,boolean>( );
          ü_data_.set( 'true' , true  );
          ü_data_.set( 'false', false );
          ü_data_.set( '_'    , false );
  //
    await testAsyncFunction( ö_someAsync, ü_data_ );
    testSummary();
  //
async function ö_someAsync( ü_text:string ):Promise<boolean> {
    await whenDelay( 1 );
    switch ( ü_text ) {
        case 'true' : return true ;
        case 'false': return false;
        default: throw new TypeError( `Not a boolean: ${ ü_text }` );
    }
  //
}

}

//====================================================================

export async function tst_whenFileInfoRead(){
    const ö_info = ( await whenFileInfoRead( testSrc( 'real_1' ) ) )!;
    const ü_data = [ 'virtual_2_d'
                   , 'virtual_1_d' ].map( ü_name => [testSrc( ü_name ), '0.1' ] as [string,string] )
    await testAsyncFunction( ö_whenCtime, ü_data );
    testSummary();

async function ö_whenCtime( ü_path:string ):Promise<string> {
    const ü_info = ( await whenFileInfoRead( ü_path ) )!;
    return ( ü_info.ctimeMs - ö_info.ctimeMs )
         + '.'
         + ( ü_info.mtimeMs - ö_info.mtimeMs )
         ;
}
}

export async function tst_whenKnownAsFolder():Promise<void> {
    const ü_file = testSrc( '../node_modules/.bin/flat.cmd' );
    const ü_info = await whenFileInfoRead( 'C:\\zzz_ProgramFiles\\SDIO_1.12.9.749\\SDIO_R749.exe' );
    console.log( ü_info?.mode, isExecutable( ü_info?.mode ?? 0 ), ü_info );
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
    const ü_LFolder  = bind( whenKnownAsFolder , { realFirst:true }, true );
    const ü_LSymLink = bind( whenKnownAsSymLink, { realFirst:true }, true );
    const ü_LFile    = bind( whenKnownAsFile   , { realFirst:true }, true );
  //
    await testAsyncFunction( whenKnownAsFolder , ü_01, (ü_x,ü_eX)=>{ return ü_x.endsWith( 'virtual_3_d' ) && expect( ü_eX, 'ELOOP', true ); } );
    await testAsyncFunction( ü_LFolder         , ü_02  );
    await testAsyncFunction( whenKnownAsSymLink, ü_03, (ü_x,ü_eX)=>{ return ü_x.endsWith( 'virtual_3_d' ) && expect( ü_eX, 'ELOOP', true ); } );
    await testAsyncFunction( ü_LSymLink        , ü_04  );
    await testAsyncFunction( whenKnownAsFile   , ü_05, (ü_x,ü_eX)=>{ return ü_x.endsWith( 'virtual_3_d' ) && expect( ü_eX, 'ELOOP', true ); } );
    await testAsyncFunction( ü_LFile           , ü_06  );
    testSummary();
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
      ] as TResultArray<string,boolean>;
  //
    await testAsyncFunction( isExe, ü_data )
    testSummary();
//await isExe( await ßß_impl.defaultNppExecutable()                 );
}

async function None(){
  //a( ßß_assert.strictEqual )
}

/*
*/