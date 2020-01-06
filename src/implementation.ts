/*
https://www.linux.com/tutorials/understanding-linux-file-permissions/
https://nodejs.org/api/child_process.html#child_process_event_error
*/
  import * as ßß_cp from 'child_process';
  import { isExe
         } from "./lib/any";
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

//------------------------------------------------------------------------------
export interface IConfig {
  executable: string
  detached  : boolean
  multiInst : boolean
  preserveCursor : boolean
  lineNumber: number
}

//==============================================================================

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