/*
*/
  import * as ßß_path   from 'path';
  import * as ßß_fs     from 'fs';
  import * as ßß_cp     from 'child_process';
  import * as ßß_util   from 'util';
  import { Stats
         , PathLike
         } from 'fs';
  import { SpawnOptions
         } from 'child_process';
  import { Disposable
         } from 'vscode';
//------------------------------------------------------------------------------
  export const ßß_fs_p = ßß_fs.promises;
  export { SpawnOptions
         } from 'child_process';
  export const child_process =
    { execFile: ßß_util.promisify( ßß_cp.execFile )
    };
//------------------------------------------------------------------------------
  import   ExtensionRuntime
           from '../extension';
  const ß_trc = ExtensionRuntime.developerTrace;
//------------------------------------------------------------------------------
  import { TFSError
         } from './types';
//------------------------------------------------------------------------------
  const ß_exe_exts = ['.exe','.cmd','.bat','.lnk'];
//------------------------------------------------------------------------------
export type TPromise<T> =
  { promise: Promise<T>
  , resolve:(value :T    ) => void
  , reject :(reason:Error) => void
  }
//==============================================================================

export function createPromise<T>():TPromise<T> {
    const ö_oref = {} as TPromise<T>;
                                                ö_oref.promise
    = new Promise<T>( (ü_resolve,ü_reject) => { ö_oref.resolve = ü_resolve;
                                                ö_oref.reject  = ü_reject ; }
                    );
    return ö_oref;
}

//------------------------------------------------------------------------------

export async function whenDelay( ü_delay:number ):Promise<number> {
  //
    const ö_oref  = createPromise<number>();
    const ö_start = process.hrtime.bigint();
    setTimeout( ö_later, ü_delay );
  //
    return ö_oref.promise;
//
function ö_later():void {
                      const ü_end   = process.hrtime.bigint();
                      const ü_delta = ( ü_end - ö_start ) / BigInt( 1000000 );
    ö_oref.resolve( Number( ü_delta ) );
}

}

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

export class LockHandler<T,P extends keyof T> {
    private          _pending                             = false;
    private readonly _queue :(  (value:T[P]) => void  )[] = [];
//
constructor(
    private readonly _mKey :P
  , private readonly _that :T
){}
//
async whenLocked():Promise<T[P]> {
    if(ß_trc){ß_trc( `Locking: "${ this._mKey }"` );}
  //
      if ( this._pending     ) { return new Promise(  (ü_resolve) => { this._queue.push( ü_resolve ); }  ); }
    else { this._pending = true; return this._that[ this._mKey ]                                          ; }
}
//
release():void {
    if(ß_trc){ß_trc( `Releasing: "${ this._mKey }"` );}
    if ( this._queue.length > 0 )
       { this._queue.shift()! ( this._that[ this._mKey ] ); }
    else { this._pending = false; }
}

}

//==============================================================================

export async function whenFileInfoRead( ü_path:PathLike                        ):Promise<Stats|null>
export async function whenFileInfoRead( ü_path:PathLike, ü_fileExists :false   ):Promise<Stats|null>
export async function whenFileInfoRead( ü_path:PathLike, ü_fileExists :true    ):Promise<Stats     >
export async function whenFileInfoRead( ü_path:PathLike, ü_fileExists?:boolean ):Promise<Stats|null> {
  //
    if ( ü_fileExists === true ) {
      return ßß_fs_p.stat( ü_path );
    }
  //
    try {
      const ü_stat = await ßß_fs_p.stat( ü_path );
      return ü_stat;
    } catch ( ü_eX ) {

      switch ( ( ü_eX as TFSError ).code ) {
        case 'ENOENT':
          return null;
      }

      console.error( ü_eX );
      throw ü_eX;
    }
}

export async function whenKnownAsFolder( ü_path:ßß_fs.PathLike ):Promise<boolean> {
    const ü_info = await whenFileInfoRead( ü_path );
    if ( ü_info === null      ) { return false; }
    if ( ü_info.isDirectory() ) { return true ; }
    if ( ü_info.isSymbolicLink() ) {
      const ü_real = await ßß_fs_p.realpath( ü_path );
    }
    return false;
}

//------------------------------------------------------------------------------

export function expandEnvVariables( ü_path:string ):string {
  //
    const ü_rgXp = /%([^%]+)%/g;
    return ü_path.replace( ü_rgXp, ö_win32 );
//
function ö_win32( ü_original:string, ü_name:string ):string {
    const ü_resolved = process.env[ ü_name ];
    return ü_resolved === undefined
         ? ü_original
         : ü_resolved
         ;
}
//
}

//==============================================================================

export async function whenChildProcessSpawned( ü_exe:string, ü_args:readonly string[], ü_opts?:SpawnOptions ):Promise<number> {
  //
    if ( ü_opts === undefined )
       { ü_opts = {};
       }
  //
    let ö_resolve:(ü_value:number) => void
    let ö_reject :(ü_error:Error ) => void
    const ü_whenPid = new Promise<number>( (ü_resolve,ü_reject) => {
      ö_resolve = ü_resolve;
      ö_reject  = ü_reject ;
    //ö_reject  = ( ü_eX ) => { ü_reject( ü_eX ); }; _showError( ü_eX, [ ü_exe, ... ü_args ] );
    });
  //
    try {
    //
      const ö_proc = ßß_cp.spawn( ü_exe, ü_args, ü_opts );
      if ( ö_proc.pid === undefined ) { ö_proc.on( 'error', ö_rejectError          ); }
      else                            {                     ö_resolve!( ö_proc.pid ); }
    //
    } catch ( ü_eX ) {
      ö_rejectError( ü_eX );
    }
  //
    return ü_whenPid;
//
function ö_rejectError( ü_eX:Error ) {
    console.error( ü_eX );
    ö_reject( ü_eX );
}
//
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

export function putFirst<T,P extends keyof T>( ü_list:T[], ö_item:T|T[P], ü_prop?:P ):number {
    const ü_indx = ü_prop === undefined
                 ? ü_list.findIndex( ü_item => ü_item           === ö_item )
                 : ü_list.findIndex( ü_item => ü_item[ ü_prop ] === ö_item )
                 ;
    if ( ü_indx > 0 ) {
      ü_list.unshift( ü_list.splice( ü_indx, 1 )[0] );
    }
    return ü_indx;
}

export function putFirstIndex<T>( ü_list:T[], ü_indx:number ):void {
    if ( ü_indx > 0 ) {
      const ü_item = ü_list.splice( ü_indx, 1 )[0];
                     ü_list.unshift( ü_item );
    }
}

//==============================================================================

export async function isExe( ü_path:string, ü_enforceAbsolute = false ):Promise<boolean> {
  //
    if ( ü_enforceAbsolute
      && ! ßß_path.isAbsolute( ü_path ) ) {
      return false;
    }
  //
    let ü_stats:Stats;
    try {
      ü_stats = await ßß_fs_p.stat( ü_path );
    } catch ( ü_eX ) {
      if ( ü_eX instanceof Error ) {
        switch ( ( ü_eX as TFSError ).code ) {
          case 'ENOENT':
            if(ß_trc){ß_trc( ü_eX.message );}
            return false;
        }
      }
      console.error( ü_eX );
      throw ü_eX;
    }
  //
    if ( ü_stats.isDirectory() ) { return false; }
  //
    const ü_ext = ßß_path.extname( ü_path ).toLowerCase();
    if ( ! ß_exe_exts.includes( ü_ext ) ) { return false; }
  //
  //ß_trc( (( ü_stats.mode >>9 ) <<9) + (ü_stats.mode & 0x1ff ), ü_stats.mode );
  //ß_trc( ( ü_stats.mode >>9 ).toString(8) , (ü_stats.mode & 0x1ff ).toString(8), ü_stats.mode );
    return true;
}

//------------------------------------------------------------------------------

export function shortenText( ü_path:string, ü_length:number ):string {
  if ( ü_path.length <= ü_length ) { return ü_path; }
//const ü_tooMuch = 3 + ü_path.length - ü_length;
  const ü_tooMuch = ü_length - 5;
  const ü_remainder = ü_tooMuch % 2;
  const ü_even = ( ü_tooMuch - ü_remainder ) / 2;
  return ü_path.slice( 0      , ü_even +ü_remainder )
       + ' ... '
       + ü_path.slice( -ü_even, ü_path.length       )
       ;
}


//==============================================================================
/*
*/