/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { basename
         } from 'path';
  import { strictEqual
         } from 'assert';
  import * as ßß_assert from 'assert';
//--------------------------------------------------------------------
  import { whenDelay
         } from '../../../lib/asyncUtil';
  import { whenFileInfoRead
         , whenKnownAsFolder
         , isExe
         } from '../../../lib/fsUtil';
  import { testSrc
         , testSummary
         , testAsyncFunction
         , testFunction
         , testEquals
         , bind
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_testEquals_1(){
    const ü_all = [ ''
    , testEquals( {}, {}, '9999' )
    , testEquals(  0,  0 )
    , testEquals(  0,  0 )
    ]
    const ü_fref = bind( ö_echo, { arrangeReal:[2] }, '_0','_1' )
    testSummary( testFunction( ü_fref, [['A_','_0\t_1\tA_']] as TResultArray<string,string> ), strictEqual );
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
    testSummary( await testAsyncFunction( ö_someAsync, ü_data_ ), strictEqual );
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

export async function tst_whenFileInfoRead_(){
    let ü_info = await whenFileInfoRead( __filename );
    ßß_assert.strictEqual( true, ü_info?.isFile() );
        ü_info = await whenFileInfoRead( __dirname , true );
    ßß_assert.strictEqual( true, ü_info?.isDirectory() );
    let ü_none = await whenFileInfoRead( '_' );
    ßß_assert.strictEqual( null, ü_none );
  //
  //testSummary( await testAsyncFunction( whenFileInfoRead, ü_data ), strictEqual );
}
//====================================================================

export async function tst_whenFileInfoRead(){
    const ö_info = ( await whenFileInfoRead( testSrc( 'real_1' ) ) )!;
    const ü_data = [ 'virtual_2_d'
                   , 'virtual_1_d' ].map( ü_name => [testSrc( ü_name ), '0.1' ] as [string,string] )
    testSummary( await testAsyncFunction( ö_whenCtime, ü_data ), strictEqual );

async function ö_whenCtime( ü_path:string ):Promise<string> {
    const ü_info = ( await whenFileInfoRead( ü_path ) )!;
    return ( ü_info.ctimeMs - ö_info.ctimeMs )
         + '.'
         + ( ü_info.mtimeMs - ö_info.mtimeMs )
         ;
}
}

export async function tst_whenKnownAsFolder():Promise<void> {
    const ü_data =
      [
        [ __filename , false    ]
      , [ __dirname  , true     ]
      , [ '*'        , false ]
      , [ ''         , false ]
      , [ ' '        , false ]
      , [ '.'        , true  ]
      , [ '..'       , true  ]
      , [ '../..'    , true  ]
      , [ testSrc( 'virtual_1_j' ), true  ]
      , [ testSrc( 'virtual_1_d' ), true  ]
      , [ testSrc( 'virtual_2_d' ), true  ]
      , [ testSrc( 'virtual_3_d' ),         -1 ]
      , [ testSrc( 'virtual_6_d' ), false ]
      ] as TResultArray<string,boolean|-1>;
  //
    testSummary( await testAsyncFunction( whenKnownAsFolder, ü_data,
     (ü_x,ü_eX)=>{
                                    return ü_x.endsWith( 'virtual_3_d' ) ? -1 : -2 as -1; }
      ), strictEqual );
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
    testSummary( await testAsyncFunction( isExe, ü_data ), strictEqual );
//await isExe( await ßß_impl.defaultNppExecutable()                 );
}

async function None(){
  //a( ßß_assert.strictEqual )
}

/*
*/