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
  import   ßß_i18n
           from './i18n';
  import { EButtons as EButtons
         } from './i18n';
//------------------------------------------------------------------------------
  import { expandEnvVariables
         , shortenText
         , whenChildProcessSpawned
         , isExe
         } from './lib/any';
  import { EVscConstants
         , isDirectory
         , findFiles
         , whenUriOpened
         } from './lib/vsc';
  import { TButtons
         , TDropDownListOptions
         , SCancelButtonId
         , ListItem
         , DropDownList
         } from './lib/ui';
  import { TExtension
         , ConfigSnapshot
         , History
         } from './extension';
//------------------------------------------------------------------------------
  import ß_showInformationMessage = ßß_vsCode.window.showInformationMessage;
  import ß_showWarningMessage     = ßß_vsCode.window.showWarningMessage    ;
  import ß_showErrorMessage       = ßß_vsCode.window.showErrorMessage      ;
//------------------------------------------------------------------------------
  const enum EExecutables
    { x64_64bit  =          "%ProgramFiles%\\Notepad++\\notepad++.exe"
    , x64_64bit_ =       "C:\\Program Files\\Notepad++\\notepad++.exe"
    , x86_32bit  =      "%PrograFiles(x86)%\\Notepad++\\notepad++.exe"
    , x86_32bit_ = "C:\\Program Files (x86)\\Notepad++\\notepad++.exe"
    , path_env   =                                     "notepad++.exe"
    };
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
  const CNotAPid = -1;
//==============================================================================

export class ConfigHandler {

static async whenSettingsOpened( this:null ):Promise<void> {
  //
    await ßß_vsCode.commands.executeCommand( EVscConstants.openWbSettings, ConfigSnapshot.CPrefix );
  //
}

static async whenExecutable( ü_explicit:string, ü_useHistory:boolean ):Promise<string> {
  //
    if ( ü_explicit.length > 0 ) {
      const ü_current = ßß_path.normalize( expandEnvVariables( ü_explicit ) );
      if ( ! ßß_path.isAbsolute( ü_current ) ) {
        console.warn( `Not a absolute Path: "${ ü_current }"` );
      }
      return ü_current;
    }
  //
    const ü_hist   = ExtensionRuntime.activeInstance.globalHistory;
    const ü_config = await ü_hist.whenConfig();
    if(ß_trc){ß_trc( `Config-History`, ü_config );}
    try {
    //
      if ( ü_useHistory ) {
        const ü_previous = ü_config.executable;
        if ( ü_previous.length > 0 ) {
          const ü_done = ü_hist.release( 'config' );
          if(ß_trc){ß_trc( `Executable stored: "${ ü_previous }"` );}
          return ü_previous;
        }
      }
    //
                         let ü_current:string
           if ( await isExe( ü_current = expandEnvVariables( EExecutables.x64_64bit  ) ) ) {}
      else if ( await isExe( ü_current = expandEnvVariables( EExecutables.x86_32bit  ) ) ) {}
      else if ( await isExe( ü_current =                     EExecutables.x64_64bit_   ) ) {}
      else if ( await isExe( ü_current =                     EExecutables.x86_32bit    ) ) {}
      else                 { ü_current =                     EExecutables.path_env         ;}
    //
      if(ß_trc){ß_trc( `Executable found: "${ ü_current }"` );}
                     ü_config.executable = ü_current;
      const ü_when = ü_hist.whenCommitted( 'config' );
    //
      return ü_current;

    } catch ( ü_eX ) {
      console.error( ü_eX );
      ü_hist.release( 'config' );
      throw ü_eX;
    }
}

static async whenWorkingDir( ü_dir:string ):Promise<string> {
    return expandEnvVariables( ü_dir );
}

}

//==============================================================================

export class CommandHandler {

static async whenActivationFinalized( ü_activeInstance:ExtensionRuntime ):Promise<void> {
    const ü_versionToNumber = /\./g;
  //
    const ü_current = parseInt( ü_activeInstance.version.replace( ü_versionToNumber, '' ) );
    const ü_globalHistory = new History();
    const ü_admin = ü_globalHistory.admin;
    if(ß_trc){ß_trc( `Admin-History`, ü_admin );}
    if ( ü_current > ü_admin.version ) {
      const ü_when = ü_globalHistory.whenAdmin( { version: ü_current } );
      const ü_show = await ßß_vsCode.window.showInformationMessage( `Welcome to \`Open-In-Notepad++\` Version ${ ü_activeInstance.version }`, `What's new ?` );
      switch ( ü_show ) {
        case undefined: break;
        default:
          whenUriOpened( ExtensionRuntime.CExtensionUrl + '/changelog' );
      }
    }
  //
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
    const ü_args = new CLIArgs( EModes.EDITOR, ü_fileUri );
    return ü_args.submit();
}

static async openInNppExplorer( this:null, ü_fileUri:ßß_vsCode.Uri, ü_fileUris:ßß_vsCode.Uri[] ):Promise<number> {
    if(ß_trc){ß_trc( 'Explorer Context' );}
  //
    const ü_others = ü_fileUris.map( ü_fileUri => ü_fileUri.fsPath );
  //
    const ü_args = new CLIArgs( EModes.EXPLORER, ü_fileUri, ü_others );
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

constructor( ü_mode:TAllModes                                               );
constructor( ü_mode:TAllModes, ü_mainUri :ßß_vsCode.Uri                     );
constructor( ü_mode:TAllModes, ü_mainUri :ßß_vsCode.Uri, ü_others :string[] );
constructor( ü_mode:TAllModes, ü_mainUri?:ßß_vsCode.Uri, ü_others?:string[]
){
    if(ß_trc){ß_trc( `ActiveEditor: ${ this._activeEditor !== undefined }` );}
  //
    switch ( this._mode = ü_mode ) {

      case EModes.EXPLORER:
        this._others   = ü_others !       ;
        this._mainPath = ü_mainUri!.fsPath;
        break;

      case EModes.EDITOR:
        this._mainFileType = EFileTypes.FILE;
        this._mainPath     = CLIArgs._fsPath( ü_mainUri! );
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

static _fsPath( ü_fileUri:ßß_vsCode.Uri ):string {
    switch ( ü_fileUri.scheme ) {
        case 'file':
          return ü_fileUri.fsPath;
        case 'vscode-settings':
          return expandEnvVariables( '%APPDATA%/Code/User/settings.json' );
    }
    return '';
}

async submit():Promise<number> {
  //
    switch ( this._mode ) {

      case EModes.NOFILE:
        ß_showInformationMessage( ßß_i18n.no_active_file() );
        return CNotAPid;

      case EModes.EXPLORER: // folders possible
        const ü_pattern = this._config.filesInFolderPattern;
        if ( ü_pattern.length > 0 ) {
          this._others = await this._whenPatternMatched( ü_pattern, this._config.matchingFilesLimit );
          if ( this._others.length === 0 ) {
            return CNotAPid;
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
      let ü_exe  = await this._config.whenExecutable();
    const ü_opts = await this._options();
  //
    const ü_verbatim = !!ü_opts.windowsVerbatimArguments === true;
    if ( ü_verbatim ) {
      if(ß_trc){ß_trc( `windowsVerbatimArguments: ${ ü_opts.windowsVerbatimArguments }` );}
    }
    const ü_args = await this._arguments( ü_verbatim );
    if ( ü_args.length === 0 ) { return CNotAPid; }
  //
    if(ß_trc){ß_trc( 'ChildProcess', ü_exe, ü_args, ü_opts );}
    try {
      const ü_pid =  await whenChildProcessSpawned( ü_exe, ü_args, ü_opts );
      return ü_pid;
    } catch ( ü_eX ) {
      ß_showErrorMessage( ßß_i18n.spawn_error( ( ü_eX as Error ).message ) );
    //ß_showInformationMessage( ( ü_eX as Error ).message );
      return CNotAPid;
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

private async _arguments( ü_verbatim:boolean ):Promise<string[]> {
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
    if (   this._others.length > 0       ) {
                                              ü_args.push( ... ( ü_verbatim ? ß_quote( ... this._others   )
                                                                            :              this._others   ) );
    } else                                  { ü_args.push(       ü_verbatim ? ß_quote(     this._mainPath )[0]
                                                                            :              this._mainPath   );
    }
  //
    return ü_args;
}

private async _options():Promise<SpawnOptions> {
    const ü_more = this._config.spawnOptions;
  //
    const ü_opts:SpawnOptions =
      { stdio   : 'ignore'
      , detached: this._config.decoupledExecution
      , cwd     : await this._cwd( ü_more.cwd )
      };
  //
    Object.assign( ü_opts, ü_more );
  //
    return ü_opts;
}

private async _cwd( ü_skip:string|undefined ):Promise<string> {
    if ( ü_skip !== undefined ) { return ''; }
  //
    let ü_cwd = await this._config.whenWorkingDir;
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

private async _whenPatternMatched( ö_pattern:string, ü_limit:number ):Promise<string[]> {
  //
    const ö_isFolder = await Promise.all( this._others.map( (ü_file       ) => ü_file === this._mainPath ? this._whenMainIsFolder()
                                                                                                         : isDirectory( ü_file )     ) );
    const ü_subsets  = await Promise.all( this._others.map( (ü_file,ü_indx) => ö_isFolder[ ü_indx ] ? findFiles( ü_file, ö_pattern )
                                                                                                    :          [ ü_file ]            ) );
                                    const ü_files:string[] = [];
    for ( const ü_subset of ü_subsets ) { ü_files.push( ... ü_subset ); }
                                          ü_files.sort();
  //
    if ( ü_files.length > ü_limit ) {
      await this._whenSelected( ü_files, ü_limit );
    } else {
      ß_showInformationMessage( ßß_i18n.file_hits( this._others.length, ö_pattern ) );
    }
  //
    return ü_files;
}

private async _whenSelected( ü_files:string[], ü_limit:number ):Promise<boolean> {
  //
    const ü_todo = ü_limit > 0
                 ? await ß_showInformationMessage( ßß_i18n.max_items( ü_limit, ü_files.length )
                       , { title: EButtons.OK    () , id: EButtons.OK     }
                       , { title: EButtons.SELECT() , id: EButtons.SELECT }
                       , { title: EButtons.ALL   () , id: EButtons.ALL    }
                       )
                 : { id: EButtons.SELECT }
                 ;
    if(ß_trc){ß_trc( `Button: ${ ü_todo }` );}
  //
    switch ( ü_todo?.id ) {

      case EButtons.SELECT:
        const ü_list = ü_files.map( (ü_file,ü_indx) => new ListItem(              ßß_path.basename( ü_file )
                                                          , shortenText( ßß_path.dirname ( ü_file ), 72 )
                                                          ,                                ü_file
                                                          ).setPicked( ü_indx < ü_limit ) );
        ü_files.length = 0;
        const ü_opts:TDropDownListOptions<never> =
          { header: `${ ü_list.length } Files found`
          };
           const ü_items = await DropDownList.whenItemsPicked( ü_list, ü_opts );
        switch ( ü_items ) {
          case SCancelButtonId:
            break;
          default:
            for ( const ü_item of ü_items ) { ü_files.push( ü_item ); }
        }
        return ü_files.length > 0;

      case EButtons.OK:
        ü_files.splice( ü_limit );
        return true;
      case EButtons.ALL:
        return true;
      case EButtons.CANCEL:
      case undefined :
      default        :
          ü_files.length = 0;
          return false;
    }
}

}

//==============================================================================

function ß_quote( ...ü_args:string[] ):string[] {
           ü_args.forEach( (ü_arg,ü_indx) => { ü_args[ ü_indx ] = `"${ ü_arg }"`; } );
    return ü_args;
}

//------------------------------------------------------------------------------

//==============================================================================
/*
*/