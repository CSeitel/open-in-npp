/*
*/
  import * as ßß_vsCode from 'vscode';
  import * as ßß_path   from 'path';
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
         , isDirectory
         , findFiles
         } from './lib/vsc';
  import { putFirst
         , putFirstIndex
         , whenChildProcessSpawned
         } from './lib/any';
  import { EConfigurationIds
         , ConfigSnapshot
         } from './configHandler';
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
  const enum EFileTypes
    { UNKNOWN = 0
    , FILE
    , FOLDER
    };
//------------------------------------------------------------------------------
  const enum EModes
    { NOFILE = 0
    , PALETTE
    , EDITOR
    , EXPLORER
    };
  type TAllModes = EModes.EXPLORER
                 | EModes.EDITOR
                 | EModes.PALETTE
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
    if(ß_trc){ß_trc( 'Palette Context' );}
  //
    const ü_args = new CLIArgs( EModes.PALETTE );
    return ü_args.submit();
}

static async openInNppEditor( this:null, ü_fileUri:ßß_vsCode.Uri, ...ü_more:any[] ):Promise<number> {
    if(ß_trc){ß_trc( `Editor Context: ${ arguments.length }`, ü_more );}
  //
    const ü_args = new CLIArgs( EModes.EDITOR, ü_fileUri.fsPath );
    return ü_args.submit();
}

static async openInNppExplorer( this:null, ö_fileUri:ßß_vsCode.Uri, ü_fileUris:ßß_vsCode.Uri[] ):Promise<number> {
    if(ß_trc){ß_trc( 'Explorer Context' );}
  //
    const ü_others = ü_fileUris.map( ü_fileUri => ü_fileUri.fsPath );
  //
    const ü_args = new CLIArgs( EModes.EXPLORER, ö_fileUri.fsPath, ü_others );
    return ü_args.submit();
}

}

//==============================================================================

class CLIArgs {
    private readonly _config                   = ConfigSnapshot.current;
    private readonly _activeEditor             = ßß_vsCode.window.activeTextEditor;
    private readonly _mode         :EModes
    private readonly _mainPath     :string
    private          _mainFileType :EFileTypes = EFileTypes.UNKNOWN;
    private          _others       :string[]   = [];
    private          _asWorkspace  :boolean    = false;

constructor( ü_mode:TAllModes                                         );
constructor( ü_mode:TAllModes, ü_mainPath :string                     );
constructor( ü_mode:TAllModes, ü_mainPath :string, ü_others :string[] );
constructor( ü_mode:TAllModes, ü_mainPath?:string, ü_others?:string[]
){
    if(ß_trc){ß_trc( `ActiveEditor: ${ this._activeEditor !== undefined }` );}
  //
    switch ( this._mode = ü_mode ) {

      case EModes.EXPLORER:
        this._others   = ü_others  !;
        this._mainPath = ü_mainPath!;
        break;

      case EModes.EDITOR:
        this._mainFileType = EFileTypes.FILE;
        this._mainPath     = ü_mainPath!;
        break;

      case EModes.PALETTE:
        if ( this._activeEditor === undefined ) {
          this._mode         = EModes.NOFILE;
          this._mainPath     = '';
        } else {
          this._mainFileType = EFileTypes.FILE;
          this._mainPath     = this._activeEditor.document.fileName;
        }
        break;

    }
}

async submit():Promise<number> {
  //
    switch ( this._mode ) {

      case EModes.NOFILE:
        ß_showInformationMessage( ßß_i18n( ßß_text.no_active_file ) );
        return -1;

      case EModes.EXPLORER: // folders possible
        const ü_pattern = this._config.filesInFolderPattern;
        if ( ü_pattern.length > 0 ) {
          this._others = await this._whenPatternMatched( ü_pattern );
          ß_showInformationMessage( ßß_i18n( ßß_text.file_hits, this._others.length , ü_pattern , this._mainPath ) );
          if ( this._others.length === 0 ) {
            return -1;
          }
          if ( this._config.openFolderAsWorkspace ) {
            // ignored
          }
        } else {
          if (       this._config.openFolderAsWorkspace
            && await this._whenMainIsFolder() ) {
                     this._asWorkspace = true;
          }
        }
        break;

    }
  //
      let ü_exe  = await this._config.whenExecutable;
    const ü_opts = await this._options();
  //
    const ü_verbatim = !!ü_opts.windowsVerbatimArguments === true;
    if ( ü_verbatim ) {
      if(ß_trc){ß_trc( `windowsVerbatimArguments: ${ ü_opts.windowsVerbatimArguments }` );}
    }
    const ü_args =       this._arguments( ü_verbatim );
  //
    if(ß_trc){ß_trc( 'ChildProcess', ü_exe, ü_args, ü_opts );}
    try {
      const ü_pid =  await whenChildProcessSpawned( ü_exe, ü_args, ü_opts );
      return ü_pid;
    } catch ( ü_eX ) {
      ß_showErrorMessage( ( ü_eX as Error ).message );
    //ß_showInformationMessage( ( ü_eX as Error ).message );
      return -1;
    }
}

private _compileCursorPosition( ü_args:string[] ):void {
    if ( ! this._config.preserveCursor ) { return; }
  //
    if ( this._activeEditor === undefined ) { return; }
  //
    const ü_active = this._activeEditor.document.fileName;
    switch ( this._mode ) {
      case EModes.EXPLORER:
        const ü_indx = this._others.findIndex( ü_file => ü_file === ü_active );
        if ( ü_indx < 0 ) { return; }
        if ( ü_indx !== ( this._others.length - 1 ) ) {
          this._others.push( this._others[ ü_indx ] );
        }
        break;
      case EModes.EDITOR:
        if ( ü_active !== this._mainPath ) {
          return;
        }
        break;
      default:
    }
  //
    const ü_selection = this._activeEditor.selection;
    if (   ü_selection === null
      || ! ü_selection.isEmpty ) { return; }
  //
    ü_args.push( ECLIParameters.  lineNumber + ( 1 + ü_selection.active.line      ) );
    ü_args.push( ECLIParameters.columnNumber + ( 1 + ü_selection.active.character ) );
}

private _quote( ...ü_args:string[] ):string[] {
           ü_args.forEach( (ü_arg,ü_indx) => { ü_args[ ü_indx ] = `"${ ü_arg }"`; } );
    return ü_args;
}

private _arguments( ü_verbatim:boolean ):string[] {
  //
    const ü_args = [];
  //
    if ( this._config.multiInst
      || this._asWorkspace                ) { ü_args.push( ECLIParameters.multipleInstances      ); }
  //
    if ( this._config.skipSessionHandling ) { ü_args.push( ECLIParameters.skipSessionHandling    ); }
  //
    if ( this._asWorkspace                ) { ü_args.push( ECLIParameters.openFoldersAsWorkspace ); }
                 this._compileCursorPosition( ü_args );
  //
                                              ü_args.push( ... this._config.commandLineArguments );
  //
    if ( this._others.length > 0          ) { ü_args.push( ... ( ü_verbatim ? this._quote( ... this._others   )
                                                                            :                  this._others   ) ); }
    else                                    { ü_args.push(       ü_verbatim ? this._quote(     this._mainPath )[0]
                                                                            :                  this._mainPath   ); }
  //
    return ü_args;
}

private async _options():Promise<SpawnOptions> {
    const ü_more = this._config.spawnOptions;
  //
    const ü_opts:SpawnOptions =
      { stdio   : 'ignore'
      , detached: this._config.decoupledExecution
      , cwd     : await this._cwd( ü_more.cwd !== undefined )
      };
  //
    Object.assign( ü_opts, ü_more );
  //
    return ü_opts;
}

private async _cwd( ü_skip:boolean ):Promise<string> {
    if ( ü_skip ) { return ''; }
  //
    let ü_cwd = this._config.workingDirectory;
  //
    if ( ü_cwd.length > 0 ) {
      if ( ! ßß_path.isAbsolute( ü_cwd ) ) {
       ü_cwd = ßß_path.join( await this._whenMainFolder(), ü_cwd );
      }
    } else {
       ü_cwd = await this._whenMainFolder();
    }
  //
    return ü_cwd;
//
}

private async _whenMainFolder():Promise<string> {
    return            await this._whenMainIsFolder()
         ?                  this._mainPath
         : ßß_path.dirname( this._mainPath )
         ;
}

private async _whenMainIsFolder():Promise<boolean> {
      if ( this._mainFileType === EFileTypes.UNKNOWN )
         { this._mainFileType  =  await isDirectory( this._mainPath )
                               ?  EFileTypes.FOLDER
                               :  EFileTypes.FILE
                               ;
         }
    return this._mainFileType === EFileTypes.FOLDER;
}

private async _whenPatternMatched( ö_pattern:string ):Promise<string[]> {
  //
    const ö_isFolder = await Promise.all( this._others.map(  ü_file         => ü_file === this._mainPath ? this._whenMainIsFolder()
                                                                                                         : isDirectory( ü_file )     ) );
    const ü_subsets  = await Promise.all( this._others.map( (ü_file,ü_indx) => ö_isFolder[ ü_indx ] ? findFiles( ü_file, ö_pattern )
                                                                                                    :          [ ü_file ]            ) );
                                    const ö_files:string[] = [];
    for ( const ü_subset of ü_subsets ) { ö_files.push( ... ü_subset ); }
                                   return ö_files;
}

}

//==============================================================================
/*
*/