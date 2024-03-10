/*
https://nodejs.org/api/fs.html#file-system-flags
*/
  import { type SpawnOptions
         } from 'child_process';
  import { type TNotReadonly
         } from '../types/generic.d';
  import { CETrigger
         , CECliArgument
         , CEXtnCommands
         } from '../constants/extension';
//--------------------------------------------------------------------
  import * as ßß_path   from 'path';
  import { join
         , isAbsolute
         } from 'path';
  import { promises as ßß_fs_p
         } from 'fs';
  import { Uri
         , FileType
         , window
         , commands
         , TextDocument
         , workspace
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../runtime/context';
  import { ß_getConfigSnapshot
         } from '../runtime/context-XTN';
//--------------------------------------------------------------------
  import { LCDoIt
         , LCButton as LCButton
         } from '../l10n/i18n';
//------------------------------------------------------------------------------
  import { whenChildProcessSpawned
         } from '../lib/any';
  import { promiseSettled
         } from '../lib/asyncUtil';
  import { ErrorMessage
         } from '../lib/errorUtil';
  import { whenKnownAsFolder
         , whenTempFile
         } from '../lib/fsUtil';
  import { shortenText
         , expandEnvVariables
         , wrapDoubleQuotes
         } from '../lib/textUtil';
  import { MessageButton
         , whenErrorShown
         } from '../vsc/ui';
  import { whenFilesFound
         } from '../vsc/fsUtil';
//--------------------------------------------------------------------
  import { TButtons
         , TDropDownListOptions
         , SCancelButtonId
         , ListItem
         , DropDownList
         } from '../vsc/ui';
//====================================================================
  type TAllModes = CETrigger.EXPLORER
                 | CETrigger.EDITOR
                 | CETrigger.PALETTE
//------------------------------------------------------------------------------
  const CNotAPid = -1;
//====================================================================

export async function openInNppActive( this:null ):Promise<number> {
    return new CliArgs( CETrigger.PALETTE                       ).submit();
}
export async function openInNppEditor( this:null, ü_fileUri:Uri, ...ü_more:any[] ):Promise<number> {
    return new CliArgs( CETrigger.EDITOR  , ü_fileUri           ).submit();
}
export async function openInNppExplorer( this:null, ü_fileUri:Uri, ü_fileUris:Uri[] ):Promise<number> {
    const ü_others = ü_fileUris.map( ü_fileUri => ü_fileUri.fsPath );
    return new CliArgs( CETrigger.EXPLORER, ü_fileUri, ü_others ).submit();
}

//====================================================================

class CliArgs {
    private static _docs = new Map<TextDocument,string>();

private static _fsPath( ü_fileUri:Uri ):string {
    switch ( ü_fileUri.scheme ) {
        case 'file':
          return ü_fileUri.fsPath;
        case 'vscode-settings':
          return expandEnvVariables( '%APPDATA%/Code/User/settings.json' );
        case 'untitled':
    }
    return '';
}

    private readonly _config                   = ß_getConfigSnapshot();
    private readonly _activeEditor             = window.activeTextEditor;
    private readonly _mode         :CETrigger
    private readonly _mainPath     :string
    private          _mainFileType :FileType   = FileType.Unknown;
    private          _others       :string[]   = [];
    private          _asWorkspace  :boolean    = false;

constructor( ü_mode:TAllModes                                     );
constructor( ü_mode:TAllModes, ü_mainUri :Uri                     );
constructor( ü_mode:TAllModes, ü_mainUri :Uri, ü_others :string[] );
constructor( ü_mode:TAllModes, ü_mainUri?:Uri, ü_others?:string[] ){
  //
    switch ( this._mode = ü_mode ) {

      case CETrigger.EXPLORER:
        if(ß_trc){ß_trc( 'Explorer Context' );}
        this._others   = ü_others !       ;
        this._mainPath = ü_mainUri!.fsPath;
        break;

      case CETrigger.EDITOR:
        this._mainFileType = FileType.File;
        this._mainPath     = CliArgs._fsPath( ü_mainUri! );
        break;

      case CETrigger.PALETTE:
        if(ß_trc){ß_trc( 'Palette Context' );}
        if ( this._activeEditor === undefined ) {
          this._mode         = CETrigger.None;
          this._mainPath     = '';
        } else if ( this._activeEditor.document.uri.scheme !== 'file' ) {
          ß_trc&& ß_trc( `ActiveEditor: ${ this._activeEditor.document.uri.scheme  }` );
          this._mode         = CETrigger.UNTITLED;
          this._mainPath     = '';
        } else {
          this._mainFileType = FileType.File;
          this._mainPath     = this._activeEditor.document.fileName;
        }
        break;

    }
}

private async _tempWithConfig( ü_tempDir:string, ü_doc:TextDocument ):Promise<string> {
    const ü_stub = (workspace.name??'') +'-'+ ü_doc.fileName;
    const ü_found = CliArgs._docs.has( ü_doc );
    const ü_file = ü_found ? CliArgs._docs.get( ü_doc )!
                           : await whenTempFile( ü_stub, '', ü_tempDir, false );
  //
    await ßß_fs_p.writeFile( ü_file, ü_doc.getText() );
    if ( ! ü_found ) { CliArgs._docs.set( ü_doc, ü_file ); }
    return ü_file;
}

private async _tempWithDialog( ü_doc:TextDocument ):Promise<void> {
    const ü_stub = (workspace.name??'') +'-'+ ü_doc.fileName;
    const ü_found = CliArgs._docs.has( ü_doc );
    const ü_file = ü_found ? CliArgs._docs.get( ü_doc )!
                           : await whenTempFile( ü_stub, '', '', true );
  //
    const ü_open = new MessageButton( 'OK' );
    const ü_create = `Save the contents of "${ ü_doc.fileName }" as "${ ü_file }" to be shown in Notepad++ ?`;
    const ü_todo = await window.showInformationMessage( ü_create, ü_open );
    switch ( ü_todo ) {
        case ü_open:
            try {
                await ßß_fs_p.writeFile( ü_file, ü_doc.getText(), { flag:'wx' } );
                if ( ! ü_found ) { CliArgs._docs.set( ü_doc, ü_file ); }
                commands.executeCommand<number>( CEXtnCommands.oEditor, Uri.file( ü_file ) );
            } catch ( ü_eX ) {
                whenErrorShown( ü_eX, ü_create );
            }
            break;
    }
}

async submit():Promise<number> {
  //
    switch ( this._mode ) {

      case CETrigger.None:
        window.showInformationMessage( LCDoIt.no_active_file() );
        return CNotAPid;

      case CETrigger.UNTITLED:
        //this._mode         = EModes.UNTITLED;
          const ü_doc = this._activeEditor!.document;
          const ü_temp = await this._config.whenVirtualDocsDir;
          if ( ü_temp.length === 0 ) {
              this._tempWithDialog( ü_doc );
              return CNotAPid;
          }
          ( this._mainPath as TNotReadonly<string> ) = await this._tempWithConfig( ü_temp, ü_doc );
        break;
      //return CNotAPid;

      case CETrigger.EXPLORER: // folders possible
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
        window.showErrorMessage( LCDoIt.spawn_error( ( ü_eX as Error ).message ) );
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
      case CETrigger.EXPLORER:
        const ü_indx = this._others.findIndex( ü_file => ü_file === ü_active );
        if ( ü_indx < 0 ) { return; }
        if ( ü_indx !== ( this._others.length - 1 ) ) {
          this._others.push( this._others[ ü_indx ] );
        }
        break;
      case CETrigger.EDITOR:
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
    ü_args.push( CECliArgument.  lineNumber + ( 1 + ü_selection.active.line      ) );
    ü_args.push( CECliArgument.columnNumber + ( 1 + ü_selection.active.character ) );
}

private async _arguments( ü_verbatim:boolean ):Promise<string[]> {
  //
    const ü_args = [];
  //
    if ( this._config.multiInst
      || this._asWorkspace                ) { ü_args.push( CECliArgument.multipleInstances      ); }
  //
    if ( this._config.skipSessionHandling ) { ü_args.push( CECliArgument.skipSessionHandling    ); }
  //
    if ( this._asWorkspace                ) { ü_args.push( CECliArgument.openFoldersAsWorkspace ); }
                 this._compileCursorPosition( ü_args );
  //
                                              ü_args.push( ... this._config.commandLineArguments );
  //
    if (   this._others.length > 0       ) {
                                              ü_args.push( ... ( ü_verbatim ? wrapDoubleQuotes( ... this._others   )
                                                                            :                       this._others   ) );
    } else                                  { ü_args.push(       ü_verbatim ? wrapDoubleQuotes(     this._mainPath )[0]
                                                                            :                       this._mainPath   );
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
        if ( ü_whenCwd.reason instanceof ErrorMessage ) { window.showWarningMessage( ü_whenCwd.reason.text ); }
        else                                            {                      throw ü_whenCwd.reason       ; }
    } else { ü_cwd = ü_whenCwd.value; }
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
      if ( this._mainFileType === FileType.Unknown )
         { this._mainFileType  =  await whenKnownAsFolder( this._mainPath )
                               ?  FileType.Directory
                               :  FileType.File
                               ;
         }
    return this._mainFileType === FileType.Directory;
}

private async _whenPatternMatched( ö_pattern:string, ü_limit:number ):Promise<string[]> {
  //
    const ö_isFolder = await Promise.all( this._others.map( (ü_file       ) => ü_file === this._mainPath ? this._whenMainIsFolder()
                                                                                                         : whenKnownAsFolder( ü_file )     ) );
    const ü_subsets  = await Promise.all( this._others.map( (ü_file,ü_indx) => ö_isFolder[ ü_indx ] ? whenFilesFound( ü_file, ö_pattern )
                                                                                                    :          [ ü_file ]            ) );
                                    const ü_files:string[] = [];
    for ( const ü_subset of ü_subsets ) { ü_files.push( ... ü_subset ); }
                                          ü_files.sort();
  //
    if ( ü_files.length > ü_limit ) {
      await this._whenSelected( ü_files, ü_limit );
    } else {
      window.showInformationMessage( LCDoIt.file_hits( this._others.length, ö_pattern ) );
    }
  //
    return ü_files;
}

private async _whenSelected( ü_files:string[], ü_limit:number ):Promise<boolean> {
  //
    const ü_todo = ü_limit > 0
                 ? await window.showInformationMessage( LCDoIt.max_items( ü_limit, ü_files.length )
                       , { title: LCButton.OK    () , id: LCButton.OK     }
                       , { title: LCButton.SELECT() , id: LCButton.SELECT }
                       , { title: LCButton.ALL   () , id: LCButton.ALL    }
                       )
                 : { id: LCButton.SELECT }
                 ;
    if(ß_trc){ß_trc( `Button: ${ ü_todo }` );}
  //
    switch ( ü_todo?.id ) {

      case LCButton.SELECT:
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

      case LCButton.OK:
        ü_files.splice( ü_limit );
        return true;
      case LCButton.ALL:
        return true;
      case LCButton.CANCEL:
      case undefined :
      default        :
          ü_files.length = 0;
          return false;
    }
}

}

//====================================================================
/*
*/