/*
*/
  import { type SpawnOptions
         } from 'child_process';
  import { type TAsyncFunctionSingleArg
         } from '../types/generic.d';
  import { type TINITIAL
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { SINITIAL
         , EConfigurationIds
         , CPrefix
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { workspace
         , ConfigurationChangeEvent
         , ConfigurationTarget
         } from 'vscode';
  import { ß_trc
         } from '../runtime/context';
  import { ValueCalcY
         } from '../lib/asyncUtil';
  import { whenExecutable
         , whenWorkingDir
         , whenExecutableChecked
         } from '../core/configHandler';

//====================================================================

class ConfigProxy {
    private _wsConfig = workspace.getConfiguration();
  //
    get  executable            ():string       { return this._wsConfig.get<any>( EConfigurationIds.executable            ); }
    get  spawnOptions          ():SpawnOptions { return this._wsConfig.get<any>( EConfigurationIds.spawnOptions          ); }
    get  workingDirectory      ():string       { return this._wsConfig.get<any>( EConfigurationIds.workingDirectory      ); }
    get  decoupledExecution    ():boolean      { return this._wsConfig.get<any>( EConfigurationIds.decoupledExecution    ); }
    get  commandLineArguments  ():string[]     { return this._wsConfig.get<any>( EConfigurationIds.commandLineArguments  ); }
    get  multiInst             ():boolean      { return this._wsConfig.get<any>( EConfigurationIds.multiInst             ); }
    get  skipSessionHandling   ():string       { return this._wsConfig.get<any>( EConfigurationIds.skipSessionHandling   ); }
    get  openFolderAsWorkspace ():string       { return this._wsConfig.get<any>( EConfigurationIds.openFolderAsWorkspace ); }
    get  filesInFolderPattern  ():string       { return this._wsConfig.get<any>( EConfigurationIds.filesInFolderPattern  ); }
    get  matchingFilesLimit    ():number       { return this._wsConfig.get<any>( EConfigurationIds.matchingFilesLimit    ); }
    get  preserveCursor        ():boolean      { return this._wsConfig.get<any>( EConfigurationIds.preserveCursor        ); }
  //
    set executable( ü_executable:string ) {
        this._wsConfig.update( EConfigurationIds.executable, ü_executable, ConfigurationTarget.Workspace );
    }
protected _update():void {
              this._wsConfig = workspace.getConfiguration();
}

}

//--------------------------------------------------------------------

export class ConfigContext extends ConfigProxy {
  public  static api = new ConfigContext();
//static get api():ConfgContext { }
    private          _whenExecutable :ValueCalcY<string>|null = null;
    private          _whenWorkingDir :ValueCalcY<string>|null = null;
            readonly  modificationSignalled = this._modificationSignalled.bind( this );
private constructor(){
    super();
}
//
get whenExecutable():PromiseLike<string> { return (   this._whenExecutable
                                                 || ( this._whenExecutable = new ValueCalcY( super.executable      , whenExecutable as unknown as TAsyncFunctionSingleArg<string> ) ) ).whenY; }
get whenWorkingDir():PromiseLike<string> { return (   this._whenWorkingDir
                                                 || ( this._whenWorkingDir = new ValueCalcY( super.workingDirectory, whenWorkingDir                                               ) ) ).whenY; }
//
private async _modificationSignalled( ü_change:ConfigurationChangeEvent ):Promise<void> {
    if ( ! ü_change.affectsConfiguration( CPrefix ) ) { return; }
  //
    ß_trc&& ß_trc( `Event: Configuration changed` );
  //
    if ( ü_change.affectsConfiguration( EConfigurationIds.extendExplorerContextMenu )
      || ü_change.affectsConfiguration( EConfigurationIds.extendEditorContextMenu   )
      || ü_change.affectsConfiguration( EConfigurationIds.extendEditorTitleMenu     )
       ) { return; }
  //
    this._update();
  //
    if ( ü_change.affectsConfiguration( EConfigurationIds.executable ) ) {
         if ( this._whenExecutable !== null )
            { this._whenExecutable.x = super.executable; }
        const ü_x = this.executable;
        const ü_y = await this.whenExecutable;
      //const ü_x = this._whenExecutable!.x;
        ß_trc&& ß_trc( `${ ü_y } from ${ ü_x }` );
    }
  //
}
}

//====================================================================
/*
whenExecutable( ü_update = false ):PromiseLike<string> {
         if (              this._whenExecutable === null )
                         { this._whenExecutable   = new ValueCalcY( super.executable      , whenExecutable as unknown as TAsyncFunctionSingleArg<string> ); }
    else if ( ü_update ) { this._whenExecutable.x =                 super.executable; }
    return this._whenExecutable.whenY;
}
*/