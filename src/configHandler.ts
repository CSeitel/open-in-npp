/*
*/
  import * as ßß_vsCode from 'vscode';
//------------------------------------------------------------------------------
  import { expandEnvVariables
         } from "./lib/any";
  import { defaultNppExecutable
         } from './implementation';
//------------------------------------------------------------------------------
  const enum EConfigurationIds
    { executable           = 'openInNpp.Executable'
    , workingDirectory     = 'openInNpp.workingDirectory'
    , multiInst            = 'openInNpp.multiInst'
    , preserveCursor       = 'openInNpp.preserveCursorPosition'
    , commandLineArguments = 'openInNpp.commandLineArguments'
    , filesInFolderPattern = 'openInNpp.filesInFolderPattern'
    };
//==============================================================================

class ConfigProxy {
    private readonly _configApi = ßß_vsCode.workspace.getConfiguration();

protected get _executable          ():string   { return this._configApi.get<string>       ( EConfigurationIds.executable           )!; }
protected get _multiInst           ():boolean  { return this._configApi.get<boolean>      ( EConfigurationIds.multiInst            )!; }
protected get _preserveCursor      ():boolean  { return this._configApi.get<boolean>      ( EConfigurationIds.preserveCursor       )!; }
protected get _commandLineArguments():string[] { return this._configApi.get<Array<string>>( EConfigurationIds.commandLineArguments )!; }
protected get _filesInFolderPattern():string   { return this._configApi.get<string>       ( EConfigurationIds.filesInFolderPattern )!; }
protected get _workingDirectory    ():string   { return this._configApi.get<string>       ( EConfigurationIds.workingDirectory     )!; }

}

export class ConfigSnapshot extends ConfigProxy {
static async getInstance():Promise<ConfigSnapshot> {
    return new ConfigSnapshot().parseConfig();
}
  //
             executable           = expandEnvVariables( super._executable       );
             workingDirectory     = expandEnvVariables( super._workingDirectory );
    readonly multiInst            = super._multiInst        ;
    readonly preserveCursor       = super._preserveCursor   ;
    readonly commandLineArguments = super._commandLineArguments ;
    readonly filesInFolderPattern          = super._filesInFolderPattern    ;
    readonly detached             = true;
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