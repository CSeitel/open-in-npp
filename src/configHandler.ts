/*
*/
  import { SpawnOptions
         } from 'child_process';
  import * as ßß_vsCode from 'vscode';
//------------------------------------------------------------------------------
  import { runtime
         } from './extension';
  import { expandEnvVariables
         , isExe
         } from "./lib/any";
  import {
         } from './implementation';
  const ß_trc = runtime.trace;
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

export function handleModification( ü_change:ßß_vsCode.ConfigurationChangeEvent ):void {
    if (   ü_change.affectsConfiguration( EConfigurationIds.prefix                    ) ) {
      if ( ü_change.affectsConfiguration( EConfigurationIds.extendEditorContextMenu   )
        || ü_change.affectsConfiguration( EConfigurationIds.extendExplorerContextMenu )
         ) { return; }
      const ü_exe = ü_change.affectsConfiguration( EConfigurationIds.executable )
      ConfigSnapshot.modificationSignalled( ü_exe );
    }
}

//==============================================================================

class ConfigProxy {
//
constructor(
    private readonly _wsConfig:ßß_vsCode.WorkspaceConfiguration
) {}

protected get _executable            () { return this._wsConfig.get<string>       ( EConfigurationIds.executable            )!; }
protected get _spawnOptions          () { return this._wsConfig.get<SpawnOptions> ( EConfigurationIds.spawnOptions          )!; }
protected get _workingDirectory      () { return this._wsConfig.get<string>       ( EConfigurationIds.workingDirectory      )!; }
protected get _decoupledExecution    () { return this._wsConfig.get<boolean>      ( EConfigurationIds.decoupledExecution    )!; }
protected get _commandLineArguments  () { return this._wsConfig.get<string[]>     ( EConfigurationIds.commandLineArguments  )!; }
protected get _multiInst             () { return this._wsConfig.get<boolean>      ( EConfigurationIds.multiInst             )!; }
protected get _skipSessionHandling   () { return this._wsConfig.get<string>       ( EConfigurationIds.skipSessionHandling   )!; }
protected get _openFolderAsWorkspace () { return this._wsConfig.get<string>       ( EConfigurationIds.openFolderAsWorkspace )!; }
protected get _filesInFolderPattern  () { return this._wsConfig.get<string>       ( EConfigurationIds.filesInFolderPattern  )!; }
protected get _preserveCursor        () { return this._wsConfig.get<boolean>      ( EConfigurationIds.preserveCursor        )!; }

}

//==============================================================================

export class ConfigSnapshot extends ConfigProxy {
//
    private static _current:ConfigSnapshot | null = null;
//
static modificationSignalled( ü_executable:boolean ) {
    if ( this._current === null ) { return; }
         this._current  =  null;
    if ( ü_executable ) {
      if(ß_trc){ß_trc( EConfigurationIds.executable );}
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
    readonly spawnOptions          = super._spawnOptions          ;
    readonly workingDirectory      = expandEnvVariables( super._workingDirectory );
    readonly decoupledExecution    = super._decoupledExecution    ;
    readonly commandLineArguments  = super._commandLineArguments  ;
    readonly multiInst             = super._multiInst             ;
    readonly skipSessionHandling   = super._skipSessionHandling   ;
    readonly openFolderAsWorkspace = super._openFolderAsWorkspace ;
    readonly filesInFolderPattern  = super._filesInFolderPattern  ;
    readonly preserveCursor        = super._preserveCursor        ;
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