/*
https://www.linux.com/tutorials/understanding-linux-file-permissions/
https://nodejs.org/api/child_process.html#child_process_event_error
*/
  import * as ßß_cp from 'child_process';
//------------------------------------------------------------------------------
  import { ConfigSnapshot
         } from './configHandler';
  import { isExe
         } from "./lib/any";
//------------------------------------------------------------------------------
  const enum EExecutables
    { x86_32bit = "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
    , x64_64bit = "C:\\Program Files\\Notepad++\\notepad++.exe"
    , path_env  = "notepad++.exe"
    };
  const ß_arg_multiInst  = '-multiInst';
  const ß_arg_lineNumber = '-n';

//==============================================================================

export async function defaultNppExecutable():Promise<string> {
         if ( await isExe( EExecutables.x64_64bit ) ) { return EExecutables.x64_64bit; }
    else if ( await isExe( EExecutables.x86_32bit ) ) { return EExecutables.x86_32bit; }
    else                                              { return EExecutables.path_env ; }
}

//------------------------------------------------------------------------------

export async function spawnProcess( ü_config:ConfigSnapshot, ü_fileName:string ):Promise<number> {
  //
                               const ü_args = [ ü_fileName ];
    if ( ü_config.multiInst      ) { ü_args.push( ß_arg_multiInst                        ); }
    if ( ü_config.lineNumber > 0 ) { ü_args.push( ß_arg_lineNumber + ü_config.lineNumber ); }
  //
    const ü_opts:ßß_cp.SpawnOptions =
      { stdio   : 'ignore'
      , detached: ü_config.detached
      };
    const ö_proc = ßß_cp.spawn( ü_config.executable, ü_args, ü_opts );
  //
    return new Promise<number>( (ü_resolve,ü_reject) => {
      ö_proc.on( 'error', ü_eX => { ü_reject( ü_eX ); });
      if ( ö_proc.pid !== undefined ) {
        ü_resolve( ö_proc.pid );
      }
    });
  //
}

//==============================================================================
/*
*/