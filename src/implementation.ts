import * as ßß_fs     from 'fs'    ;
import * as ßß_vsCode from 'vscode';

  const ß_id_exe:string = 'openInNpp.Executable';
  const ß_id_mi :string = 'openInNpp.multiInst' ;
  const ß_exe_path = {
    x86_32bit: "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
  , x64_64bit: "C:\\Program Files\\Notepad++\\notepad++.exe"
  , path_env: "notepad++.exe"
  , previous: ""
  };

export interface IConfig {
  exeName: string;
  mi: boolean;
}

export class implementation {

  static ß_getConfig():IConfig | null {
  const ü_config = ßß_vsCode.workspace.getConfiguration();
//
   let ü_exeName:string = ü_config.get( ß_id_exe ) || '';
  if ( ü_exeName.length === 0 ) {
         if (                   ß_exe_path.previous.length > 0
           && ßß_fs.existsSync( ß_exe_path.previous  ) ) { ü_exeName = ß_exe_path.previous ; }
    else if ( ßß_fs.existsSync( ß_exe_path.x64_64bit ) ) { ü_exeName = ß_exe_path.previous = ß_exe_path.x64_64bit; }
    else if ( ßß_fs.existsSync( ß_exe_path.x86_32bit ) ) { ü_exeName = ß_exe_path.previous = ß_exe_path.x86_32bit; }
    else                                                 { ü_exeName = ß_exe_path.previous = ß_exe_path.path_env ; }
  } else if ( ! ßß_fs.existsSync( ü_exeName ) ) {
      ßß_vsCode.window.showInformationMessage( `Notepad++ executable not found: ${ ü_exeName }` );
      return null;
  }
//
  return { exeName: ü_exeName
         , mi: <boolean> ü_config.get( ß_id_mi )
         };
}


}

//export = { getConfig: ß_getConfig }