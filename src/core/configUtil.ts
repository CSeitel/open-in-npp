/*
*/
  import { type ConfigSnapshot
         } from '../core/configContext';
  import { type TUiXMessageTemplate
         , type IExpandUiXMessageVars
         } from '../types/lib.errorUtil.d';
  import { CEExecutable
         } from '../constants/extension';
  import { CEUiXMessageType
         } from '../constants/error';
//--------------------------------------------------------------------
  import { normalize
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
  import { isWin32Executable
         , isWin32ExecutableExtName
         , whenKnownAsFolder as fsWhenKnownAsFolder
         } from '../lib/fsUtil';
  import { ErrorWithUixMessage
         } from '../lib/errorUtil';
  import { whenPromiseMapped
         } from '../lib/asyncUtil';
//====================================================================

async function ß_whenPath( ü_whenPath:PromiseLike<string>, ü_yes:IExpandUiXMessageVars, ü_warn = LCConfig.notAbsolute ):Promise<void> {
  //
    ß_StatusBarItem.echoWhenDone(
        whenPromiseMapped( ü_whenPath, async function( ü_path ){
            if ( ü_path.length === 0 ) { return ü_path; }
            if ( isAbsolute( ü_path ) ) {
                   // throw new ErrorWithUixMessage( ü_yes, ü_path ).asInfo   ();
             } else { throw new ErrorWithUixMessage( ü_warn , ü_path ).asWarning(); }
        }), ü_yes, 'Unknown {0}' );
}

export async function onNewExecutable    ( ü_cfg:ConfigSnapshot ):Promise<void> { return ß_whenPath( ü_cfg.whenExecutable    , LCConfig.executable_Y     ); }
export async function onNewWorkingDir    ( ü_cfg:ConfigSnapshot ):Promise<void> { return ß_whenPath( ü_cfg.whenWorkingDir    , LCConfig.workingDir_Y     ); }
export async function onNewVirtualDocsDir( ü_cfg:ConfigSnapshot ):Promise<void> { return ß_whenPath( ü_cfg.whenVirtualDocsDir, LCConfig.virtualDocsDir_Y ); }

export async function whenExecutable( ü_useHistory:boolean, ü_cfgPath:string ):Promise<string> {
    if ( ü_cfgPath.length === 0 ) { return whenDefaultExecutable( ü_useHistory ); }
  //
    const ü_path = normalize( expandEnvVariables( ü_cfgPath ) );
    if ( isAbsolute( ü_path ) ) {
        if ( ! await isWin32Executable ( ü_path ) ) { throw new ErrorWithUixMessage( LCConfig.noExeFile, ü_path ); }
    } else {
        if ( ! isWin32ExecutableExtName( ü_path ) ) { throw new ErrorWithUixMessage( LCConfig.noExeFile, ü_path ); }
        ß_trc&& ß_trc( `Not a absolute Path: "${ ü_path }"`, 'Executable' );
    }
    return ü_path;
}

export async function whenDefaultExecutable( ü_useHistory:boolean ):Promise<string> {
  //
    if ( ü_useHistory ) {
        const ü_cfgHist = ß_XtnOpenInNpp.globalHistory.config;
        const ü_release = await ü_cfgHist.whenDataRef<string>();
        try {

            const ü_cfgData = ü_cfgHist.dataRef;
            ß_trc&& ß_trc( ü_cfgData, 'Config-History' );
            const ü_lastExe = ü_cfgData.executable;
            if ( ü_lastExe.length > 0 ) {
                ß_trc&& ß_trc( `Stored: "${ ü_lastExe }"`, 'Executable' );
                return ü_lastExe;
            } else {
                const ü_nextExe = await whenDefaultExecutable( false );
                ß_trc&& ß_trc( `Found: "${ ü_nextExe }"`, 'Executable' );
                                   ü_cfgData.executable = ü_nextExe;
                ü_cfgHist.dataRef = ü_cfgData;
                return ü_nextExe;
            }

        } finally { ü_release(); }
    } else {
                                       let ü_path:string
             if ( await isWin32Executable( ü_path = expandEnvVariables( CEExecutable.x64_64bit  ) ) ) {}
        else if ( await isWin32Executable( ü_path = expandEnvVariables( CEExecutable.x86_32bit  ) ) ) {}
        else if ( await isWin32Executable( ü_path =                     CEExecutable.x64_64bit_   ) ) {}
        else if ( await isWin32Executable( ü_path =                     CEExecutable.x86_32bit    ) ) {}
        else                             { ü_path =                     CEExecutable.path_env         ;}
                                    return ü_path ;
    }
}

//====================================================================

export async function whenKnownAsFolder( ü_dirDefinition:TUiXMessageTemplate, ü_cfgPath:string ):Promise<string> {
    if ( ü_cfgPath.length === 0 ) { return ü_cfgPath; }
  //
    const ü_path = normalize( expandEnvVariables( ü_cfgPath ) );
    if ( isAbsolute( ü_path ) ) {
        if ( ! await fsWhenKnownAsFolder( ü_path ) ) {
            throw new ErrorWithUixMessage( ü_dirDefinition as unknown as IExpandUiXMessageVars || LCConfig.noFolder, ü_path );
        }
    }
    return ü_path;
}

//====================================================================
/*
*/