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
  const enum ECLIParameters
    { multipleInstances = '-multiInst'
    ,   lineNumber      = '-n'
    , columnNumber      = '-c'
    };
//------------------------------------------------------------------------------
export const CNaLineNumber = 0;
//==============================================================================

export async function defaultNppExecutable():Promise<string> {
         if ( await isExe( EExecutables.x64_64bit ) ) { return EExecutables.x64_64bit; }
    else if ( await isExe( EExecutables.x86_32bit ) ) { return EExecutables.x86_32bit; }
    else                                              { return EExecutables.path_env ; }
}

//------------------------------------------------------------------------------

export async function spawnProcess( ü_config:ConfigSnapshot, ü_fileName:string ):Promise<number> {
  //
                                           const ü_args = ü_config.commandLineArguments;
    if ( ü_config.multiInst                  ) { ü_args.push( ECLIParameters.multipleInstances                    ); }
    if ( ü_config.lineNumber > CNaLineNumber ) { ü_args.push( ECLIParameters.lineNumber   + ü_config.  lineNumber );
                                                 ü_args.push( ECLIParameters.columnNumber + ü_config.columnNumber ); }
                                                 ü_args.push( ü_fileName );
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