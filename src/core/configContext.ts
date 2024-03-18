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
         , TXtnConfigKeys
         , CPrefix
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { workspace
         , window
         , ConfigurationChangeEvent
         , ConfigurationTarget
         } from 'vscode';
  import { ß_trc
         , ß_toggleDevTrace
         } from '../runtime/context';
  import { UiXMessage
         } from '../lib/errorUtil';
  import { AsyncCalculation
         } from '../lib/asyncUtil';
  import { whenExecutable
         , whenKnownAsFolder
         , onNewExecutable
         , onNewWorkingDir
         , onNewVirtualDocsDir
         } from '../core/configUtil';
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
    for ( const ü_prop of [ 'executable'
                          , 'spawnOptions'
                          , 'workingDirectory'
                          , 'decoupledExecution'
                          , 'commandLineArguments'
                          , 'multiInst'
                          , 'skipSessionHandling'
                          , 'openFolderAsWorkspace'
                          , 'filesInFolderPattern'
                          , 'matchingFilesLimit'
                          , 'preserveCursor'
                          , 'developerTrace'
                          , 'virtualDocumentsDirectory'
                          , 'virtualDocumentsFileReuse'
                          ] as TXtnConfigKeys[] ) {
        Object.defineProperty( this, ü_prop, { enumerable:true, get: ()=>{ return this._vscConfig.get<any>( EConfigurationIds[ ü_prop ] ); } } );
    }
}
  //
set executable_( ü_executable:string ) {
    this._vscConfig.update( EConfigurationIds.executable, ü_executable, ConfigurationTarget.Workspace );
}
}

//--------------------------------------------------------------------

export class ConfigSnapshot extends ConfigProxy {
//static get api():ConfgContext { }
//
constructor(
    private          _whenExecutable     :AsyncCalculation<string>|null = null
  , private          _whenWorkingDir     :AsyncCalculation<string>|null = null
  , private          _whenVirtualDocsDir :AsyncCalculation<string>|null = null
){
    super();
}
//
get whenExecutable    ():PromiseLike<string> { return ( this._whenExecutable
                                                   || ( this._whenExecutable     = new AsyncCalculation( this.executable               , whenExecutable   .bind( null, true                           ) ) ) ).whenY; }
get whenWorkingDir    ():PromiseLike<string> { return ( this._whenWorkingDir
                                                   || ( this._whenWorkingDir     = new AsyncCalculation( this.workingDirectory         , whenKnownAsFolder.bind( null, 'Working Directory'            ) ) ) ).whenY; }
get whenVirtualDocsDir():PromiseLike<string> { return ( this._whenVirtualDocsDir
                                                   || ( this._whenVirtualDocsDir = new AsyncCalculation( this.virtualDocumentsDirectory, whenKnownAsFolder.bind( null, 'Virtual Documents Directory'  ) ) ) ).whenY; }
clone( ü_what ?:TXtnConfigKeys ):ConfigSnapshot {
    const ü_cfg = new ConfigSnapshot( this._whenExecutable
                                    , this._whenWorkingDir
                                    , this._whenVirtualDocsDir
                                    );
    switch ( ü_what ) {
        case 'executable'               : if ( ü_cfg._whenExecutable     !== null ) { ü_cfg._whenExecutable    .x = ü_cfg.executable               ; } break;
        case 'workingDirectory'         : if ( ü_cfg._whenWorkingDir     !== null ) { ü_cfg._whenWorkingDir    .x = ü_cfg.workingDirectory         ; } break;
        case 'virtualDocumentsDirectory': if ( ü_cfg._whenVirtualDocsDir !== null ) { ü_cfg._whenVirtualDocsDir.x = ü_cfg.virtualDocumentsDirectory; } break;
    }
    return ü_cfg;
}

}

//====================================================================
    let ß_cfgIsDirty  = true;
    let ß_whatIsDirty = undefined as TXtnConfigKeys|undefined;
    let ß_cfgSnapshot = undefined as unknown as ConfigSnapshot;
        ß_cfgSnapshot = getConfigSnapshot();
//====================================================================

export function getConfigSnapshot():ConfigSnapshot {
    if ( ß_cfgIsDirty ) {
         ß_cfgIsDirty = false;
    //ß_trc&& ß_trc( 'Dirty' );
        ß_cfgSnapshot = ß_cfgSnapshot?.clone( ß_whatIsDirty ) ?? new ConfigSnapshot();
    }
      return ß_cfgSnapshot;
}

//--------------------------------------------------------------------

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
    ß_cfgIsDirty = true;
    ß_whatIsDirty = undefined;
  //
           if ( ü_change.affectsConfiguration( EConfigurationIds.executable                ) ) { ß_whatIsDirty = 'executable'               ; onNewExecutable    ( getConfigSnapshot() );
    } else if ( ü_change.affectsConfiguration( EConfigurationIds.workingDirectory          ) ) { ß_whatIsDirty = 'workingDirectory'         ; onNewWorkingDir    ( getConfigSnapshot() );
    } else if ( ü_change.affectsConfiguration( EConfigurationIds.virtualDocumentsDirectory ) ) { ß_whatIsDirty = 'virtualDocumentsDirectory'; onNewVirtualDocsDir( getConfigSnapshot() );
    } else if ( ü_change.affectsConfiguration( EConfigurationIds.developerTrace            ) ) { ß_toggleDevTrace ();
    } else {
    }
  //
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