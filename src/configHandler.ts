/*
*/
  import { SpawnOptions
         } from 'child_process';
  import * as ßß_vsCode from 'vscode';
//------------------------------------------------------------------------------
  import   ExtensionRuntime
           from './extension';
  const ß_trc = ExtensionRuntime.developerTrace;
//------------------------------------------------------------------------------
  import { expandEnvVariables
         , isExe
         } from "./lib/any";
  import {
         } from './implementation';
//------------------------------------------------------------------------------
export const enum EConfigurationIds
    { prefix                    = 'openInNpp'
    , extendEditorContextMenu   = 'openInNpp.extendEditorContextMenu'
    , extendExplorerContextMenu = 'openInNpp.extendExplorerContextMenu'
  //
    , executable                = 'openInNpp.Executable'
    , spawnOptions              = 'openInNpp.spawnOptions'
    , workingDirectory          = 'openInNpp.workingDirectory'
    , decoupledExecution        = 'openInNpp.decoupledExecution'
    , commandLineArguments      = 'openInNpp.commandLineArguments'
    , multiInst                 = 'openInNpp.multiInst'
    , skipSessionHandling       = 'openInNpp.skipSessionHandling'
  //
    , openFolderAsWorkspace     = 'openInNpp.openFolderAsWorkspace'
    , filesInFolderPattern      = 'openInNpp.filesInFolderPattern'
    , preserveCursor            = 'openInNpp.preserveCursorPosition'
    };
//------------------------------------------------------------------------------
  const enum EExecutables
    { x64_64bit  =          "%ProgramFiles%\\Notepad++\\notepad++.exe"
    , x64_64bit_ =       "C:\\Program Files\\Notepad++\\notepad++.exe"
    , x86_32bit  =      "%PrograFiles(x86)%\\Notepad++\\notepad++.exe"
    , x86_32bit_ = "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
    , path_env   =                                     "notepad++.exe"
    };
//==============================================================================

class ConfigProxy {
//
constructor(
    private readonly _wsConfig:ßß_vsCode.WorkspaceConfiguration
){}

  get _executable            ():string       { return this._wsConfig.get( EConfigurationIds.executable            ) as any; }
  get  spawnOptions          ():SpawnOptions { return this._wsConfig.get( EConfigurationIds.spawnOptions          ) as any; }
  get _workingDirectory      ():string       { return this._wsConfig.get( EConfigurationIds.workingDirectory      ) as any; }
  get  decoupledExecution    ():boolean      { return this._wsConfig.get( EConfigurationIds.decoupledExecution    ) as any; }
  get  commandLineArguments  ():string[]     { return this._wsConfig.get( EConfigurationIds.commandLineArguments  ) as any; }
  get  multiInst             ():boolean      { return this._wsConfig.get( EConfigurationIds.multiInst             ) as any; }
  get  skipSessionHandling   ():string       { return this._wsConfig.get( EConfigurationIds.skipSessionHandling   ) as any; }
  get  openFolderAsWorkspace ():string       { return this._wsConfig.get( EConfigurationIds.openFolderAsWorkspace ) as any; }
  get  filesInFolderPattern  ():string       { return this._wsConfig.get( EConfigurationIds.filesInFolderPattern  ) as any; }
  get  preserveCursor        ():boolean      { return this._wsConfig.get( EConfigurationIds.preserveCursor        ) as any; }

}

//==============================================================================

export class ConfigSnapshot extends ConfigProxy {
//
    private static _current:ConfigSnapshot | null = null;
//
static modificationSignalled( this:undefined, ü_change:ßß_vsCode.ConfigurationChangeEvent ):void {
    if ( ConfigSnapshot._current === null ) { return; }
    if (   ü_change.affectsConfiguration( EConfigurationIds.prefix                    ) ) {
      if ( ü_change.affectsConfiguration( EConfigurationIds.extendEditorContextMenu   )
        || ü_change.affectsConfiguration( EConfigurationIds.extendExplorerContextMenu )
         ) { return; }
      const ü_exe
         = ü_change.affectsConfiguration( EConfigurationIds.executable )
         ConfigSnapshot._current  =  null;
      if ( ü_exe ) {
        if(ß_trc){ß_trc( EConfigurationIds.executable );}
      }
    }
}
//
static get current():ConfigSnapshot {
    if ( this._current === null ) {
         this._current = new ConfigSnapshot( ßß_vsCode.workspace.getConfiguration() );
    }
    return this._current;
}
//
             executable?:string
    readonly whenExecutable        = this._whenPrepared( expandEnvVariables( super._executable ) );
    readonly workingDirectory      = expandEnvVariables( super._workingDirectory );
//
private async _whenPrepared( ü_exe:string ):Promise<string> {
    this.executable = ü_exe.length === 0 // default
                    ? await ß_defaultNppExe()
                    : ü_exe
                    ;
    return this.executable;
}
//
}

//==============================================================================

async function ß_defaultNppExe():Promise<string> {
/*
    const ü_a = process.env.ProgramFiles;
    const ü_b = process.env.aaaa;
    ( ü_a, ü_b );
*/
    let ü_exe:string
    if ( await isExe( ü_exe = expandEnvVariables( EExecutables.x64_64bit  ) ) ) { return ü_exe; }
    if ( await isExe( ü_exe = expandEnvVariables( EExecutables.x86_32bit  ) ) ) { return ü_exe; }
    if ( await isExe(                             EExecutables.x64_64bit_   ) ) { return EExecutables.x64_64bit_; }
    if ( await isExe(                             EExecutables.x86_32bit    ) ) { return EExecutables.x86_32bit ; }
                                                                                  return EExecutables.path_env  ;
}

//------------------------------------------------------------------------------
/*
*/