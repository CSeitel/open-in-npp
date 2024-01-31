/*
*/
import * as ßß_assert from 'assert';
import * as ßß_path   from 'path';

describe( 'Test', () => {

it( 'it', async () => {
});

it( 'isExe', async () => {
//await ßß_impl.isExe( Executable );
  await ß_isExe( __filename                                          , false );
  await ß_isExe( __dirname                                           , false );
  await ß_isExe( '_dir ame &'                                        , false );
  await ß_isExe( 'C:\\zzz_Dev\\node_modules\\open-in-npp\\.gitignore', false );
//await ß_isExe( await ßß_impl.defaultNppExecutable()                , true  );
});

});

async function ß_isExe( ü_path:string, ü_expected:boolean ) {
}

async function ß_kill( ü_pid:number ):Promise<void> {
  return new Promise( (ü_resolve,ü_reject) => {
    setTimeout( () => {
      process.kill( ü_pid );
      ü_resolve();
    }, 1000 );
  });
}

//====================================================================
/*
  const ü_actual = await ßß_impl.isExe( ü_fileName );
  ßß_assert.equal( ü_actual, ü_isExe );
*/