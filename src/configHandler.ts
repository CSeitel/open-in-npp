/*
*/
  import * as ßß_vsCode from 'vscode';
  import { IConfig
         } from './implementation';
  import { isExe
         } from './lib/any';
//------------------------------------------------------------------------------
  const ß_configIds =
  { executable    : 'openInNpp.Executable'
  , multiInst     : 'openInNpp.multiInst'
  , preserveCursor: 'openInNpp.preserveCursorPosition'
  };
  const ß_exe_path = {
    x86_32bit: "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
  , x64_64bit: "C:\\Program Files\\Notepad++\\notepad++.exe"
  , path_env : "notepad++.exe"
  };
//==============================================================================

export function ß_getConfig():IConfig {
                           const ü_configApi = ßß_vsCode.workspace.getConfiguration();
  return { executable    : <string>  ü_configApi.get( ß_configIds.executable     )
         , detached      : true
         , multiInst     : <boolean> ü_configApi.get( ß_configIds.multiInst      )
         , preserveCursor: <boolean> ü_configApi.get( ß_configIds.preserveCursor )
         , lineNumber: -1
         };
}

export async function ß_parseConfig( ü_config:IConfig ):Promise<void> {
//
  if ( ü_config.executable.length === 0 ) { // default
       ü_config.executable = await defaultNppExecutable();
  } else {
//    if ( ! await isExe( ü_config.executable ) ) {
//  throw new Error( ßß_i18n( ßß_text.exe_not_found, ü_exeName ) );
  }
//
}

//------------------------------------------------------------------------------

async function defaultNppExecutable():Promise<string> {
       if ( await isExe( ß_exe_path.x64_64bit ) ) { return ß_exe_path.x64_64bit; }
  else if ( await isExe( ß_exe_path.x86_32bit ) ) { return ß_exe_path.x86_32bit; }
  else                                            { return ß_exe_path.path_env ; }
}
