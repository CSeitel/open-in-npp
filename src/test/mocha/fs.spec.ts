/*
*/
  import { basename
         } from 'path';
  import { strictEqual
         } from 'assert';
  import * as ßß_assert from 'assert';
//--------------------------------------------------------------------
  import { whenFileInfoRead
         , whenKnownAsFolder
         , isExe
         } from '../../lib/fsUtil';
  import { testEquals
         , testSummary
         } from '../../lib/testUtil';
//====================================================================
suite( basename( __filename ), ()=>{


test( 'testEquals', async () => {
    const ü_all = [ ''
    , testEquals( {}, {} )
    , testEquals(  0,  0 )
    , testEquals(  0,  0 )
    ]
    testSummary( ü_all, strictEqual )
    //strictEqual( 0, 1, ü_all.join('\r\n') )
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
    ßß_assert.strictEqual( true , await whenKnownAsFolder( __dirname ) );
    ßß_assert.strictEqual( true , await whenKnownAsFolder( 'C:\\zzz_Office'            ) );
    ßß_assert.strictEqual( true , await whenKnownAsFolder( 'C:\\Users\\c_sei\\wsf-bin' ) );
    ßß_assert.strictEqual( false, await whenKnownAsFolder( 'C:\\Users\\c_sei\\wsf-bin', true ) );
});

test( 'isExe', async () => {
//await ßß_impl.isExe( Executable );
  ßß_assert.strictEqual( false, await isExe( __filename                                           ) );
  ßß_assert.strictEqual( false, await isExe( __dirname                                            ) );
  ßß_assert.strictEqual( false, await isExe( '_dir ame &'                                         ) );
  ßß_assert.strictEqual( false, await isExe( 'C:\\zzz_Dev\\node_modules\\open-in-npp\\.gitignore' ) );
//await isExe( await ßß_impl.defaultNppExecutable()                 );
});

test( 'isExe', async () => {
    let ü_val = 'C:\\zzz_Dev\\node_modules\\open-in-npp\\.gitignore';
        ü_val += ü_val;
        ü_val += ü_val;
    try {
        ßß_assert.strictEqual( true, ü_val, 'ggggg' );
    } catch ( ü_eX ) {
        console.error( (ü_eX as any).code );
        throw ü_eX;
    }
  //a( ßß_assert.strictEqual )
});

});
