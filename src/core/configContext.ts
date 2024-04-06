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
    private          _whenExecutable     :AsyncCalculation<string>|null = null
  , private          _whenWorkingDir     :AsyncCalculation<string>|null = null
  , private          _whenVirtualDocsDir :AsyncCalculation<string>|null = null
){
    super();
}
//
get whenExecutable    ():PromiseLike<string> { return ( this._whenExecutable
                                                   || ( this._whenExecutable     = new AsyncCalculation( this.executable               , whenExecutable   .bind( null, true                      ) ) ) ).whenY; }
get whenWorkingDir    ():PromiseLike<string> { return ( this._whenWorkingDir
                                                   || ( this._whenWorkingDir     = new AsyncCalculation( this.workingDirectory         , whenKnownAsFolder.bind( null, LCConfig.workingDir_N     ) ) ) ).whenY; }
get whenVirtualDocsDir():PromiseLike<string> { return ( this._whenVirtualDocsDir
                                                   || ( this._whenVirtualDocsDir = new AsyncCalculation( this.virtualDocumentsDirectory, whenKnownAsFolder.bind( null, LCConfig.virtualDocsDir_N ) ) ) ).whenY; }
clone( ü_what ?:TXtnCfgIds ):ConfigSnapshot {
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
    let ß_whatIsDirty = undefined as TXtnCfgIds|undefined;
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
           if ( ü_change.affectsConfiguration( CXtnCfgId.executable                ) ) { ß_whatIsDirty = 'executable'               ; onNewExecutable    ( getConfigSnapshot() );
    } else if ( ü_change.affectsConfiguration( CXtnCfgId.workingDirectory          ) ) { ß_whatIsDirty = 'workingDirectory'         ; onNewWorkingDir    ( getConfigSnapshot() );
    } else if ( ü_change.affectsConfiguration( CXtnCfgId.virtualDocumentsDirectory ) ) { ß_whatIsDirty = 'virtualDocumentsDirectory'; onNewVirtualDocsDir( getConfigSnapshot() );
    } else if ( ü_change.affectsConfiguration( CXtnCfgId.developerTrace            ) ) { ß_toggleDevTrace ();
    } else {
    }
  //
}

//====================================================================
/*
*/