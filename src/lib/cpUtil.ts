/*
https://nodejs.org/api/child_process.html#child_processspawncommand-args-options
*/
  import { type SpawnOptions
         , type ChildProcess
         } from 'child_process';
  import { type TChildProcess
         } from '../types/lib.cpUtil.d';
//--------------------------------------------------------------------
  import { promisify
         } from 'util';
  import { spawn
         , execFile
         } from 'child_process';
  import { createPromise
         } from '../lib/asyncUtil';
//--------------------------------------------------------------------
  import { ß_trc
         , ß_err
         } from '../runtime/context';
//--------------------------------------------------------------------
  export const child_process =
    { execFile: promisify( execFile )
    };
//====================================================================

export function whenChildProcessSpawned( ü_exe:string, ü_args:readonly string[], ü_opts?:SpawnOptions ):Promise<TChildProcess> {
    const ö_prms = createPromise<TChildProcess>();
  //
    const ö_cp = spawn( ü_exe, ü_args, ü_opts ?? {} );
    if ( ö_cp.pid === undefined ) { ö_cp.on( 'error', ö_prms.reject                         ); }
    else                          {                   ö_prms.resolve( ö_cp as TChildProcess ); }
  //
    return ö_prms.promise;
function ö_reject( ü_reason:any ):void {
    ß_trc&& ß_trc( ö_cp, ''+ü_reason );
    ö_prms.reject( ü_reason );
}
}

//====================================================================

export async function whenShownInWindowsExplorer( ü_fileUri:string ):Promise<boolean> {
  //
    const ü_exe  = 'explorer.exe';
    const ü_args = [ '/select,"' + ü_fileUri + '"' ];
    const ü_opts:SpawnOptions =
      { detached: true
      , windowsVerbatimArguments: true
      };
  //
    try {
        whenChildProcessSpawned( ü_exe, ü_args, ü_opts );
        return true;
    } catch ( ü_eX ) {
        ß_err( ü_eX );
        return false;
    }
}

//====================================================================
/*
*/