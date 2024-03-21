/*
*/
  import { CEExecutable
         } from '../constants/extension';
  import { type ConfigSnapshot
         } from '../core/configContext';
//--------------------------------------------------------------------
  import { resolve
         , normalize
         , isAbsolute
         } from 'path';
  import { FileSystemError
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         , ß_err
         } from '../runtime/context';
  import { ß_XtnOpenInNpp
         , ß_StatusBarItem
         } from '../runtime/context-XTN';
  import { LCXtn
         , LCConfig
         } from '../l10n/i18n';
  import { shortenText
         , expandEnvVariables
         } from '../lib/textUtil';
  import { isExe
         , whenKnownAsFolder as fsWhenKnownAsFolder
         } from '../lib/fsUtil';
  import { ErrorMessage
         } from '../lib/errorUtil';
//====================================================================

export async function onNewExecutable    ( ü_cfg:ConfigSnapshot ):Promise<void> { ß_StatusBarItem.echoPromise( ü_cfg.whenExecutable    , LCConfig.executable     ); }
export async function onNewWorkingDir    ( ü_cfg:ConfigSnapshot ):Promise<void> { ß_StatusBarItem.echoPromise( ü_cfg.whenWorkingDir    , LCConfig.workingDir     ); }
export async function onNewVirtualDocsDir( ü_cfg:ConfigSnapshot ):Promise<void> { ß_StatusBarItem.echoPromise( ü_cfg.whenVirtualDocsDir, LCConfig.virtualDocsDir ); }

export async function whenExecutable( ü_useHistory:boolean, ü_cfgPath:string ):Promise<string> {
    if ( ü_cfgPath.length === 0 ) { return whenDefaultExecutable( ü_useHistory ); }
  //
    const ü_path = normalize( expandEnvVariables( ü_cfgPath ) );
    if ( isAbsolute( ü_path ) ) {
        if ( ! await isExe( ü_path ) ) {
            throw new ErrorMessage( LCConfig.noExeFile, ü_path );
        }
    } else {
        console.warn( `Not a absolute Path: "${ ü_path }"` );
    }
    return ü_path;
}

export async function whenDefaultExecutable( ü_useHistory:boolean ):Promise<string> {
  //
    if ( ü_useHistory ) {
        const ü_cfgHst = ß_XtnOpenInNpp.globalHistory.config;
        const ü_release = await ü_cfgHst.whenDataRef<string>();
        try {

            const ü_cfgData = ü_cfgHst.dataRef;
            ß_trc&& ß_trc( ü_cfgData, `Config-History` );
            const ü_lastExe = ü_cfgData.executable;
            if ( ü_lastExe.length > 0 ) {
                ß_trc&& ß_trc( `Executable stored: "${ ü_lastExe }"` );
                return ü_lastExe;
            } else {
                const ü_nextExe = await whenDefaultExecutable( false );
                ß_trc&& ß_trc( `Executable found: "${ ü_nextExe }"` );
                                   ü_cfgData.executable = ü_nextExe;
                ü_cfgHst.dataRef = ü_cfgData;
                return ü_nextExe;
            }

        } finally { ü_release(); }
    } else {
                           let ü_path:string
             if ( await isExe( ü_path = expandEnvVariables( CEExecutable.x64_64bit  ) ) ) {}
        else if ( await isExe( ü_path = expandEnvVariables( CEExecutable.x86_32bit  ) ) ) {}
        else if ( await isExe( ü_path =                     CEExecutable.x64_64bit_   ) ) {}
        else if ( await isExe( ü_path =                     CEExecutable.x86_32bit    ) ) {}
        else                 { ü_path =                     CEExecutable.path_env         ;}
                        return ü_path;
    }
}

//====================================================================

export async function whenKnownAsFolder( ü_dirDefinition:string, ü_cfgPath:string ):Promise<string> {
    if ( ü_cfgPath.length === 0 ) { return ü_cfgPath; }
  //
    const ü_path = normalize( expandEnvVariables( ü_cfgPath ) );
    if ( isAbsolute( ü_path ) ) {
      if ( ! await fsWhenKnownAsFolder( ü_path ) ) {
          throw new ErrorMessage( LCConfig.noFolder, ü_dirDefinition, ü_path );
      }
    }
  //ß_trc&& ß_trc( `Directory found: "${ ü_path }"` );
    return ü_path;
}

//====================================================================
/*
*/