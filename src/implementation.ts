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
         } from './extension';
//------------------------------------------------------------------------------
  import ß_showInformationMessage = ßß_vsCode.window.showInformationMessage;
  import ß_showWarningMessage     = ßß_vsCode.window.showWarningMessage    ;
  import ß_showErrorMessage       = ßß_vsCode.window.showErrorMessage      ;
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
//==============================================================================

export async function ß_openSettings() {
    await ßß_vsCode.commands.executeCommand( EExtensionIds.openWbSettings, EConfigurationIds.prefix );
}

export async function ß_executeCommand( ü_fileUri:ßß_vsCode.Uri | undefined ):Promise<number> {
    const ß_config:ConfigSnapshot = await ConfigSnapshot.getCurrent();
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
      if ( ß_config.preserveCursor ) { ü_selection = ü_activeEditor.selection; }
    } else { //-----------------------------------------------------------------
                                       ü_fileName  = ü_fileUri.fsPath;
      if ( ß_config.preserveCursor
        && ü_activeEditor                   !== undefined
        && ü_activeEditor.document.fileName === ü_fileName
                                   ) { ü_selection = ü_activeEditor.selection; }
      if ( ü_selection === undefined // selection = file
        && ( ß_config.filesInFolderPattern.length > 0 || ß_config.openFolderAsWorkspace )
        && await isDirectory( ü_fileUri )
         ) {
        if ( ß_config.filesInFolderPattern.length > 0 ) {
          ü_files = await findFiles( ü_fileName, ß_config.filesInFolderPattern );
          ß_showInformationMessage( `${ ü_files.length } matches for "${ ß_config.filesInFolderPattern }" @ "${ ü_fileName }"` );
        } else {
          ü_files = [];
        }
      }
    }
  //
    if ( ü_selection !== undefined
      && ü_selection.isEmpty
       ) { ß_config.  lineNumber = ü_selection.active.line      + 1;
           ß_config.columnNumber = ü_selection.active.character + 1; }
    else { ß_config.  lineNumber = CNaLineNumber;
           ß_config.columnNumber = CNaLineNumber; }
  //
  let ü_pid = -1;
  try {
    ü_pid = await spawnProcess( ß_config, ü_fileName, ü_files );
  } catch ( ü_eX ) {
    console.error( ü_eX );
    switch ( ü_eX.code ) {
      case 'UNKNOWN': ß_showErrorMessage( ßß_i18n( ßß_text.exe_not_found, ß_config.executable             ) ); break;
      case ESystemErrorCodes.ENOENT:
        if ( ! await exists( ß_config.workingDirectory, true ) ) {
          ß_showErrorMessage( `Not a valid working directory: "${ ß_config.workingDirectory }";  ${ ü_eX.message }` );
        }
        if ( ! await exists( ß_config.executable ) ) {
          ß_showErrorMessage( ßß_i18n( ßß_text.exe_error    , ß_config.executable, ü_eX.message ) );
        }
        break;
      default       : 
        ß_showErrorMessage( ßß_i18n( ßß_text.exe_error    , ß_config.executable, ü_eX.message ) );
    }
  }
//
  return ü_pid;
}

async function spawnProcess( ü_config:ConfigSnapshot, ü_fileName:string, ü_files:string[] | undefined ):Promise<number> {
    const ü_isFolder = ü_files !== undefined;
  //
                                           const ü_args = [ ... ü_config.commandLineArguments ];
    if ( ü_config.multiInst
    || ( ü_isFolder
      && ü_config.openFolderAsWorkspace    ) ) { ü_args.push( ECLIParameters.multipleInstances                    ); }
    if ( ü_config.skipSessionHandling        ) { ü_args.push( ECLIParameters.skipSessionHandling                  ); }
  //
    if ( ü_config.lineNumber > CNaLineNumber ) { ü_args.push( ECLIParameters.  lineNumber + ü_config.  lineNumber );
                                                 ü_args.push( ECLIParameters.columnNumber + ü_config.columnNumber ); }
  //
    if ( ü_isFolder                          ) {
    if ( ü_config.openFolderAsWorkspace      ) { ü_args.push( ECLIParameters.openFoldersAsWorkspace               );
                                                 ü_args.push(     ü_fileName ); }
                                                 ü_args.push( ... ü_files!   ); }
    else                                       { ü_args.push(     ü_fileName ); }
  //
    const ü_opts:ßß_cp.SpawnOptions =
      { stdio   : 'ignore'
      , detached: ü_config.decoupledExecution
      };
  //
    if ( ü_config.workingDirectory.length > 0 ) {
      if ( ßß_path.isAbsolute( ü_config.workingDirectory ) ) {
         ü_opts.cwd = ü_config.workingDirectory;
      } else {
         ü_opts.cwd = ßß_path.join(    ü_isFolder
                    ?                  ü_fileName
                    : ßß_path.dirname( ü_fileName )
                    ,                  ü_config.workingDirectory );
      }
    } else {
         ü_opts.cwd =                  ü_isFolder
                    ?                  ü_fileName
                    : ßß_path.dirname( ü_fileName )
                    ;
    }
    Object.assign( ü_opts, ü_config.spawnOptions );
  //
    console.info( `${ EExtensionIds.fullName }`, ü_opts, [ ü_config.executable, ... ü_args ] );
    const ö_proc = ßß_cp.spawn( ü_config.executable, ü_args, ü_opts );
  //
    return new Promise<number>( (ü_resolve,ü_reject) => {
      ö_proc.on( 'error', ü_eX => {
      //console.error( ü_eX );
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