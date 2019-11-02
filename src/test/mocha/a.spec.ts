/*
*/
import * as ßß_assert from "assert";
import * as ßß_path   from 'path';
import * as ßß_impl from '../../implementation';

describe( 'Test', () => {

it( 'it', async () => {
//return;
  const Executable = await ßß_impl.defaultNppExecutable();
  const detached = false;
  const ü_pid = await ßß_impl.spawnProcess( {executable: Executable, detached}, __filename );
  console.log( ü_pid );
  ßß_assert.notEqual( ü_pid, -1 );
  ßß_assert.notEqual( ü_pid, +0 );
  await ß_kill( ü_pid );
});

it( 'isExe', async () => {
//await ßß_impl.isExe( Executable );
  await ß_isExe( __filename                                          , false );
  await ß_isExe( 'C:\\zzz_Dev\\node_modules\\open-in-npp\\.gitignore', false );
  await ß_isExe( await ßß_impl.defaultNppExecutable()                , true  );
});

});

async function ß_isExe( ü_fileName:string, ü_isExe:boolean ) {
  const ü_actual = await ßß_impl.isExe( ü_fileName );
  ßß_assert.equal( ü_actual, ü_isExe );
}

async function ß_kill( ü_pid:number ):Promise<void> {
  return new Promise( (ü_resolve,ü_reject) => {
    setTimeout( () => {
      process.kill( ü_pid );
      ü_resolve();
    }, 1000 );
  });
}

//==============================================================================
/*
*/