/*
*/
  import { type SpawnOptions
         } from 'child_process';
//--------------------------------------------------------------------
  import * as ßß_path   from 'path';
  import { join
         , isAbsolute
         } from 'path';
  import { promises as ßß_fs_p
         } from 'fs';
  import { Uri
         , window
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../runtime/context';
  import { ß_getConfigSnapshot
         } from '../runtime/context-XTN';
//--------------------------------------------------------------------
  import   ßß_i18n
           from '../i18n';
  import { EButtons as EButtons
         } from '../i18n';
//------------------------------------------------------------------------------
  import { whenChildProcessSpawned
         } from '../lib/any';
  import { promiseSettled
         } from '../lib/asyncUtil';
  import { whenTempFile
         } from '../lib/fsUtil';
  import { shortenText
         , expandEnvVariables
         } from '../lib/textUtil';
  import { findFiles
         , whenKnownAsFolder
         } from '../vsc/fsUtil';
//--------------------------------------------------------------------
  import { TButtons
         , TDropDownListOptions
         , SCancelButtonId
         , ListItem
         , DropDownList
         } from '../vsc/ui';
//--------------------------------------------------------------------
  import ß_showInformationMessage = window.showInformationMessage ;
  import ß_showErrorMessage       = window.showErrorMessage       ;
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
    , UNTITLED
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

export async function openInNppActive( this:null ):Promise<number> {
    if(ß_trc){ß_trc( 'Palette Context' );}
  //
    const ü_args = new CLIArgs( EModes.PALETTE );
    return ü_args.submit();
}

export async function openInNppEditor( this:null, ü_fileUri:Uri, ...ü_more:any[] ):Promise<number> {
    if(ß_trc){ß_trc( `Editor Context: ${ arguments.length }` );}
  //
    const ü_args = new CLIArgs( EModes.EDITOR, ü_fileUri );
    return ü_args.submit();
}

export async function openInNppExplorer( this:null, ü_fileUri:Uri, ü_fileUris:Uri[] ):Promise<number> {
    if(ß_trc){ß_trc( 'Explorer Context' );}
  //
    const ü_others = ü_fileUris.map( ü_fileUri => ü_fileUri.fsPath );
  //
    const ü_args = new CLIArgs( EModes.EXPLORER, ü_fileUri, ü_others );
    return ü_args.submit();
}

//==============================================================================

class CLIArgs {
    private readonly _config                   = ß_getConfigSnapshot();
    private readonly _activeEditor             = window.activeTextEditor;
    private readonly _mode         :EModes
    private readonly _mainPath     :string
    private          _mainFileType :EFileTypes = EFileTypes.UNKNOWN;
    private          _others       :string[]   = [];
    private          _asWorkspace  :boolean    = false;

constructor( ü_mode:TAllModes                                               );
constructor( ü_mode:TAllModes, ü_mainUri :Uri                     );
constructor( ü_mode:TAllModes, ü_mainUri :Uri, ü_others :string[] );
constructor( ü_mode:TAllModes, ü_mainUri?:Uri, ü_others?:string[]
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
        } else if ( this._activeEditor.document.isUntitled ) {
          this._mode         = EModes.UNTITLED;
          this._mainPath     = '';
        } else {
          this._mainFileType = EFileTypes.FILE;
          this._mainPath     = this._activeEditor.document.fileName;
        }
        break;

    }
}

static _fsPath( ü_fileUri:Uri ):string {
    switch ( ü_fileUri.scheme ) {
        case 'file':
          return ü_fileUri.fsPath;
        case 'vscode-settings':
          return expandEnvVariables( '%APPDATA%/Code/User/settings.json' );
        case 'untitled':
    }
    return '';
}

async submit():Promise<number> {
  //
    switch ( this._mode ) {

      case EModes.NOFILE:
        ß_showInformationMessage( ßß_i18n.no_active_file() );
        return CNotAPid;

      case EModes.UNTITLED:
        //this._mode         = EModes.UNTITLED;
          const ü_doc = this._activeEditor!.document;
          const ü_file = await whenTempFile( ü_doc.fileName );
          await ßß_fs_p.writeFile( ü_file, ü_doc.getText() );
          ( this._mainPath as any  ) = ü_file;
        break;
      //return CNotAPid;

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
      let ü_exe  = await this._config.whenExecutable;
    const ü_opts = await this._options();
  //
    const ü_verbatim = !!ü_opts.windowsVerbatimArguments === true;
    if ( ü_verbatim ) {
      ß_trc&& ß_trc( `windowsVerbatimArguments: ${ ü_opts.windowsVerbatimArguments }` );
    }
    const ü_args = await this._arguments( ü_verbatim );
    if ( ü_args.length === 0 ) { return CNotAPid; }
  //
    if(ß_trc){ß_trc( `ChildProcess ${ ü_exe }  ${ ü_args}  ${ü_opts} ` );}
    try {
      const ü_pid =  await whenChildProcessSpawned( ü_exe, ü_args, ü_opts );
      return ü_pid;
    } catch ( ü_eX ) {
        ß_trc&& ß_trc( ü_eX );
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
      , cwd     : await this._cwd( ü_more.cwd as string )
      };
  //
    Object.assign( ü_opts, ü_more );
  //
    return ü_opts;
}

private async _cwd( ü_skip:string|undefined ):Promise<string> {
    if ( ü_skip !== undefined ) { return ''; }
  //
    let ü_cwd = '';
    const ü_whenCwd = await promiseSettled( this._config.whenWorkingDir );
    if ( ü_whenCwd.rejected ) {
        window.showWarningMessage( ''+ü_whenCwd.reason );
        ß_trc&& ß_trc( ü_whenCwd.reason );
    } else {
        ü_cwd = ü_whenCwd.value;
    }
  //
    if ( ü_cwd.length > 0 ) {
      if ( ! isAbsolute( ü_cwd ) ) {
       ü_cwd = join( await this._whenMainFolder(), ü_cwd );
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
         { this._mainFileType  =  await whenKnownAsFolder( this._mainPath )
                               ?  EFileTypes.FOLDER
                               :  EFileTypes.FILE
                               ;
         }
    return this._mainFileType === EFileTypes.FOLDER;
}

private async _whenPatternMatched( ö_pattern:string, ü_limit:number ):Promise<string[]> {
  //
    const ö_isFolder = await Promise.all( this._others.map( (ü_file       ) => ü_file === this._mainPath ? this._whenMainIsFolder()
                                                                                                         : whenKnownAsFolder( ü_file )     ) );
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