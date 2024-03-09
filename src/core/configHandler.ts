/*
*/
  import { CEExecutable
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { resolve
         , normalize
         , isAbsolute
         } from 'path';
  import { FileSystemError
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../runtime/context';
  import { LCXtn
         } from '../l10n/i18n';
  import { ß_XtnOpenInNpp
         } from '../runtime/context-XTN';
  import { shortenText
         , expandEnvVariables
         } from '../lib/textUtil';
  import { isExe
         , whenKnownAsFolder as fsWhenKnownAsFolder
         } from '../lib/fsUtil';
  import { ErrorMessage
         } from '../lib/errorUtil';
//====================================================================

export async function whenExecutableChecked( ü_exeInput:string ):Promise<string> {
      const ü_exeFile = normalize( expandEnvVariables( ü_exeInput ) );
      if ( isAbsolute( ü_exeFile ) ) {
          const ü_valid = await isExe( ü_exeFile );
          if ( ! ü_valid ) { ß_trc&& ß_trc( `Not valid ${ ü_exeFile }` ); }
      } else {
        console.warn( `Not a absolute Path: "${ ü_exeFile }" ${ process.cwd() }` );
      }
      return ü_exeFile;
}

export async function whenExecutable( ü_explicit:string, ü_useHistory:boolean ):Promise<string> {
  //
    if ( ü_explicit.length > 0 ) {
      const ü_current = normalize( expandEnvVariables( ü_explicit ) );
      if ( ! isAbsolute( ü_current ) ) {
        console.warn( `Not a absolute Path: "${ ü_current }"` );
      }
      return ü_current;
    }
  //
    const ü_cfgHst = ß_XtnOpenInNpp.globalHistory.config;
    const ü_done = await ü_cfgHst.whenDataRef<string>();
    try {
        const ü_cfgData = ü_cfgHst.dataRef;
        ß_trc&& ß_trc( ü_cfgData, `Config-History` );
      //
        if ( ü_useHistory ) {
            const ü_lastExe = ü_cfgData.executable;
            if ( ü_lastExe.length > 0 ) {
              ß_trc&& ß_trc( `Executable stored: "${ ü_lastExe }"` );
              return ü_lastExe;
            }
        }
      //
                           let ü_current:string
             if ( await isExe( ü_current = expandEnvVariables( CEExecutable.x64_64bit  ) ) ) {}
        else if ( await isExe( ü_current = expandEnvVariables( CEExecutable.x86_32bit  ) ) ) {}
        else if ( await isExe( ü_current =                     CEExecutable.x64_64bit_   ) ) {}
        else if ( await isExe( ü_current =                     CEExecutable.x86_32bit    ) ) {}
        else                 { ü_current =                     CEExecutable.path_env         ;}
      //
        ß_trc&& ß_trc( `Executable found: "${ ü_current }"` );
                           ü_cfgData.executable = ü_current;
        ü_cfgHst.dataRef = ü_cfgData;
      //
        return ü_current;

    } catch ( ü_eX ) {
        console.error( ü_eX );
      //return ü_done( ü_eX );
        throw ü_eX;
    } finally {
        ü_done();
    }
}

//====================================================================

export async function whenKnownAsFolder( ü_purpose:string, ü_cfgPath:string ):Promise<string> {
    if ( ü_cfgPath.length === 0 ) { return ü_cfgPath; }
  //
    const ü_path = normalize( expandEnvVariables( ü_cfgPath ) );
    if ( isAbsolute( ü_path) && ! await fsWhenKnownAsFolder( ü_path ) ) { throw new ErrorMessage( LCXtn.noFolder( ü_purpose, ü_path ) ); }
  //ß_trc&& ß_trc( `Directory found: "${ ü_path }"` );
    return ü_path;
}

//====================================================================
/*
*/