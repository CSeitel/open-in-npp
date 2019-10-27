/*
https://www.linux.com/tutorials/understanding-linux-file-permissions/
*/
import * as ßß_fs     from 'fs';
import * as ßß_cp     from 'child_process';

//==============================================================================
  const ß_exe_path = {
    x86_32bit: "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
  , x64_64bit: "C:\\Program Files\\Notepad++\\notepad++.exe"
  , path_env: "notepad++.exe"
  , previous: ""
  };

export interface IConfig {
  Executable: string;
  multiInst?: boolean;
}

export function defaultNppExecutable():string {
         if (                                          ß_exe_path.previous.length > 0
                                            ) { return ß_exe_path.previous ; }
    else if ( isExe( ß_exe_path.x64_64bit ) ) { return ß_exe_path.previous = ß_exe_path.x64_64bit; }
    else if ( isExe( ß_exe_path.x86_32bit ) ) { return ß_exe_path.previous = ß_exe_path.x86_32bit; }
    else                                      { return ß_exe_path.previous = ß_exe_path.path_env ; }
}

function isExe( path:string ):boolean {
  let ü_stats: ßß_fs.Stats;
  try {
    ü_stats = ßß_fs.statSync( path );
  } catch (error) {
    return false;
  }
  if ( ü_stats.isDirectory() ) { return false; }
//console.log( ü_stats.mode );
//
  return true;
//( ü_stats.mode >>9 ) & 0o111
}

export function spawnProcess( ü_config:IConfig, ü_fileName:string ) {
//
  let ü_args = [ ü_fileName ];
  if ( ü_config.multiInst ) {
    ü_args.push( "-multiInst" );
  }
//
  let ü_proc:ßß_cp.ChildProcess;
     ü_proc = ßß_cp.spawn( ü_config.Executable, ü_args );
  try {
  } catch ( eX ) {
  }
//
}