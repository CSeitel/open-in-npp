/*
*/
import * as ßß_assert from "assert";
import * as ßß_path   from 'path';
import * as ßß_impl from '../../implementation';

describe('Test', () => {

it( 'it', async () => {
  return;
  const Executable = await ßß_impl.defaultNppExecutable();
  const pid = await ßß_impl.spawnProcess( {Executable }, __filename );
  console.log( pid );
  ßß_assert.notEqual( pid, -1 );
  ßß_assert.notEqual( pid, +0 );
});

it( 'Exe', async () => {
  const Executable = await ßß_impl.defaultNppExecutable();
//await ßß_impl.isExe( Executable );
  await ßß_impl.isExe( __filename );
  await ßß_impl.isExe( 'C:\\zzz_Dev\\node_modules\\open-in-npp\\.gitignore' );
});

});

/*
    //ßß_path.resolve( __dirname, '' )
//const Executable = ßß_testApi.defaultExe();
//ßß_testApi.spawn( {Executable, multiInst: false }, __filename );
  console.log( exe );
{
  detached: true,
  stdio: 'ignore'
}
*/