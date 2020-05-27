/*
*/
  import { SpawnOptions
         } from 'child_process';
  import * as ßß_vsCode from 'vscode';
//------------------------------------------------------------------------------
  import { expandEnvVariables
         , isExe
         } from "./lib/any";
  import {
         } from './implementation';
//------------------------------------------------------------------------------
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
    private readonly _configApi = ßß_vsCode.workspace.getConfiguration();

protected get _executable            ():string       { return this._configApi.get<string>       ( EConfigurationIds.executable            )!; }
protected get _spawnOptions          ():SpawnOptions { return this._configApi.get<SpawnOptions> ( EConfigurationIds.spawnOptions          )!; }
protected get _workingDirectory      ():string       { return this._configApi.get<string>       ( EConfigurationIds.workingDirectory      )!; }
protected get _decoupledExecution    ():boolean      { return this._configApi.get<boolean>      ( EConfigurationIds.decoupledExecution    )!; }
protected get _commandLineArguments  ():string[]     { return this._configApi.get<string[]>     ( EConfigurationIds.commandLineArguments  )!; }
protected get _multiInst             ():boolean      { return this._configApi.get<boolean>      ( EConfigurationIds.multiInst             )!; }
protected get _skipSessionHandling   ():string       { return this._configApi.get<string>       ( EConfigurationIds.skipSessionHandling   )!; }

protected get _openFolderAsWorkspace ():string       { return this._configApi.get<string>       ( EConfigurationIds.openFolderAsWorkspace )!; }
protected get _filesInFolderPattern  ():string       { return this._configApi.get<string>       ( EConfigurationIds.filesInFolderPattern  )!; }
protected get _preserveCursor        ():boolean      { return this._configApi.get<boolean>      ( EConfigurationIds.preserveCursor        )!; }

}

export class ConfigSnapshot extends ConfigProxy {
    private static _parsed:ConfigSnapshot | null = null;
//
static modificationSignalled( ü_executable:boolean ) {
    if ( this._parsed === null ) { return; }
         this._parsed  =  null;
    if ( ü_executable ) { console.log( 'Bla' );
    }
}
static async getCurrent():Promise<ConfigSnapshot> {
    if ( this._parsed === null ) {
         this._parsed = await ( new ConfigSnapshot() )._parse();
    }
    return this._parsed;
}
  //
             executable            = expandEnvVariables( super._executable       );
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
             lineNumber   = -1;
             columnNumber = -1;
//
private async _parse():Promise<ConfigSnapshot> {
    if ( this.executable.length === 0 ) { // default
         this.executable = await ß_defaultNppExe();
    } else {
  //    if ( ! await isExe( ü_config.executable ) ) {
  //  throw new Error( ßß_i18n( ßß_text.exe_not_found, ü_exeName ) );
    }
    return this;
}
//
}

//==============================================================================

async function ß_defaultNppExe():Promise<string> {
/*
    const ü_a = process.env.ProgramFiles;
    const ü_b = process.env.aaaa;
    console.log( ü_a, ü_b );
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
https://medium.com/@SylvainPV/type-safety-in-javascript-using-es6-proxies-eee8fbbbd600
*/