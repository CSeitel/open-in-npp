/*
*/
import * as ßß_path from 'path';
import * as ßß_impl from '../../implementation';

describe('Test', () => {

it('it', async () => {
    //ßß_path.resolve( __dirname, '' )
//const Executable = ßß_testApi.defaultExe();
//ßß_testApi.spawn( {Executable, multiInst: false }, __filename );
  const Executable = ßß_impl.defaultNppExecutable();
  return ßß_impl.spawnProcess( {Executable }, __filename );
});

});

/*
  console.log( exe );
{
  detached: true,
  stdio: 'ignore'
}
*/