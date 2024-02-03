/*
*/
  import { type TResultArray
         } from '../../types/lib.testUtil.d';
  import { basename
         } from 'path';
  import { strictEqual
         } from 'assert';
  import * as ßß_assert from 'assert';
//--------------------------------------------------------------------
  import { whenDelay
         } from '../../lib/asyncUtil';
  import { whenFileInfoRead
         , whenKnownAsFolder
         , isExe
         } from '../../lib/fsUtil';
  import { testSuite
         , testSummary
         , testEquals
         , testFunction
         , testAsyncFunction
         , bind
         } from '../../lib/testUtil';
//====================================================================

testSuite( basename( __filename ),
    [ ß_testEquals_1
    , ß_testEquals
    , ß_whenFileInfoRead
    , ß_whenKnownAsFolder
    , ß_isExe
    ]
  );

//====================================================================

async function ß_testEquals_1(){
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

async function ß_testEquals(){
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

async function ß_whenFileInfoRead(){
    let ü_info = await whenFileInfoRead( __filename );
    ßß_assert.strictEqual( true, ü_info?.isFile() );
        ü_info = await whenFileInfoRead( __dirname , true );
    ßß_assert.strictEqual( true, ü_info?.isDirectory() );
    let ü_none = await whenFileInfoRead( '_' );
    ßß_assert.strictEqual( null, ü_none );
  //
  //testSummary( await testAsyncFunction( whenFileInfoRead, ü_data ), strictEqual );
}

async function ß_whenKnownAsFolder():Promise<void> {
    const ü_data =
      [ [ __dirname                  , true  ]
      , [ 'C:\\zzz_Office'           , false ]
      , [ 'C:\\Users\\c_sei\\wsf-bin', true  ]
      ] as TResultArray<string,boolean>;
    testSummary( await testAsyncFunction( whenKnownAsFolder, ü_data ), strictEqual );
  //strictEqual( false, await whenKnownAsFolder( 'C:\\Users\\c_sei\\wsf-bin', true ) );
}

async function ß_isExe(){
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