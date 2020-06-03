/*
*/
  import * as ßß_vsCode from 'vscode';
  import * as ßß_path   from 'path';
  import * as ßß_cp     from 'child_process';
//------------------------------------------------------------------------------
  import { i18n    as ßß_i18n
         , textIds as ßß_text
         } from './i18n';
//------------------------------------------------------------------------------
  import { ESystemErrorCodes
         } from './lib/types';
  import { isDirectory , exists , findFiles
         } from './lib/vsc';
  import { EConfigurationIds
         , ConfigSnapshot
         } from './configHandler';
  import { EExtensionIds
         , runtime
         } from './extension';
//------------------------------------------------------------------------------
  const ß_trc = runtime.trace;
  import ß_showInformationMessage = ßß_vsCode.window.showInformationMessage;
  import ß_showWarningMessage     = ßß_vsCode.window.showWarningMessage    ;
  import ß_showErrorMessage       = ßß_vsCode.window.showErrorMessage      ;
//------------------------------------------------------------------------------
  type TCmdInfo = ConfigSnapshot & typeof CCursorPosition
//------------------------------------------------------------------------------
  const enum ECLIParameters
    { multipleInstances      = '-multiInst'
    , openFoldersAsWorkspace = '-openFoldersAsWorkspace'
    , skipSessionHandling    = '-nosession'
    ,   lineNumber           = '-n'
    , columnNumber           = '-c'
    };
//------------------------------------------------------------------------------
  const CNaLineNumber = 0;
  const CCursorPosition =
    { lineNumber   : CNaLineNumber
    , columnNumber : CNaLineNumber
    }
//==============================================================================

export async function ß_openSettings() {
    await ßß_vsCode.commands.executeCommand( EExtensionIds.openWbSettings, EConfigurationIds.prefix );
}

export async function ß_executeCommand( ü_fileUri:ßß_vsCode.Uri | undefined ):Promise<number> {
    const ü_config = ConfigSnapshot.current;
    const ü_cmdInfo = Object.assign( Object.create( ü_config ), CCursorPosition ) as TCmdInfo;
    const ü_activeEditor = ßß_vsCode.window.activeTextEditor;
  //
    let ü_selection :ßß_vsCode.Selection | undefined
    let ü_files     :string[]            | undefined
    let ü_fileName  :string
    if ( ü_fileUri === undefined ) {

      if ( ü_activeEditor === undefined ) {
        ß_showInformationMessage( ßß_i18n( ßß_text.no_active_file ) );
        return -1;
      }

                                        ü_fileName  = ü_activeEditor.document.fileName;
      if ( ü_cmdInfo.preserveCursor ) { ü_selection = ü_activeEditor.selection; }
    } else { //-----------------------------------------------------------------
                                        ü_fileName  = ü_fileUri.fsPath;
      if ( ü_cmdInfo.preserveCursor
        && ü_activeEditor                   !== undefined
        && ü_activeEditor.document.fileName === ü_fileName
                                   ) { ü_selection = ü_activeEditor.selection; }
      if ( ü_selection === undefined // selection = file
        && ( ü_cmdInfo.filesInFolderPattern.length > 0 || ü_cmdInfo.openFolderAsWorkspace )
        && await isDirectory( ü_fileUri )
         ) {
        if ( ü_cmdInfo.filesInFolderPattern.length > 0 ) {
          ü_files = await findFiles( ü_fileName, ü_cmdInfo.filesInFolderPattern );
          ß_showInformationMessage( ßß_i18n( ßß_text.file_hits,  ü_files.length , ü_cmdInfo.filesInFolderPattern , ü_fileName ) );
          if ( ü_files.length === 0 ) {
            return -1;
          }
        } else {
          ü_files = []; // isFolder = false
        }
      }
    }
  //
    if ( ü_selection !== undefined
      && ü_selection.isEmpty
       ) { ü_cmdInfo.  lineNumber = ü_selection.active.line      + 1;
           ü_cmdInfo.columnNumber = ü_selection.active.character + 1;
         }
  //
  let ü_pid = -1;
  try {
    ü_pid = await ß_spawnProcess( ü_cmdInfo, ü_fileName, ü_files );
  } catch ( ü_eX ) {
    console.error( ü_eX.message );
    switch ( ü_eX.code ) {

      case ESystemErrorCodes.ENOENT:
        if ( ! await exists( ü_cmdInfo.workingDirectory, true  ) ) { ß_showErrorMessage( ßß_i18n( ßß_text.cwd_not_found, ü_cmdInfo.workingDirectory ) ); }
        if ( ! await exists( ü_cmdInfo.executable!     , false ) ) { ß_showErrorMessage( ßß_i18n( ßß_text.exe_not_found, ü_cmdInfo.executable       ) ); }
      //break;
      case 'UNKNOWN':
      default       :                                                ß_showErrorMessage( ßß_i18n( ßß_text.cmd_error    , ü_eX.message ) );
    }
  }
//
  return ü_pid;
}

async function ß_spawnProcess( ü_cmdInfo:TCmdInfo, ü_fileName:string, ü_files:string[] | undefined ):Promise<number> {
    const ü_isFolder = ü_files !== undefined;
  //
                                            const ü_args = [ ... ü_cmdInfo.commandLineArguments ];
    if ( ü_cmdInfo.multiInst
    || ( ü_isFolder
      && ü_cmdInfo.openFolderAsWorkspace    ) ) { ü_args.push( ECLIParameters.multipleInstances                     ); }
    if ( ü_cmdInfo.skipSessionHandling        ) { ü_args.push( ECLIParameters.skipSessionHandling                   ); }
  //
    if ( ü_cmdInfo.lineNumber > CNaLineNumber ) { ü_args.push( ECLIParameters.  lineNumber + ü_cmdInfo.  lineNumber );
                                                  ü_args.push( ECLIParameters.columnNumber + ü_cmdInfo.columnNumber ); }
  //
    if ( ü_isFolder                           ) {
    if ( ü_cmdInfo.openFolderAsWorkspace      ) { ü_args.push( ECLIParameters.openFoldersAsWorkspace                );
                                                  ü_args.push(     ü_fileName ); }
                                                  ü_args.push( ... ü_files!   ); }
    else                                        { ü_args.push(     ü_fileName ); }
  //
    const ü_opts:ßß_cp.SpawnOptions =
      { stdio   : 'ignore'
      , detached: ü_cmdInfo.decoupledExecution
      };
  //
    if ( ü_cmdInfo.workingDirectory.length > 0 ) {
      if ( ßß_path.isAbsolute( ü_cmdInfo.workingDirectory ) ) {
         ü_opts.cwd = ü_cmdInfo.workingDirectory;
      } else {
         ü_opts.cwd = ßß_path.join(    ü_isFolder
                    ?                  ü_fileName
                    : ßß_path.dirname( ü_fileName )
                    ,                  ü_cmdInfo.workingDirectory );
      }
    } else {
         ü_opts.cwd =                  ü_isFolder
                    ?                  ü_fileName
                    : ßß_path.dirname( ü_fileName )
                    ;
    }
    Object.assign( ü_opts, ü_cmdInfo.spawnOptions );
  //
    const ü_exe = await ü_cmdInfo.whenExecutable;
    console.info( `${ EExtensionIds.fullName }`, ü_opts, [ ü_exe, ... ü_args ] );
    const ö_proc = ßß_cp.spawn( ü_exe, ü_args, ü_opts );
  //
    return new Promise<number>( (ü_resolve,ü_reject) => {
      ö_proc.on( 'error', ü_eX => {
        ü_reject( ü_eX );
      });
      if ( ö_proc.pid !== undefined ) {
        ü_resolve( ö_proc.pid );
      }
    });
  //
}

//==============================================================================
/*
https://nodejs.org/api/child_process.html#child_process_event_error
*/