/*
*/
  import * as ßß_vsCode from 'vscode';
//------------------------------------------------------------------------------
  import { defaultNppExecutable
         } from './implementation';
//------------------------------------------------------------------------------
  const enum EConfigurationIds
    { executable    = 'openInNpp.Executable'
    , multiInst     = 'openInNpp.multiInst'
    , preserveCursor= 'openInNpp.preserveCursorPosition'
    };
//==============================================================================

class ConfigProxy {
    private readonly _configApi = ßß_vsCode.workspace.getConfiguration();

get executable    ():string  { 
  const ü_a = this._configApi.get<string> ( EConfigurationIds.executable     )!;
  return ü_a;
}
get multiInst     ():boolean { return this._configApi.get<boolean>( EConfigurationIds.multiInst      )!; }
get preserveCursor():boolean { return this._configApi.get<boolean>( EConfigurationIds.preserveCursor )!; }

}

export class ConfigSnapshot extends ConfigProxy {
static async getInstance():Promise<ConfigSnapshot> {
    return new ConfigSnapshot().parseConfig();
}
//
    executable:string
  //multiInst      = super.multiInst      ;
  //preserveCursor = super.preserveCursor ;
    detached       = true;
    lineNumber     = -1;
//
constructor() {
    super();
    this.executable = 'ddd'     ;
}
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