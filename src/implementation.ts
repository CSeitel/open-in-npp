/*
https://www.linux.com/tutorials/understanding-linux-file-permissions/
https://nodejs.org/api/child_process.html#child_process_event_error
*/
import * as ßß_fs   from 'fs';
import * as ßß_cp   from 'child_process';
import * as ßß_util from 'util';
import * as ßß_path from 'path';
//==============================================================================
  const ß_exe_path = {
    x86_32bit: "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
  , x64_64bit: "C:\\Program Files\\Notepad++\\notepad++.exe"
  , path_env: "notepad++.exe"
  };
  const ß_arg_multiInst  = '-multiInst';
  const ß_arg_lineNumber = '-n';
  const ß_spawnOpts:ßß_cp.SpawnOptions =
  { stdio: 'ignore'
  , detached: false
  };
  const ß_exe_exts = ['.exe','.cmd','.bat','.lnk'];
//==============================================================================

export interface IConfig {
  executable: string;
  multiInst?: boolean;
  detached: boolean;
  lineNumber: number;
}

//------------------------------------------------------------------------------

export async function isExe( ü_path:string ):Promise<boolean> {
  const promiseStat = ßß_util.promisify( ßß_fs.stat );
//
  let ü_stats: ßß_fs.Stats;
  try {
    ü_stats = await promiseStat( ü_path );
  } catch ( eX ) {
    return false;
  }
  if ( ü_stats.isDirectory() ) { return false; }
//
  const ü_ext = ßß_path.extname( ü_path ).toLocaleLowerCase();
  if ( ! ß_exe_exts.includes( ü_ext ) ) { return false; }
//
//console.log( (( ü_stats.mode >>9 ) <<9) + (ü_stats.mode & 0x1ff ), ü_stats.mode );
//console.log( ( ü_stats.mode >>9 ).toString(8) , (ü_stats.mode & 0x1ff ).toString(8), ü_stats.mode );
  return true;
}

//------------------------------------------------------------------------------

export async function defaultNppExecutable():Promise<string> {
       if ( await isExe( ß_exe_path.x64_64bit ) ) { return ß_exe_path.x64_64bit; }
  else if ( await isExe( ß_exe_path.x86_32bit ) ) { return ß_exe_path.x86_32bit; }
  else                                            { return ß_exe_path.path_env ; }
}

//------------------------------------------------------------------------------

export async function spawnProcess( ü_config:IConfig, ü_fileName:string ) {
//
                               let ü_args = [ ü_fileName ];
  if ( ü_config.multiInst      ) { ü_args.push( ß_arg_multiInst                        ); }
  if ( ü_config.lineNumber > 0 ) { ü_args.push( ß_arg_lineNumber + ü_config.lineNumber ); }
//
  ß_spawnOpts.detached = ü_config.detached;
  return new Promise<number>( (ü_resolve,ü_reject) => {
    const ü_proc = ßß_cp.spawn( ü_config.executable, ü_args, ß_spawnOpts );
    if ( ü_proc.pid !== undefined ) {
      ü_resolve( ü_proc.pid );
    }
    ü_proc.on( 'error', eX => { ü_reject( eX ); });
  });
//
}

//==============================================================================
/*
*/