/*
*/
  import { type TAsyncFunctionSingleArg
         , type TAsyncFunction
         , type TAsyncFunctionWithoutArg
         , type TAnyFunctionSingleArg
         } from '../types/generic.d';
  import { type TPromise
         , type TPromiseSettled
         , type TTimer
         , type IReleaseResource
         } from '../types/lib.asyncUtil.d';
  import { type IUiXMessage
         , type TUiXMessageTemplate
         , type TTextTemplate
         } from '../types/lib.errorUtil.d';
//--------------------------------------------------------------------
  import { ß_trc
         , ß_err
         , ß_stringify
         } from '../runtime/context';
  import { ErrorWithUixMessage
         , UiXMessage
         } from '../lib/errorUtil';
//====================================================================
  export const whenImmediate = setImmediate.__promisify__;
  export const whenTimeout   = setTimeout  .__promisify__;

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

export async function whenPromiseSettled<T,R=any>( ü_whenDone:PromiseLike<T> ):Promise<TPromiseSettled<T,R>> {
     const ü_done = ( await Promise.allSettled([ ü_whenDone ]) )[0] as TPromiseSettled<T,R>;
           ü_done.rejected = ü_done.status === 'rejected';
           ü_done.status === 'rejected' && ü_done.reason
    return ü_done;
}

export function createAsyncPostProcessor<Tz,Ty>( ö_y_to_z  :TAnyFunctionSingleArg<Tz,Ty>
                                               , ö_eX_to_z?:TAnyFunctionSingleArg<Tz,any> ):TAsyncFunction<Tz> {
    return ö_concat;
function ö_concat( ü_whenDone:PromiseLike<Ty> ):PromiseLike<Tz> {
    return ü_whenDone.then( ö_y_to_z, ö_eX_to_z );
}
}

export function whenDoneAndPostProcessed<Tz,Ty,Tx=Ty>( ö_whenDone:TAsyncFunctionSingleArg <Ty,Tx>
                                                                 |TAsyncFunctionWithoutArg<Ty>
                                                     , ö_y_to_z  :   TAnyFunctionSingleArg<Tz,Ty>
                                                     , ö_eX_to_z?:   TAnyFunctionSingleArg<Tz,any>
                                                                ):TAsyncFunctionSingleArg <Tz,Tx> {
    return ö_concat;
function ö_concat( ü_arg0:Tx ):PromiseLike<Tz> {
    return ö_whenDone( ü_arg0 ).then( ö_y_to_z, ö_eX_to_z );
}
}

function ß_whenDoneAndPostProcessed<Tz,Ty>( ö_whenDone:TAsyncFunctionWithoutArg   <Ty>
                                          , ö_y_to_z  :   TAnyFunctionSingleArg<Tz,Ty>
                                                     ):TAsyncFunctionWithoutArg<Tz> {
    return ö_concat;
function ö_concat( ü_arg0?:any ):PromiseLike<Tz> {
  //return ö_whenDone( ü_arg0 ).then( ö_y_to_z );
    const ü_whenDone = ö_whenDone();
    return ü_whenDone.then( ö_y_to_z );
}
}

//====================================================================

export async function whenDoneWithUiXMessage( ü_whenDone:PromiseLike<unknown>, ü_valueTmpl:TUiXMessageTemplate, ü_errorTmpl?:TUiXMessageTemplate|true ):Promise<IUiXMessage> {
    const ü_done = await whenPromiseSettled( ü_whenDone );
    if ( ü_done.rejected ) {
        if ( ü_done.reason instanceof ErrorWithUixMessage ) { return ü_done.reason; }
        switch ( ü_errorTmpl ) {
            case true:
                if ( ü_done.reason instanceof Error ) { return new UiXMessage( ''+ü_done.reason ).asError(); }
            case undefined: throw ü_done.reason;
            default:
        return         typeof( ü_errorTmpl ) === 'string'
             ? new UiXMessage( ü_errorTmpl, ''+( ü_done.reason ) )
             : new UiXMessage( ü_errorTmpl,      ü_done.reason   )
             ;
        }
    } else {
        return         typeof( ü_valueTmpl ) === 'string'
             ? new UiXMessage( ü_valueTmpl, ''+( ü_done.value ) )
             : new UiXMessage( ü_valueTmpl,      ü_done.value   )
             ;
    }
}

//====================================================================

export function createTimer( ö_reset = false, ü_then?:Date ):TTimer {
    let ö_then = ( ü_then === undefined
                 ? new Date() : ü_then ).valueOf()
                 ;
    return ö_timer;
  //
function ö_timer( ü_reset?:boolean ):number {
     const ü_now  = new Date().valueOf();
     const ü_diff = ü_now - ö_then;
  //
    if (   ü_reset
      || ( ü_reset === undefined 
        && ö_reset ) ) {
      ö_then = ü_now;
    }
  //
    return ü_diff ;
}
}

//====================================================================

export function createWhenResolved<T>( ü_value:T ):PromiseLike<T> {
    return Promise.resolve( ü_value );
}
export function createWhenRejected<T,R=any>( ü_reason:R ):Promise<T> {
    return Promise.reject( ü_reason );
}

export function createPromise<T>():TPromise<T> {
    const ö_oref = {} as TPromise<T>;
                                                ö_oref.promise
    = new Promise<T>( (ü_resolve,ü_reject) => { ö_oref.resolve = ü_resolve;
                                                ö_oref.reject  = ü_reject ; }
                    );
    return ö_oref;
}

//====================================================================

export class AsyncCalculation<Ty,Tx=Ty> {
    private          _tag  :PromiseLike<Ty>|null = null;
    private          _whenY:PromiseLike<Ty>|null = null;
    private          _x    :            Tx       = undefined as any;
constructor(        ü_x    :            Tx
  , private readonly _whenCalculated:TAsyncFunctionSingleArg<Ty,Tx>
  , public  readonly  lazy = false
){
    this.x = ü_x;
}

set x( ü_x:Tx ) {
                       this._x     =                           ü_x  ;
    if ( this.lazy ) { this._tag   = null; }
    else             { this._whenY = this._whenCalculated( this._x ); }
}

get whenY():PromiseLike<Ty> {
    if ( this.lazy ) { this._tag   =
                       this._whenY = this._whenCalculated( this._x ); }
  //
    let ö_pendingY = this._whenY;
    let ö_x        = this._x    ;
    return this._whenY!.then( ü_y => {
                      const ö_current = this.lazy ? this._tag : this._whenY;
        if ( ö_pendingY === ö_current ) { return ü_y; }
        throw                  new Error( `Outdated ${ ö_x }` )  ;
        return Promise.reject( new Error( `Outdated ${ ö_x }` ) );
                                           return this.whenY;

    });
}

}

//====================================================================
  type TAccessAttempt =
    { when:number
    , id  :string
    , release:IReleaseResource<any>
    }

export class UniqueResource<T> {

    private readonly _birthDate    = Date.now();
    private readonly _lockRequests = [] as TAccessAttempt[];
    private          _whenNotLocked    :Promise<T>
constructor(
    private readonly _resource:T
 ){
    this._whenNotLocked = Promise.resolve( this._resource );
}

getResource( ü_release:IReleaseResource<any> ):T {
    if ( ü_release !== this._lockRequests[0].release ) {
        throw new Error( 'Resource is not available' );
    }
    return this._resource;
}

isPending( ö_actionId ?:string ):boolean {
    if ( ö_actionId === undefined ) {
        return this._lockRequests.length > 0;
    }
    const ü_hit = this._lockRequests.find(function(ü_request){ return ü_request.id === ö_actionId; });
    return ü_hit !== undefined;
}

whenAvailable<R>( ö_actionId?:string ):Promise<IReleaseResource<R>> {
  //
    const ö_when = Date.now() - this._birthDate;
    ß_trc&& ß_trc( `Queueing ${ ö_actionId ?? '<???>' }@${ ö_when }` );
  //
    const ü_next = createPromise<T>();
    const ü_whenNotLocked = this._whenNotLocked;
                            this._whenNotLocked = ü_next.promise;
    const ö_resolveNotLocked                    = ü_next.resolve;
    const ö_releaseLock = ö_releaseLock_.bind( this );
    this._lockRequests.push(
        { when   : ö_when
        , id     : ö_actionId ?? ''
        , release: ö_releaseLock
        }
    );
  //
    return ü_whenNotLocked.then( ()=> ö_releaseLock );

function ö_releaseLock_( this:UniqueResource<T>                 ):void
function ö_releaseLock_( this:UniqueResource<T>, ...  err:any[] ):     Promise<R>
function ö_releaseLock_( this:UniqueResource<T>, ...ü_err:any[] ):void|Promise<R> {
    //
      if ( this._lockRequests.length > 0
        && this._lockRequests[0].release === ö_releaseLock
         ) {
          this._lockRequests.shift();
          ß_trc&& ß_trc( `Releasing ${ ö_actionId ?? '<???>' }@${ ö_when }` );
          ö_resolveNotLocked( this._resource );
      } else {
          ß_trc&& ß_trc( 'Second Invocation' );
      }
    //
      if ( ü_err.length > 0 ) { return Promise.reject<R>( ü_err[0] ); }
}
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

