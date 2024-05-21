/*
*/
  import { type SpawnOptions
         } from 'child_process';
  import { type TXtnCfgIds
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { CXtnCfgId
         , CXtnCfgIds
         , CXtnCfgPrefix
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { workspace
         , ConfigurationChangeEvent
         , ConfigurationTarget
         , WorkspaceConfiguration
         } from 'vscode';
  import { ß_trc
         , ß_toggleDevTrace
         } from '../runtime/context';
  import { LCConfig
         } from '../l10n/i18n';
  import { AsyncCalculation
         } from '../lib/asyncUtil';
  import { whenExecutable
         , whenKnownAsFolder
         , onPathChanged
         } from '../core/configUtil';
  import { hideProperty
         } from '../lib/objectUtil';
//====================================================================

class ConfigProxy {
              readonly  executable                = undefined as unknown as string       ;
              readonly  spawnOptions              = undefined as unknown as SpawnOptions ;
              readonly  workingDirectory          = undefined as unknown as string       ;
              readonly  decoupledExecution        = undefined as unknown as boolean      ;
              readonly  commandLineArguments      = undefined as unknown as string[]     ;
              readonly  multiInst                 = undefined as unknown as boolean      ;
              readonly  skipSessionHandling       = undefined as unknown as string       ;
              readonly  openFolderAsWorkspace     = undefined as unknown as string       ;
              readonly  filesInFolderPattern      = undefined as unknown as string       ;
              readonly  matchingFilesLimit        = undefined as unknown as number       ;
              readonly  preserveCursor            = undefined as unknown as boolean      ;
              readonly  developerTrace            = undefined as unknown as boolean      ;
              readonly  virtualDocumentsDirectory = undefined as unknown as string       ;
              readonly  virtualDocumentsFileReuse = undefined as unknown as boolean      ;
  //
constructor(
    private _vscConfig = workspace.getConfiguration()
){
    //ß_trc&& ß_trc( typeof( _vscConfig ), 'WWW' );
    hideProperty( this, '_vscConfig' as any );
  //hideProperty( this as any as {_vscConfig:1}, '_vscConfig' );
    //configurable: true value: 42,
    for ( const ü_cfgId of CXtnCfgIds ) {
        Object.defineProperty( this, ü_cfgId, { enumerable:true, get: ()=>{ return this._vscConfig.get<any>( CXtnCfgId[ ü_cfgId ] ); } } );
    }
}
  //
set executable_( ü_executable:string ) {
    this._vscConfig.update( CXtnCfgId.executable, ü_executable, ConfigurationTarget.Workspace );
}
}

//--------------------------------------------------------------------

export class ConfigSnapshot extends ConfigProxy {
//static get api():ConfgContext { }
//
constructor(
    private          _whenExecutable     = new AsyncCalculation( whenExecutable   .bind( null, true                      ) )
  , private          _whenWorkingDir     = new AsyncCalculation( whenKnownAsFolder.bind( null, LCConfig.workingDir_N     ) )
  , private          _whenVirtualDocsDir = new AsyncCalculation( whenKnownAsFolder.bind( null, LCConfig.virtualDocsDir_N ) )
){
    super();
    hideProperty( this, '_whenExecutable'     as any );
    hideProperty( this, '_whenWorkingDir'     as any );
    hideProperty( this, '_whenVirtualDocsDir' as any );
}
//
get whenExecutable    ():PromiseLike<string> { this._whenExecutable    .x = this.executable               ; return this._whenExecutable    .whenY; }
get whenWorkingDir    ():PromiseLike<string> { this._whenWorkingDir    .x = this.workingDirectory         ; return this._whenWorkingDir    .whenY; }
get whenVirtualDocsDir():PromiseLike<string> { this._whenVirtualDocsDir.x = this.virtualDocumentsDirectory; return this._whenVirtualDocsDir.whenY; }

clone( ü_what ?:TXtnCfgIds ):ConfigSnapshot {
    const ü_cfg = new ConfigSnapshot( this._whenExecutable
                                    , this._whenWorkingDir
                                    , this._whenVirtualDocsDir
                                    );
    return ü_cfg;
    switch ( ü_what ) {
        case 'executable'               :
        case 'workingDirectory'         :
        case 'virtualDocumentsDirectory':
    }
    return ü_cfg;
}
}

//====================================================================

export class ConfigHandler {
    private _cfgSnapshot = new ConfigSnapshot();
    private _cfgIsDirty  = true;
    private _whatIsDirty = undefined as TXtnCfgIds|undefined;
constructor(){
    this._cfgSnapshot.developerTrace || ß_toggleDevTrace(); // adjust hard-coded initial value 'true' to config-setting if necessary
}
get configSnapshot():ConfigSnapshot {
    if ( this._cfgIsDirty ) {
         this._cfgIsDirty = false;
        ß_trc&& ß_trc( 'Is dirty', 'ConfigSnapshot' );
        this._cfgSnapshot = this._cfgSnapshot.clone( this._whatIsDirty );
    }
      return this._cfgSnapshot;
}

configModificationSignalled( ü_change:ConfigurationChangeEvent ):void {
    if ( ! ü_change.affectsConfiguration( CXtnCfgPrefix ) ) { return; }
  //
    ß_trc&& ß_trc( `Event: Configuration changed`, 'Configuration' );
  //
    if ( ü_change.affectsConfiguration( CXtnCfgId.extendExplorerContextMenu )
      || ü_change.affectsConfiguration( CXtnCfgId.extendEditorContextMenu   )
      || ü_change.affectsConfiguration( CXtnCfgId.extendEditorTitleMenu     )
       ) { return; }
  //
    this._cfgIsDirty  = true;
    this._whatIsDirty = undefined;
  //
           if ( ü_change.affectsConfiguration( CXtnCfgId.executable                ) ) { this._whatIsDirty = 'executable'               ; onPathChanged( this.configSnapshot.whenExecutable    , LCConfig.executable_Y     );
    } else if ( ü_change.affectsConfiguration( CXtnCfgId.workingDirectory          ) ) { this._whatIsDirty = 'workingDirectory'         ; onPathChanged( this.configSnapshot.whenWorkingDir    , LCConfig.workingDir_Y     );
    } else if ( ü_change.affectsConfiguration( CXtnCfgId.virtualDocumentsDirectory ) ) { this._whatIsDirty = 'virtualDocumentsDirectory'; onPathChanged( this.configSnapshot.whenVirtualDocsDir, LCConfig.virtualDocsDir_Y );
    } else if ( ü_change.affectsConfiguration( CXtnCfgId.developerTrace            ) ) { ß_toggleDevTrace ();
    } else {
    }
  //
}

}

/*
//====================================================================
    let ß_cfgIsDirty  = true;
    let ß_whatIsDirty = undefined as TXtnCfgIds|undefined;
    let ß_cfgSnapshot = undefined as unknown as ConfigSnapshot;
        ß_cfgSnapshot = getConfigSnapshot();
//====================================================================

 function getConfigSnapshot():ConfigSnapshot {
    if ( ß_cfgIsDirty ) {
         ß_cfgIsDirty = false;
        ß_trc&& ß_trc( 'Is dirty', 'ConfigSnapshot' );
        ß_cfgSnapshot = ß_cfgSnapshot?.clone( ß_whatIsDirty ) ?? new ConfigSnapshot();
    }
      return ß_cfgSnapshot;
}

//--------------------------------------------------------------------

 function configModificationSignalled( ü_change:ConfigurationChangeEvent ):void {
    if ( ! ü_change.affectsConfiguration( CXtnCfgPrefix ) ) { return; }
  //
    ß_trc&& ß_trc( `Event: Configuration changed`, 'Configuration' );
  //
    if ( ü_change.affectsConfiguration( CXtnCfgId.extendExplorerContextMenu )
      || ü_change.affectsConfiguration( CXtnCfgId.extendEditorContextMenu   )
      || ü_change.affectsConfiguration( CXtnCfgId.extendEditorTitleMenu     )
       ) { return; }
  //
    ß_cfgIsDirty = true;
    ß_whatIsDirty = undefined;
  //
           if ( ü_change.affectsConfiguration( CXtnCfgId.executable                ) ) { ß_whatIsDirty = 'executable'               ; onPathChanged( getConfigSnapshot().whenExecutable    , LCConfig.executable_Y     );
    } else if ( ü_change.affectsConfiguration( CXtnCfgId.workingDirectory          ) ) { ß_whatIsDirty = 'workingDirectory'         ; onPathChanged( getConfigSnapshot().whenWorkingDir    , LCConfig.workingDir_Y     );
    } else if ( ü_change.affectsConfiguration( CXtnCfgId.virtualDocumentsDirectory ) ) { ß_whatIsDirty = 'virtualDocumentsDirectory'; onPathChanged( getConfigSnapshot().whenVirtualDocsDir, LCConfig.virtualDocsDir_Y );
    } else if ( ü_change.affectsConfiguration( CXtnCfgId.developerTrace            ) ) { ß_toggleDevTrace ();
    } else {
    }
  //
}

//====================================================================
*/