/*
*/
  import * as ßß_vsCode from 'vscode';
  import * as ßß_path   from 'path';
  import * as ßß_cp     from 'child_process';
  import { SpawnOptions
         } from 'child_process';
//------------------------------------------------------------------------------
  import   ExtensionRuntime
           from './extension';
  const ß_trc = ExtensionRuntime.developerTrace;
//------------------------------------------------------------------------------
  import { i18n    as ßß_i18n
         , textIds as ßß_text
         } from './i18n';
//------------------------------------------------------------------------------
  import { EExtensionIds
         } from './extension';
  import { ESystemErrorCodes
         } from './lib/types';
  import { EVscConstants
         , isDirectory , exists , findFiles
         } from './lib/vsc';
  import { whenChildProcessSpawned
         } from './lib/any';
  import { EConfigurationIds
         , ConfigSnapshot
         } from './configHandler';
//------------------------------------------------------------------------------
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

export class CommandHandler {

static async openSettings( this:null ):Promise<void> {
    await ßß_vsCode.commands.executeCommand( EVscConstants.openWbSettings, EConfigurationIds.prefix );
}

static async openInNppActive( this:null ):Promise<number> {
    const ü_config = ConfigSnapshot.current;
    const ü_args = new CLIArgs( ü_config );
    return ü_args.submit();
}

static async openInNppEditor( this:null, ü_fileUri:ßß_vsCode.Uri ):Promise<number> {
    if(ß_trc){ß_trc( 'Editor Context' );}
    const ü_config = ConfigSnapshot.current;
    const ü_args = new CLIArgs( ü_config, ü_fileUri.fsPath );
    return ü_args.submit();
}

static async openInNppExplorer( this:null, ö_fileUri:ßß_vsCode.Uri, ü_fileUris:ßß_vsCode.Uri[] ):Promise<number> {
    if(ß_trc){ß_trc( 'Explorer Context' );}
  //
    let ü_otherFiles:string[] = ü_fileUris.map( ü_fileUri => ü_fileUri.fsPath )
                                          .filter( ü_file => ü_file !== ö_fileUri.fsPath );
  //
    const ü_config = ConfigSnapshot.current;
    const ü_args = new CLIArgs( ü_config, ö_fileUri.fsPath, ü_otherFiles );
    return ü_args.submit();
}

}

//==============================================================================

class CLIArgs {
    private _selection        :ßß_vsCode.Selection|null = null;
    private _noMainFile       :boolean
    private          _mainFileIsFolder :boolean   = false

constructor( _config:ConfigSnapshot                                         );
constructor( _config:ConfigSnapshot, _mainFile:string                       );
constructor( _config:ConfigSnapshot, _mainFile:string, _otherFiles:string[] );
constructor(
    private readonly _config           :ConfigSnapshot
  , private          _mainFile         :string    = ''
  , private          _otherFiles       :string[]  = []
){
    if(ß_trc){ß_trc( 'Arguments', arguments.length );}

    this._noMainFile = this._mainFile.length === 0;
    const ü_activeEditor = ßß_vsCode.window.activeTextEditor;

    if ( this._noMainFile ) {
      if ( ü_activeEditor === undefined ) {
        ß_showInformationMessage( ßß_i18n( ßß_text.no_active_file ) );
        return;
      }
      this._mainFile = ü_activeEditor.document.fileName;
    } else {
      if ( ü_activeEditor                   === undefined
        || ü_activeEditor.document.fileName !== this._mainFile
         ) {
        return; // Trigger always active ?
      }
    }
  //
    if ( this._config.preserveCursor ) { this._selection = ü_activeEditor.selection; }
}

async submit():Promise<number> {
    const ü_exe  = await this._config.whenExecutable;
    const ü_opts = this._options();
    const ü_args = this._arguments();
  //
    if(ß_trc){ß_trc( 'ChildProcess', ü_exe, ü_args, ü_opts );}
    return whenChildProcessSpawned( ü_exe, ü_args, ü_opts );
}

private _arguments():string[] {
  //const ü_args = [ ... this._config.commandLineArguments ];
    const ü_args =       this._config.commandLineArguments  ;
  //
    if ( this._config.multiInst
    || ( this._mainFileIsFolder
      && this._config.openFolderAsWorkspace    ) ) { ü_args.push( ECLIParameters.multipleInstances                     ); }
  //
    if ( this._config.skipSessionHandling        ) { ü_args.push( ECLIParameters.skipSessionHandling                   ); }
  //
    if ( this._selection !== null
      && this._selection.isEmpty                 ) { ü_args.push( ECLIParameters.  lineNumber + ( 1 + this._selection.active.line      ) );
                                                     ü_args.push( ECLIParameters.columnNumber + ( 1 + this._selection.active.character ) ); }
  //
    if ( this._mainFileIsFolder                           ) {
    if ( this._config.openFolderAsWorkspace   ) { ü_args.push( ECLIParameters.openFoldersAsWorkspace                );
                                                  ü_args.push(     this._mainFile   ); }
                                                  ü_args.push( ... this._otherFiles ); }
    else                                        { ü_args.push(     this._mainFile   ); }
  //
    return ü_args;
}

private _options():SpawnOptions {
  //
    const ü_opts:SpawnOptions =
      { stdio   : 'ignore'
      , detached: this._config.decoupledExecution
      , cwd     : this._cwd()
      };
  //
    Object.assign( ü_opts, this._config.spawnOptions );
  //
    return ü_opts;
}

private _cwd():string {
    const ü_cfgWd = this._config.workingDirectory;
  //
    if ( ü_cfgWd.length > 0 ) {

      if ( ßß_path.isAbsolute( ü_cfgWd ) ) {
        return ü_cfgWd;
      }

      return ßß_path.join(    this._mainFileIsFolder
           ?                  this._mainFile
           : ßß_path.dirname( this._mainFile )
           ,                  ü_cfgWd )
           ;
    }
  //
      return                  this._mainFileIsFolder
           ?                  this._mainFile
           : ßß_path.dirname( this._mainFile )
           ;
}

}

//==============================================================================

export async function ß_executeCommand( ü_fileUri:ßß_vsCode.Uri | undefined, ü_fileUris:ßß_vsCode.Uri[] ):Promise<number> {
    if ( ü_fileUris !== undefined ) {
      console.log( ü_fileUri?.fsPath )
      console.log( ü_fileUris.map( ü_fileUri => ü_fileUri.fsPath ) )

    }
  //
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
    //
    } else {
    //
                                        ü_fileName  = ü_fileUri.fsPath;
      if ( ü_cmdInfo.preserveCursor
        && ü_activeEditor                   !== undefined
        && ü_activeEditor.document.fileName === ü_fileName
         ) { ü_selection = ü_activeEditor.selection; }
    //
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
    console.info( `${ EExtensionIds.extensionFullName }`, ü_opts, [ ü_exe, ... ü_args ] );
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