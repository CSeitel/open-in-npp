/*
*/
  import { type SpawnOptions
         } from 'child_process';
//------------------------------------------------------------------------------
  import * as ßß_cp     from 'child_process';
  import * as ßß_util   from 'util';
  import { Disposable
         } from 'vscode';
  import { spawn
         } from 'child_process';
  import { promises as ß_fs_p
         } from 'fs';
  import { createPromise
         } from '../lib/asyncUtil';
//------------------------------------------------------------------------------
  export const child_process =
    { execFile: ßß_util.promisify( ßß_cp.execFile )
    };
//------------------------------------------------------------------------------
  import { ß_RuntimeContext
         , ß_trc
         } from '../runtime/context';
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//==============================================================================

export class BufferedMap<K,T> extends Map<K,T> {

constructor(
    private readonly _getIt   :(ü_id:K)=>T
  , private readonly _thisArg?:any
){
    super();
}

get( ü_id:K ):T {
    if ( this.has( ü_id ) ) { return super.get( ü_id )!; }
                   const ü_value = this._getIt.call( this._thisArg, ü_id );
         this.set( ü_id, ü_value );
                  return ü_value;
}

}

//------------------------------------------------------------------------------

export abstract class RootDisposable implements Disposable {
    private            _isDisposed_eX :Error|null   = null;
    protected readonly _disposables  :Disposable[] = [];

protected _addDisposable<T extends Disposable>( ...ü_args:T[] ):T {
    this._disposables.push( ...ü_args );
    return ü_args[0];
}

get _isDisposed():boolean {
    return this._isDisposed_eX !== null;
}

protected _assertIsNotDisposed():void {
    if ( this._isDisposed ) { throw this._isDisposed_eX; }
}

dispose():void {
    if ( this._isDisposed ) { return; }
         this._isDisposed_eX = new Error( `Disposed` );
  //
      for ( const ü_disp of this._disposables ) {
                  ü_disp.dispose();
      }
}

}

//==============================================================================

export async function whenChildProcessSpawned( ü_exe:string, ü_args:readonly string[], ü_opts?:SpawnOptions ):Promise<number> {
    const ü_prms = createPromise<number>();
  //
    const ö_proc = spawn( ü_exe, ü_args, ü_opts ?? {} );
    if ( ö_proc.pid === undefined ) { ö_proc.on( 'error', ü_prms.reject              ); }
    else                            {                     ü_prms.resolve( ö_proc.pid ); }
  //
    return ü_prms.promise;
}

//==============================================================================

export async function whenShownInWindowsExplorer( ü_fileUri:string ):Promise<boolean> {
  //const ü_not = await ßß_commands.executeCommand( ß_vscCommands.revealInOSExplorer, ü_fileUri );
  //return true;
    const ü_arg0 = '/select,"' + ü_fileUri + '"';
    console.log( ü_arg0 );
  //
    const ü_OSexplorer = 'explorer.exe';
  //
    const ü_opts:ßß_cp.SpawnOptions =
      { detached: true
      , windowsVerbatimArguments: true
      };
    try {
      const ü_cp = ßß_cp.spawn( ü_OSexplorer, [ ü_arg0 ], ü_opts );
      return true;
    } catch ( ü_eX ) {
      console.error( ü_eX );
      return false;
    }
}


//==============================================================================
/*
*/