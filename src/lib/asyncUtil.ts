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
  //if(ß_trc){ß_trc( `Locking: "${ this._mKey as string }"` );}
  //
      if ( this._pending     ) { return new Promise(  (ü_resolve) => { this._queue.push( ü_resolve ); }  ); }
    else { this._pending = true; return this._that[ this._mKey ]                                          ; }
}
//
release():void {
  //if(ß_trc){ß_trc( `Releasing: "${ this._mKey as string }"` );}
    if ( this._queue.length > 0 )
       { this._queue.shift()! ( this._that[ this._mKey ] ); }
    else { this._pending = false; }
}

}

