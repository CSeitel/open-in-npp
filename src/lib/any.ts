/*
*/
  import * as ßß_path from 'path';
  import * as ßß_cp   from 'child_process';
  import { SpawnOptions
                    } from 'child_process';
  import { promises as ßß_fs
         , Stats
         , PathLike
         } from 'fs';
//------------------------------------------------------------------------------
  import   ExtensionRuntime
           from '../extension';
  const ß_trc = ExtensionRuntime.developerTrace;
//------------------------------------------------------------------------------
  const ß_exe_exts = ['.exe','.cmd','.bat','.lnk'];
//------------------------------------------------------------------------------
export type TPromise<T> =
  { promise: Promise<T>
  , resolve:(value :T    ) => void
  , reject :(reason:Error) => void
  }
//==============================================================================

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

//------------------------------------------------------------------------------

export function createPromise<T>():TPromise<T> {
    const ö_oref = {} as TPromise<T>;
                                                ö_oref.promise
    = new Promise<T>( (ü_resolve,ü_reject) => { ö_oref.resolve = ü_resolve;
                                                ö_oref.reject  = ü_reject ; }
                    );
    return ö_oref;
}

//------------------------------------------------------------------------------

export class LockHandler<T,P extends keyof T> {
    private          _pending                             = false;
    private readonly _queue :(  (value:T[P]) => void  )[] = [];
//
constructor(
    private readonly _mKey :P
  , private readonly _that :T
){
}
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

export async function isExe( ü_path:string ):Promise<boolean> {
  //
    let ü_stats:Stats;
    try {
      ü_stats = await ßß_fs.stat( ü_path );
    } catch ( eX ) {
      if(ß_trc){ß_trc( eX.message );}
      return false;
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
/*
*/