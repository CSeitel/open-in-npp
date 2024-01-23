  import { type Memento
         } from 'vscode';
  import { type TINITIAL
         } from '../constants/extension';
//------------------------------------------------------------------------------
  import { SINITIAL
         } from '../constants/extension';
  import { ß_RuntimeContext
         , ß_trc
         } from '../extension';
  import { LockHandler
         } from '../lib/asyncUtil';
//==============================================================================
  const enum EHistStates {
    IDLE = 0
  , LOCKED
  , DIRTY
  }
//------------------------------------------------------------------------------
  type THistInitials<T> = {
    [P in keyof T] :() => T[P]
  }
  type THistBuffer<T> = {
    [P in keyof T] :T[P] | TINITIAL
  }
  type THistBufferState<T> = {
    [P in keyof T] :EHistStates
  }
//------------------------------------------------------------------------------
  type THistBufferLocks<T> = {
    [P in keyof T] ?:LockHandler<T,P>
  }
//------------------------------------------------------------------------------
interface IHistoryData {
    dummy :number[]
    admin :
      { version    :number
      }
    config:
      { executable :string
      }
}
//------------------------------------------------------------------------------
export class History implements IHistoryData {
//
//static get():History { return new History(); }
//
    private readonly _initials:THistInitials<IHistoryData> =
      { dummy  : () => []
      , admin  : () => { return { version   : 0  }; }
      , config : () => { return { executable: '' }; }
      };
    private readonly _buffer  :THistBuffer<IHistoryData> =
      { dummy  : SINITIAL
      , admin  : SINITIAL
      , config : SINITIAL
      };
    private readonly _state   :THistBufferState<IHistoryData> =
      { dummy  : EHistStates.IDLE
      , admin  : EHistStates.IDLE
      , config : EHistStates.IDLE
      };
    private          _locks   :THistBufferLocks<IHistoryData> =
      {
      };
    private readonly _dataApi:Memento
constructor(
    ü_global = true
){
    this._dataApi = ü_global
                  ? ß_RuntimeContext.activeInstance.context.globalState
                  : ß_RuntimeContext.activeInstance.context.workspaceState
                  ;
}

async whenCommitted( ü_mKey:keyof IHistoryData, ü_lazy = true ):Promise<boolean> {
    let ü_dirty = false;
  //
    switch ( this._state[ ü_mKey ] ) {

      case EHistStates.DIRTY:
        ü_dirty = true;
        this._state[ ü_mKey ] = EHistStates.IDLE;
        const ü_then = this._dataApi.update( ü_mKey, this._buffer[ ü_mKey ] );
        if ( ! ü_lazy ) { await ü_then; }
        if(ß_trc){ß_trc( `History updates committed for "${ ü_mKey }"` );}

      case EHistStates.LOCKED:
       const ü_lock = this._locks[ ü_mKey ];
       if ( ü_lock !== undefined )
          { ü_lock.release(); }
        if ( ü_dirty ) {
          return true ;
        }

      case EHistStates.IDLE:
          return false;

    }
}

release( ü_mKey:keyof IHistoryData ):boolean {
    switch ( this._state[ ü_mKey ] ) {

      case EHistStates.LOCKED:
        const ü_lock = this._locks[ ü_mKey ];
              ü_lock!.release();
        return true ;

      default:
        return false;

    }
}

private _getter<P extends keyof IHistoryData>( ü_mKey:P ):IHistoryData[P] {
    if ( this._buffer[ ü_mKey ] === SINITIAL ) {
                         const ü_data = this._dataApi.get<IHistoryData[P]>( ü_mKey );
      this._buffer[ ü_mKey ] = ü_data === undefined
                             ? this._initials[ ü_mKey ]() as IHistoryData[P]
                             : ü_data
                             ;
    }
      return this._buffer[ ü_mKey ] as IHistoryData[P];
  //
}

private _setter<P extends keyof IHistoryData>( ü_mKey:P, ü_data:IHistoryData[P] | TINITIAL ) {
    this._buffer[ ü_mKey ] = ü_data === SINITIAL
                           ? this._initials[ ü_mKey ]() as IHistoryData[P]
                           : ü_data
                           ;
    this._state[ ü_mKey ] = EHistStates.DIRTY;
}

private async _whenLocked<P extends keyof IHistoryData>( ü_mKey:P ):Promise<IHistoryData[P]> {
  //
    switch ( this._state[ ü_mKey ] as EHistStates ) {

      case EHistStates.IDLE:
             this._state[ ü_mKey ] = EHistStates.LOCKED;

      case EHistStates.DIRTY:
       const ü_old = this._locks[ ü_mKey ];
        if ( ü_old === undefined ) {
                            const ü_new = new LockHandler( ü_mKey, <IHistoryData> this );
          this._locks[ ü_mKey ] = ü_new as unknown as THistBufferLocks<IHistoryData>[P];
          return await   ü_new                                            .whenLocked();
        } else {
          return await ( ü_old as unknown as LockHandler<IHistoryData,P> ).whenLocked();
        }

      case EHistStates.LOCKED:
        {
                   const ü_old = this._locks[ ü_mKey ];
          return await ( ü_old as unknown as LockHandler<IHistoryData,P> ).whenLocked();
        }

    }
}

private async _whenObject<P extends keyof IHistoryData>( ü_mKey:P, ü_newData:Partial<IHistoryData[P]> | undefined, ü_noLock:boolean ):Promise<IHistoryData[P]> {
  //
    if ( ü_newData === undefined ) {
      if ( ü_noLock ) {
        console.error( `Wrong invocation` );
             return       this._getter    ( ü_mKey ); }
      else { return await this._whenLocked( ü_mKey ); }
    }
  //
    const ü_dataRef = ü_noLock
                    ?       this._getter    ( ü_mKey )
                    : await this._whenLocked( ü_mKey )
                    ;
  //
    try {
      for ( const ü_pKey in ü_newData ) {
      //const ü_a = ü_oldData[ ü_pKey as keyof IHistoryData[P] ]
      //const ü_b = ü_newData[ ü_pKey as keyof IHistoryData[P] ]
        if ( ( ü_dataRef[ ü_pKey as keyof IHistoryData[P] ] =
               ü_newData[ ü_pKey as keyof IHistoryData[P] ]! ) === undefined ) {
        delete ü_dataRef[ ü_pKey as keyof IHistoryData[P] ] ;
    
        }
      }
      //Object.assign( ü_oldData, ü_newData );
    //
      this._state[ ü_mKey ] = EHistStates.DIRTY;
      const ü_done = await this.whenCommitted( ü_mKey );
    //
    } catch ( ü_eX ) {
      console.error( ü_eX );
      if ( ! ü_noLock ) { this.release( ü_mKey ); }
      throw ü_eX;
    }
  //
    return ü_dataRef;
}

get       config ()          :        IHistoryData['config']   { return this._getter    ( 'config'           ); }
async whenConfig ( ü_config ?:Partial<IHistoryData['config']>  , ü_noLock = false )
                             :Promise<IHistoryData['config']>  { return this._whenObject( 'config', ü_config , ü_noLock ); }
get       admin  ()          :        IHistoryData['admin' ]   { return this._getter    ( 'admin'            ); }
async whenAdmin  ( ü_admin  ?:Partial<IHistoryData['admin' ]>  , ü_noLock = true  )
                             :Promise<IHistoryData['admin' ]>  { return this._whenObject( 'admin' , ü_admin  , ü_noLock ); }
get       dummy  ()          :        IHistoryData['dummy' ]   { return this._getter    ( 'dummy'            ); }
set       config ( ü_config  :        IHistoryData['config'] ) {        this._setter    ( 'config', ü_config ); }
set       admin  ( ü_admin   :        IHistoryData['admin' ] ) {        this._setter    ( 'admin' , ü_admin  ); }
set       dummy  ( ü_dummy   :        IHistoryData['dummy' ] ) {        this._setter    ( 'dummy' , ü_dummy  ); }

}

//==============================================================================
/*
*/
