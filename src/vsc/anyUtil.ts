/*
*/
  import { type Disposable
         } from 'vscode';
  import { workspace
         , ConfigurationTarget
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_RuntimeContext
         , ß_trc
         } from '../runtime/context';
//====================================================================
//update(section: string, value: any, configurationTarget?: ConfigurationTarget | boolean | null, overrideInLanguage?: boolean): Thenable<void>;

export function setConfig<T=any>( ü_cfgId:string, ü_value:T ):Thenable<void> {
    return workspace.getConfiguration().update( ü_cfgId, ü_value, ConfigurationTarget.Workspace );
}

//====================================================================

export abstract class RootDisposable implements Disposable {
    private            _isDisposed_eX :Error|null   = null;
    protected readonly _disposables   :Disposable[] = [];

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

//====================================================================
/*
*/