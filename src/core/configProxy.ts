/*
*/
  import { type SpawnOptions
         } from 'child_process';
  import { type TINITIAL
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { SINITIAL
         } from '../constants/extension';
  import { EConfigurationIds
         } from '../constants/extension';
//--------------------------------------------------------------------
  import * as ßß_vsCode from 'vscode';
  import { ß_trc
         } from '../core/runtime';
  import { CommandHandler
         , ConfigHandler
         } from './implementation';
//====================================================================

class ConfigProxy {
    private readonly _wsConfig = ßß_vsCode.workspace.getConfiguration();
//
  get  executable            ():string       { return this._wsConfig.get( EConfigurationIds.executable            ) as any; }
  get  spawnOptions          ():SpawnOptions { return this._wsConfig.get( EConfigurationIds.spawnOptions          ) as any; }
  get  workingDirectory      ():string       { return this._wsConfig.get( EConfigurationIds.workingDirectory      ) as any; }
  get  decoupledExecution    ():boolean      { return this._wsConfig.get( EConfigurationIds.decoupledExecution    ) as any; }
  get  commandLineArguments  ():string[]     { return this._wsConfig.get( EConfigurationIds.commandLineArguments  ) as any; }
  get  multiInst             ():boolean      { return this._wsConfig.get( EConfigurationIds.multiInst             ) as any; }
  get  skipSessionHandling   ():string       { return this._wsConfig.get( EConfigurationIds.skipSessionHandling   ) as any; }
  get  openFolderAsWorkspace ():string       { return this._wsConfig.get( EConfigurationIds.openFolderAsWorkspace ) as any; }
  get  filesInFolderPattern  ():string       { return this._wsConfig.get( EConfigurationIds.filesInFolderPattern  ) as any; }
  get  matchingFilesLimit    ():number       { return this._wsConfig.get( EConfigurationIds.matchingFilesLimit    ) as any; }
  get  preserveCursor        ():boolean      { return this._wsConfig.get( EConfigurationIds.preserveCursor        ) as any; }
}

//--------------------------------------------------------------------

export class ConfigSnapshot extends ConfigProxy {
//
            static readonly CPrefix                          = 'openInNpp';
    private static         _current :ConfigSnapshot|TINITIAL = SINITIAL;
    private static         _touched                          = 1;
    private static         _executableTouched                = 0;
//
static modificationSignalled( this:undefined, ü_change:ßß_vsCode.ConfigurationChangeEvent ):void {
    const ü_that = ConfigSnapshot;
  //
    if ( ! ü_change.affectsConfiguration( ü_that.CPrefix ) ) { return; }
    if(ß_trc){ß_trc( `Configuration modified: "${ ü_that._touched }"` );}
    if ( ü_that._current === SINITIAL ) { return; } // _touched = 1
  //
    if ( ü_change.affectsConfiguration( EConfigurationIds.extendExplorerContextMenu )
      || ü_change.affectsConfiguration( EConfigurationIds.extendEditorContextMenu   )
      || ü_change.affectsConfiguration( EConfigurationIds.extendEditorTitleMenu     )
       ) { return; }
  //
                                                                           ü_that._touched           ++ ;
    if ( ü_change.affectsConfiguration( EConfigurationIds.executable ) ) { ü_that._executableTouched ++ ; }
  //
}
//
static get current():ConfigSnapshot {
    if ( this._touched > 0 ) {
         this._touched = 0 ;
    //
      const ü_current = new ConfigSnapshot( this._current, this._executableTouched > 0 );
      this._current           = ü_current;
      this._executableTouched = 0;
    }
  //
    return this._current as ConfigSnapshot;
}
//
    private          _whenWorkingDir    :Promise<string> | TINITIAL = SINITIAL;
    private          _whenExecutable    :Promise<string> | TINITIAL = SINITIAL;
    private          _executable        :        string  | TINITIAL = SINITIAL;
constructor(
                    ü_previous          :ConfigSnapshot  | TINITIAL
  , private readonly _executableTouched :boolean
){
    super();
  //
    if ( ü_previous !== SINITIAL ) {
      if ( this._executableTouched ) {
        if ( ü_previous.executable === this.executable ) {
          if(ß_trc){ß_trc( `Constant` );}
        }
      }
    }
}
//
async whenExecutable():Promise<string> {
      if ( this._executable === SINITIAL )
         { this._executable = await ConfigHandler.whenExecutable( super.executable, ! this._executableTouched );
         //this._whenExecutable.then( ü_executable => { this.executable = ü_executable; } );
         }
    return this._executable;
}

get whenWorkingDir():Promise<string> {
      if ( this._whenWorkingDir === SINITIAL )
         { this._whenWorkingDir = ConfigHandler.whenWorkingDir( super.workingDirectory ); }
    return this._whenWorkingDir;
}
//
}

//====================================================================
/*
*/