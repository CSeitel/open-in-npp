/*
*/
  import { basename
         } from 'path';
  import * as ßß_assert from 'assert';
  import { whenFileInfoRead
         , whenKnownAsFolder
         } from '../../lib/fsUtil';
//--------------------------------------------------------------------
suite( basename( __filename ), ()=>{


test( 'whenFileInfoRead', async ()=>{
    let ü_info = await whenFileInfoRead( __filename, true );
    ßß_assert.strictEqual( true, ü_info.isFile() );
        ü_info = await whenFileInfoRead( __dirname , true );
    ßß_assert.strictEqual( true, ü_info.isDirectory() );
    let ü_none = await whenFileInfoRead( '_' , false );
    ßß_assert.strictEqual( null, ü_none );
});


test( 'whenKnownAsFolder', async ()=>{
    ßß_assert.strictEqual( true, await whenKnownAsFolder( __dirname ) );
    ßß_assert.strictEqual( true, await whenKnownAsFolder( 'C:\\zzz_Office'        ) );
    ßß_assert.strictEqual( true, await whenKnownAsFolder( 'C:\\Users\\c_sei\\wsf-bin' ) );
});


});
