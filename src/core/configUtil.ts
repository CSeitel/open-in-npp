/*
*/
  import { type TUiXMessageTemplate
         , type IExpandUiXMessageVars
         } from '../types/lib.errorUtil.d';
  import { CEExecutable
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { normalize
         , isAbsolute
         } from 'path';
//--------------------------------------------------------------------
  import { ß_XtnOpenInNpp
         , ß_StatusBarItem
         , ß_whenXtnAvailable
         } from '../runtime/context-XTN';
  import { ß_trc
         } from '../runtime/context';
  import { LCConfig
         } from '../l10n/i18n';
  import { ErrorWithUixMessage
         } from '../lib/errorUtil';
  import { isWin32ShellExecutable
         , hasWin32ShellExecutableExtension
         , whenKnownAsFolder as fsWhenKnownAsFolder
         } from '../lib/fsUtil';
  import { expandEnvVariables
         } from '../lib/textUtil';
//====================================================================

export function onPathChanged( ü_whenPath:PromiseLike<string>, ü_yes:IExpandUiXMessageVars, ü_warn = LCConfig.notAbsolute ):void {
  //
    ß_StatusBarItem.echoWhenDone(
        ü_whenPath.then( function( ü_path ){
            if (             ü_path.length === 0 ) { return ü_path; }
            if ( isAbsolute( ü_path )            ) { return ü_path;
                   // throw new ErrorWithUixMessage( ü_yes  , ü_path ).asInfo   ();
             } else { throw new ErrorWithUixMessage( ü_warn , ü_path ).asWarning(); }
        })
      , ü_yes, 'Unknown {0}'
    );
}

//====================================================================

export async function whenExecutable( ü_useHistory:boolean, ü_cfgPath:string ):Promise<string> {
    if ( ü_cfgPath.length === 0 ) { return whenDefaultExecutable( ü_useHistory ); }
  //
    const ü_path = normalize( expandEnvVariables( ü_cfgPath ) );
    if ( isAbsolute( ü_path ) ) {
        if ( ! await isWin32ShellExecutable ( ü_path ) ) { throw new ErrorWithUixMessage( LCConfig.noExeFile, ü_path ); }
    } else {
        if ( ! hasWin32ShellExecutableExtension( ü_path ) ) { throw new ErrorWithUixMessage( LCConfig.noExeFile, ü_path ); }
        ß_trc&& ß_trc( `Not a absolute Path: "${ ü_path }"`, 'Executable' );
    }
    return ü_path;
}

export async function whenDefaultExecutable( ü_useHistory:boolean ):Promise<string> {
  //
    if ( ü_useHistory ) {
        const ü_XtnOpenInNpp = ß_XtnOpenInNpp || await ß_whenXtnAvailable();
      //ß_trc&& ß_trc( ü_XtnOpenInNpp === null, 'zzzzzz' );
        const ü_cfgHist = ü_XtnOpenInNpp.globalHistory.config;
        const ü_release = await ü_cfgHist.whenDataRef<string>();
        try {

            const ü_cfgData = ü_cfgHist.dataRef;
            ß_trc&& ß_trc( ü_cfgData, 'Config-History' );
            const ü_lastExe = ü_cfgData.executable;
            if ( ü_lastExe.length > 0 ) {
                //                  ü_cfgHist.triggerCommit();
                ß_trc&& ß_trc( `Stored: "${ ü_lastExe }"`, 'Executable' );
                return ü_lastExe;
            } else {
                const ü_nextExe = ü_cfgData.executable = await whenDefaultExecutable( false );
                ß_trc&& ß_trc( `Found: "${ ü_nextExe }"`, 'Set-History-Executable' );
                                    ü_cfgHist.triggerCommit();
              //ü_cfgHist.dataRef = ü_cfgData;
                return ü_nextExe;
            }

        } finally { ü_release(); }
    } else {
                                       let ü_path:string
             if ( await isWin32ShellExecutable( ü_path = expandEnvVariables( CEExecutable.x64_64bit  ) ) ) {}
        else if ( await isWin32ShellExecutable( ü_path = expandEnvVariables( CEExecutable.x86_32bit  ) ) ) {}
        else if ( await isWin32ShellExecutable( ü_path =                     CEExecutable.x64_64bit_   ) ) {}
        else if ( await isWin32ShellExecutable( ü_path =                     CEExecutable.x86_32bit    ) ) {}
        else                                  { ü_path =                     CEExecutable.path_env         ;}
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