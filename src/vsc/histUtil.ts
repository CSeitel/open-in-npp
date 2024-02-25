/*
*/
  import { type Memento
         , type ExtensionContext
         } from 'vscode';
  import { type IReleaseResource
         } from '../types/lib.asyncUtil.d';
  import { SINITIAL
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { UniqueResource
         } from '../lib/asyncUtil';
//====================================================================

export class MementoFacade<P extends string,T extends Record<P,object>> {
    private static   _uniqueSources:Record<string,UniqueResource<object>> = {};
  //
    private readonly _pendingCommits:PromiseLike<void>[] = [];
    private          _uniqueSrc :UniqueResource<T[P]> = SINITIAL as any;
  //private          _dataRef   :               T[P]  = SINITIAL as any;
    private readonly _dataApi   :Memento
constructor(
                    ü_vscXtnContext:ExtensionContext
  , public  readonly  mKey         :  P
  , private readonly _initialValue :T[P]
  ,                 ü_global = false
  ){
    this._dataApi = ü_vscXtnContext[ ü_global ?    'globalState'
                                              : 'workspaceState' ];
}

get dataRef():T[P] {
    return this._dataApi.get<T[P]>( this.mKey ) ?? this._initialValue;
}

set dataRef( ü_newData:T[P] ){
    this._pendingCommits.push( this._dataApi.update( this.mKey, ü_newData ) );
}

triggerCommit():void {
    this.dataRef = this.dataRef;
}

async whenCommitted():Promise<number> {
    if ( this._pendingCommits.length === 0 ) { this.triggerCommit(); }
  //
    const ü_whenDone = Promise.all( this._pendingCommits );
    this._pendingCommits.length = 0;
  //
    return ( await ü_whenDone ).length;
}

async whenDataRef<R>():Promise<IReleaseResource<R>> {
  //
    if ( this._uniqueSrc === SINITIAL as any ) {
         this._uniqueSrc = MementoFacade._uniqueSources[ this.mKey ] as UniqueResource<T[P]>
                      ?? ( MementoFacade._uniqueSources[ this.mKey ] = new UniqueResource( this.dataRef ) );
       }
    return this._uniqueSrc.whenAvailable<R>();
}

}

//====================================================================
/*
*/