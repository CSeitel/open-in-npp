/*
*/
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
  import { testSummary
         , testEquals
         , testAsyncFunction
         } from '../../lib/testUtil';
//====================================================================
suite( basename( __filename ), ()=>{


test( 'testEquals', async () => {
    const ü_all = [ ''
    , testEquals( {}, {}, '9999' )
    , testEquals(  0,  0 )
    , testEquals(  0,  0 )
    ]
    testSummary( ü_all, strictEqual )
    //strictEqual( 0, 1, ü_all.join('\r\n') )
});


test( 'testEquals', async () => {
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

});


test( 'whenFileInfoRead', async ()=>{
    let ü_info = await whenFileInfoRead( __filename );
    ßß_assert.strictEqual( true, ü_info?.isFile() );
        ü_info = await whenFileInfoRead( __dirname , true );
    ßß_assert.strictEqual( true, ü_info?.isDirectory() );
    let ü_none = await whenFileInfoRead( '_' );
    ßß_assert.strictEqual( null, ü_none );
});


test( 'whenKnownAsFolder', async ()=>{
    const ü_data =
      [ [ __dirname                  , true  ]
      , [ 'C:\\zzz_Office'           , false ]
      , [ 'C:\\Users\\c_sei\\wsf-bin', true  ]
      ] as [string,boolean][];
    testSummary( await testAsyncFunction( whenKnownAsFolder, ü_data ), strictEqual );
  //ßß_assert.strictEqual( true , await whenKnownAsFolder( __dirname ) );
  //ßß_assert.strictEqual( true , await whenKnownAsFolder( 'C:\\zzz_Office'            ) );
  //ßß_assert.strictEqual( true , await whenKnownAsFolder( 'C:\\Users\\c_sei\\wsf-bin' ) );
  //strictEqual( false, await whenKnownAsFolder( 'C:\\Users\\c_sei\\wsf-bin', true ) );
});

test( 'isExe', async () => {
    const ü_data =
      [ [ __filename  , false ]
      , [ __dirname   , false ]
      , [ '_dir ame &', false ]
      , [ 'C:\\zzz_Dev\\node_modules\\open-in-npp\\.gitignore', false ]
      ] as [string,boolean][];
  //
    testSummary( await testAsyncFunction( isExe, ü_data ), strictEqual );
//await isExe( await ßß_impl.defaultNppExecutable()                 );
});

test( 'None', async () => {
  //a( ßß_assert.strictEqual )
});

});
