/*
*/
  import { TPromise
         , IReleaseResource
         } from '../types/lib.asyncUtil.d';
//====================================================================

export function createPromise<T>():TPromise<T> {
    const ö_oref = {} as TPromise<T>;
                                                ö_oref.promise
    = new Promise<T>( (ü_resolve,ü_reject) => { ö_oref.resolve = ü_resolve;
                                                ö_oref.reject  = ü_reject ; }
                    );
    return ö_oref;
}

//====================================================================

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

//====================================================================

export class UniqueResource<T=void> {

    private readonly _birth_date = Date.now();
    private readonly _consumers  = [] as [number,string][];
    private          _cursor:Promise<T>
constructor(
    private readonly _resource:T
 ){
    this._cursor = Promise.resolve( this._resource );
}

isPending( ö_actionId:string ):boolean {
  const ü_hit = this._consumers.find(function(ü_action){ ü_action[1] === ö_actionId });
  return ü_hit !== undefined;
}

async whenAvailable( ö_actionId?:string ):Promise<IReleaseResource<T>> {
  //
    const ö_when = Date.now() - this._birth_date;
    this._consumers.push([ ö_when, ö_actionId ?? '' ]);
    console.log( `Queueing ${ ö_actionId ?? '<???>' }@${ ö_when }` );
  //
    const ü_next = createPromise<T>();
    const ü_whenPrevious = this._cursor;
                           this._cursor = ü_next.promise;
    const ö_releaseNext                 = ü_next.resolve;
  //
    await ü_whenPrevious;

  //const ü_done = ü_currentLock.then(function(){ return ö_release as IReleaseResource<T>; });
    return (
( ü_err?:any )=>{
    this._consumers.shift();
    console.log( `Releasing ${ ö_actionId ?? '<???>' }@${ ö_when }` );
    ö_releaseNext( this._resource );
  //
    if ( arguments.length > 0 ) { return Promise.reject<T>( ü_err ); }
                                  return;
}
           ) as IReleaseResource<T>;
}

}

//--------------------------------------------------------------------

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

