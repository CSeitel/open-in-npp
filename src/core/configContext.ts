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

export async function configModificationSignalled( ü_change:ConfigurationChangeEvent ):Promise<void> {
    if ( ! ü_change.affectsConfiguration( CPrefix ) ) { return; }
  //
    ß_trc&& ß_trc( `Event: Configuration changed` );
  //
    if ( ü_change.affectsConfiguration( EConfigurationIds.extendExplorerContextMenu )
      || ü_change.affectsConfiguration( EConfigurationIds.extendEditorContextMenu   )
      || ü_change.affectsConfiguration( EConfigurationIds.extendEditorTitleMenu     )
       ) { return; }
  //
    ß_cfgIsDirty  = true;
    ß_cfgSnapshot = getConfigSnapshot() ;
  //
    if ( ü_change.affectsConfiguration( EConfigurationIds.executable ) ) {
        ß_cfgSnapshot.resetExecutable();
        const ü_x =       ß_cfgSnapshot.executable     ;
        const ü_y = await ß_cfgSnapshot.whenExecutable ;
      //const ü_x = this._whenExecutable!.x;
        ß_trc&& ß_trc( `${ ü_y } from ${ ü_x }` );
    }
  //
}

export function getConfigSnapshot():ConfigSnapshot {
    if ( ß_cfgIsDirty ) {
         ß_cfgIsDirty = false;
    //ß_trc&& ß_trc( 'Dirty' );
        ß_cfgSnapshot = ß_cfgSnapshot?.clone() ?? new ConfigSnapshot();
    }
      return ß_cfgSnapshot;
}

//====================================================================

class ConfigProxy {
constructor(
    private _vscConfig = workspace.getConfiguration()
){
}
  //
    get  executable            ():string       { return this._vscConfig.get<any>( EConfigurationIds.executable            ); }
    get  spawnOptions          ():SpawnOptions { return this._vscConfig.get<any>( EConfigurationIds.spawnOptions          ); }
    get  workingDirectory      ():string       { return this._vscConfig.get<any>( EConfigurationIds.workingDirectory      ); }
    get  decoupledExecution    ():boolean      { return this._vscConfig.get<any>( EConfigurationIds.decoupledExecution    ); }
    get  commandLineArguments  ():string[]     { return this._vscConfig.get<any>( EConfigurationIds.commandLineArguments  ); }
    get  multiInst             ():boolean      { return this._vscConfig.get<any>( EConfigurationIds.multiInst             ); }
    get  skipSessionHandling   ():string       { return this._vscConfig.get<any>( EConfigurationIds.skipSessionHandling   ); }
    get  openFolderAsWorkspace ():string       { return this._vscConfig.get<any>( EConfigurationIds.openFolderAsWorkspace ); }
    get  filesInFolderPattern  ():string       { return this._vscConfig.get<any>( EConfigurationIds.filesInFolderPattern  ); }
    get  matchingFilesLimit    ():number       { return this._vscConfig.get<any>( EConfigurationIds.matchingFilesLimit    ); }
    get  preserveCursor        ():boolean      { return this._vscConfig.get<any>( EConfigurationIds.preserveCursor        ); }
  //
    set executable( ü_executable:string ) {
        this._vscConfig.update( EConfigurationIds.executable, ü_executable, ConfigurationTarget.Workspace );
    }
}

//====================================================================

export class ConfigSnapshot extends ConfigProxy {
//static get api():ConfgContext { }
constructor(
    protected        _whenExecutable :ValueCalcY<string>|null = null
  , protected        _whenWorkingDir :ValueCalcY<string>|null = null

){
    super();
}
//
get whenExecutable():PromiseLike<string> { return (   this._whenExecutable
                                                 || ( this._whenExecutable = new ValueCalcY( super.executable      , whenExecutable as unknown as TAsyncFunctionSingleArg<string> ) ) ).whenY; }
get whenWorkingDir():PromiseLike<string> { return (   this._whenWorkingDir
                                                 || ( this._whenWorkingDir = new ValueCalcY( super.workingDirectory, whenWorkingDir                                               ) ) ).whenY; }
resetExecutable():void {
         if ( this._whenExecutable !== null )
            { this._whenExecutable.x = super.executable; }

}

clone():ConfigSnapshot {
    return new ConfigSnapshot( this._whenExecutable, this._whenWorkingDir );
}

}

//--------------------------------------------------------------------
    let ß_cfgIsDirty  = true;
    let ß_cfgSnapshot = undefined as unknown as ConfigSnapshot
        ß_cfgSnapshot = getConfigSnapshot();
//====================================================================
/*
whenExecutable( ü_update = false ):PromiseLike<string> {
         if (              this._whenExecutable === null )
                         { this._whenExecutable   = new ValueCalcY( super.executable      , whenExecutable as unknown as TAsyncFunctionSingleArg<string> ); }
    else if ( ü_update ) { this._whenExecutable.x =                 super.executable; }
    return this._whenExecutable.whenY;
}
*/