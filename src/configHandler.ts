/*
*/
  import * as ßß_vsCode from 'vscode';
//------------------------------------------------------------------------------
  import { expandEnvVariables
         , isExe
         } from "./lib/any";
  import {
         } from './implementation';
//------------------------------------------------------------------------------
  const enum EConfigurationIds
    { executable            = 'openInNpp.Executable'
    , detachProcess         = 'openInNpp.detachProcess'
    , workingDirectory      = 'openInNpp.workingDirectory'
    , commandLineArguments  = 'openInNpp.commandLineArguments'
    , multiInst             = 'openInNpp.multiInst'
    , preserveCursor        = 'openInNpp.preserveCursorPosition'
    , filesInFolderPattern  = 'openInNpp.filesInFolderPattern'
    , skipSessionHandling   = 'openInNpp.skipSessionHandling'
    , openFolderAsWorkspace = 'openInNpp.openFolderAsWorkspace'
    };
  const enum EExecutables
    { x86_32bit = "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
    , x64_64bit = "C:\\Program Files\\Notepad++\\notepad++.exe"
    , path_env  = "notepad++.exe"
    };
//==============================================================================

class ConfigProxy {
    private readonly _configApi = ßß_vsCode.workspace.getConfiguration();

protected get _executable            ():string   { return this._configApi.get<string>       ( EConfigurationIds.executable            )!; }
protected get _detachProcess         ():boolean  { return this._configApi.get<boolean>      ( EConfigurationIds.detachProcess         )!; }
protected get _workingDirectory      ():string   { return this._configApi.get<string>       ( EConfigurationIds.workingDirectory      )!; }
protected get _commandLineArguments  ():string[] { return this._configApi.get<Array<string>>( EConfigurationIds.commandLineArguments  )!; }
protected get _multiInst             ():boolean  { return this._configApi.get<boolean>      ( EConfigurationIds.multiInst             )!; }
protected get _preserveCursor        ():boolean  { return this._configApi.get<boolean>      ( EConfigurationIds.preserveCursor        )!; }
protected get _filesInFolderPattern  ():string   { return this._configApi.get<string>       ( EConfigurationIds.filesInFolderPattern  )!; }
protected get _skipSessionHandling   ():string   { return this._configApi.get<string>       ( EConfigurationIds.skipSessionHandling   )!; }
protected get _openFolderAsWorkspace ():string   { return this._configApi.get<string>       ( EConfigurationIds.openFolderAsWorkspace )!; }

}

export class ConfigSnapshot extends ConfigProxy {
static async getInstance():Promise<ConfigSnapshot> {
    return new ConfigSnapshot().parseConfig();
}
  //
             executable            = expandEnvVariables( super._executable       );
    readonly detachProcess         = super._detachProcess         ;
             workingDirectory      = expandEnvVariables( super._workingDirectory );
    readonly commandLineArguments  = super._commandLineArguments  ;
    readonly multiInst             = super._multiInst             ;
    readonly preserveCursor        = super._preserveCursor        ;
    readonly filesInFolderPattern  = super._filesInFolderPattern  ;
    readonly skipSessionHandling   = super._skipSessionHandling   ;
    readonly openFolderAsWorkspace = super._openFolderAsWorkspace ;
  //
             lineNumber   = -1;
             columnNumber = -1;
//
async parseConfig():Promise<ConfigSnapshot> {
    if ( this.executable.length === 0 ) { // default
         this.executable = await defaultNppExecutable();
    } else {
  //    if ( ! await isExe( ü_config.executable ) ) {
  //  throw new Error( ßß_i18n( ßß_text.exe_not_found, ü_exeName ) );
    }
    return this;
}
//
}

//==============================================================================

export async function defaultNppExecutable():Promise<string> {
         if ( await isExe( EExecutables.x64_64bit ) ) { return EExecutables.x64_64bit; }
    else if ( await isExe( EExecutables.x86_32bit ) ) { return EExecutables.x86_32bit; }
    else                                              { return EExecutables.path_env ; }
}

//------------------------------------------------------------------------------