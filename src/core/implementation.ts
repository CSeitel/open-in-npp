/*
https://nodejs.org/api/fs.html#file-system-flags
https://code.visualstudio.com/api/references/vscode-api
*/
  import { type SpawnOptions
         } from 'child_process';
  import { type TNotReadonly
         } from '../types/generic.d';
  import { type TShadowDoc
         } from '../types/vsc.extension.d';
  import { CETrigger
         , CECliArgument
         , CEXtnCommands
         } from '../constants/extension';
  import { CEUriScheme
         } from '../constants/vsc';
  import { CRgXp
         } from '../constants/text';
//--------------------------------------------------------------------
  import { join
         , isAbsolute
         , dirname
         , basename
         } from 'path';
  import { promises as ßß_fs_p
         } from 'fs';
  import { createHash
         , Hash
         } from 'crypto';

  import { Uri
         , window
         , commands
         , TextDocument
         , workspace
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../runtime/context';
  import { ß_getConfigSnapshot
         , ß_XtnOpenInNpp
         } from '../runtime/context-XTN';
//--------------------------------------------------------------------
  import { LCDoIt
         , LCButton as LCButton
         } from '../l10n/i18n';
//------------------------------------------------------------------------------
  import { whenChildProcessSpawned
         } from '../lib/any';
  import { whenPromiseSettled
         } from '../lib/asyncUtil';
  import { straightenArray
         } from '../lib/arrayUtil';
  import { ErrorMessage
         } from '../lib/errorUtil';
  import { whenKnownAsFolder as fsWhenKnownAsFolder
         , whenFileInfoRead
         , whenTempFile
         } from '../lib/fsUtil';
  import { shortenText
         , escapeFF
         , wrapDoubleQuotes
         } from '../lib/textUtil';
  import { whenFilesFound
         , whenKnownAsFolder
         } from '../vsc/fsUtil';
//--------------------------------------------------------------------
  import { MessageButton
         , threadShowError
         } from '../vsc/ui';
  import { TButtons
         , TDropDownListOptions
         , SCancelButtonId
         , ListItem
         , DropDownList
         } from '../vsc/ui';
//====================================================================
  const CNotAPid = -1;
//====================================================================

export async function openInNppActive  ( this:null                              ):Promise<number> { return new CliArgs( CETrigger.PALETTE                   ).submit(); }
export async function openInNppEditor  ( this:null, ü_uri:Uri, ... ü_more:any[] ):Promise<number> { return new CliArgs( CETrigger.EDITOR  , ü_uri           ).submit(); }
export async function openInNppExplorer( this:null, ü_uri:Uri, ü_others  :Uri[] ):Promise<number> { return new CliArgs( CETrigger.EXPLORER, ü_uri, ü_others ).submit(); }

//====================================================================

class VirtualDocumentView {
  //
    private readonly _isInitial :boolean
    public  readonly  content   :string
    private readonly _newHash   :string
    private readonly _docView   :TShadowDoc
    private readonly _docViews  = ß_XtnOpenInNpp.shadowDocsBfr;
    private readonly _encoding  = 'utf8';
constructor(
    public  readonly  doc    :TextDocument
  , public  readonly  tempDir:string
  , public  readonly  reuse  :boolean
){
    this._isInitial = ! this._docViews.has( this.doc );
    this.content    = this.doc.getText();
    this._newHash   = createHash( 'sha1' ).update( this.content ).digest('hex');
    this._docView = this._isInitial ? { file: ''// await whenTempFile( ü_stub, '', ü_tempDir, ! ü_silent ) // silent = reuse
                                  , hash: this._newHash
                                  }
                                : this._docViews.get( this.doc )!
                                ;
}

get fileName():string {
    return this._docView.file;
}

async whenReady():Promise<this> {
    if ( this._isInitial ) {
        const ü_stub = escapeFF( CRgXp.fs_win32 )( (workspace.name??'')
                     + '-'
                     + this.doc.fileName );
        this._docView.file = await whenTempFile( ü_stub, '', this.tempDir, ! this.reuse  );
    }
    return this;
}

async updateShadow():Promise<boolean> {
    let ü_writeFlag = 'w';
    if ( this._isInitial ) {
        if ( this.reuse ) {
            const ü_info = await whenFileInfoRead( this._docView.file );
            if ( ü_info === null ) {
                ü_writeFlag = 'wx';
            } else {
                if ( ! ü_info.isFile() ) { throw new TypeError( 'Exists not as File' ); }
                const ü_content = await ßß_fs_p.readFile( this._docView.file, this._encoding );
                const ü_oldHash = createHash( 'sha1' ).update(  ü_content  ).digest('hex');
                if ( ü_oldHash === this._newHash ) { ü_writeFlag = ''; ß_trc&& ß_trc( 'Shadow is recent. No write' ); }
            }
        } else { ü_writeFlag = 'wx'; }
    } else {
        if ( this._docView.hash === this._newHash ) { ü_writeFlag = ''; ß_trc&& ß_trc( 'No update. No write.' ); }
    }
    const ü_done = ü_writeFlag.length > 0;
    if ( ü_done ) {
        await ßß_fs_p.writeFile( this._docView.file, this.content, { encoding: this._encoding
                                                                , flag    : ü_writeFlag } );
    }
    if ( this._isInitial ) {
        if ( ! this.doc.isClosed ) { this._docViews.set( this.doc, this._docView ); }
    } else {
        this._docView.hash = this._newHash;
    }
    return ü_done;
}

}

//====================================================================

class CliArgs {
    private readonly _config                   = ß_getConfigSnapshot();
    private readonly _mode         :CETrigger
  //
    private readonly _activeEditor             = window.activeTextEditor;
    private readonly _mainUri      :Uri
    private          _mainIsFolder :boolean    = false;
    private readonly _mainFsPath   :string     = '';
  //
    private readonly _all          :Uri[]
    private readonly _mainIndx     :number     = -1;
    private          _others       :string[]   = [];
    private          _asWorkspace  :boolean    = false;
  //
constructor( ü_mode:CETrigger.PALETTE                                   );
constructor( ü_mode:CETrigger.EDITOR  , ü_mainUri :Uri                  );
constructor( ü_mode:CETrigger.EXPLORER, ü_mainUri :Uri, ü_others :Uri[] );
constructor( ü_mode:CETrigger         , ü_mainUri?:Uri, ü_others?:Uri[] ){
    this._mode    = ü_mode    ;
    this._mainUri = ü_mainUri!;
    this._all     = ü_others ?? [];
  //
    switch ( this._mode ) {

      case CETrigger.PALETTE:
          if ( this._activeEditor === undefined ) {
              this._mode     = CETrigger.None;
              return;
          }
          this._mainUri      = this._activeEditor.document.uri;
          break;

      case CETrigger.EDITOR:
          break;
      case CETrigger.EXPLORER:
          const ü_a      = this._all.filter   ( ü_someUri => ü_someUri            === this._mainUri            );
          this._mainIndx = this._all.findIndex( ü_someUri => ü_someUri.toString() === this._mainUri.toString() );
          break;
    }
          this._mainFsPath   = this._mainUri.fsPath; //this._activeEditor.document.fileName;
  //
    if ( this._mainUri.scheme !== CEUriScheme.file
      && this._mode !== CETrigger.EXPLORER
       ) {
         this._mode   = CETrigger.UNTITLED;
    }
}

async whenReady():Promise<this> {
    switch ( this._mode ) {

        case CETrigger.None:
            break;

        case CETrigger.EXPLORER:
          if ( await whenKnownAsFolder( this._mainUri ) )
                                      { this._mainIsFolder = true; }
          this._others = this._all.filter( ü_someUri => ü_someUri.scheme === CEUriScheme.file )
                                  .map   ( ü_fileUri => ü_fileUri.fsPath                      );
          break;
    }
    return this;
}

private async _threadShadowDone( ü_doc:TextDocument, ü_shadowDir:string ):Promise<void> {
    try {
        await this._whenShadowDone( ü_doc, ü_shadowDir, false );
    } catch ( ü_eX ) {
        threadShowError( ü_eX, 'Shadow' );
    }
}

private async _whenShadowDone( ü_doc:TextDocument, ü_shadowDir:string, ü_silent:boolean ):Promise<string> {
    const ü_docView = await new VirtualDocumentView( ü_doc
                                                , ü_shadowDir
                                                , this._config.virtualDocumentsFileReuse ).whenReady();
  //
    if ( ü_silent ) {
        ü_docView.updateShadow();
    } else {
        const ü_open = new MessageButton( 'OK' );
        const ü_create = `Save the contents of "${ ü_doc.fileName }" as "${ ü_docView.fileName }" to be shown in Notepad++ ?`;
        const ü_todo = await window.showInformationMessage( ü_create, ü_open );
        switch ( ü_todo ) {
          case ü_open:
              ü_docView.updateShadow();
              commands.executeCommand<number>( CEXtnCommands.oEditor, Uri.file( ü_docView.fileName ) );
            break;
            try {
            } catch ( ü_eX ) {
                if ( ü_silent ) { throw ü_eX; }
                threadShowError( ü_eX, ü_create );
            }
        }
    }
    return ü_docView.fileName;
}

async submit():Promise<number> {
    try {
        return await( await this.whenReady() )._submit();
    } catch ( ü_eX ) {
        threadShowError( ü_eX, `When opening "${ this._mainFsPath }" in Notepad++` );
        return CNotAPid;
    }
}

private async _submit():Promise<number> {
  //
    switch ( this._mode ) {

      case CETrigger.None:
          window.showInformationMessage( LCDoIt.no_active_file() );
          return CNotAPid;

      case CETrigger.UNTITLED:
        //this._mode         = EModes.UNTITLED;
          const ü_doc = this._activeEditor!.document;
          const ü_temp = await this._config.whenVirtualDocsDir;
                                if ( ü_temp.length === 0 ) { this._threadShadowDone( ü_doc, ü_temp        ); return CNotAPid; }
          ( this._mainFsPath as TNotReadonly<string> ) = await this._whenShadowDone  ( ü_doc, ü_temp, true  );
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
              if ( this._mainIsFolder && this._config.openFolderAsWorkspace ) {
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
    try {
    if(ß_trc){ß_trc( `ChildProcess ${ ü_exe }  ${ ü_args}  ${ü_opts} ` );}
        const ü_pid = await whenChildProcessSpawned( ü_exe, ü_args, ü_opts );
        return ü_pid;
    } catch ( ü_eX ) {
      //ß_trc&& ß_trc( ü_eX );
        throw new ErrorMessage( LCDoIt.spawn_error,  ''+ü_eX  ).setReason( ü_eX );
    //ß_showInformationMessage( ( ü_eX as Error ).message );
      return CNotAPid;
    }
}

private _compileCursorPosition( ü_args:string[] ):void {
    if ( ! this._config.preserveCursor ) { return; }
  //
    if ( this._activeEditor === undefined ) { return; }
  //
    const ü_activeDoc = this._activeEditor.document;
    switch ( this._mode ) {
        case CETrigger.EXPLORER:
            const ü_indx = this._others.findIndex( ü_file => ü_file === ü_activeDoc.fileName );
            if ( ü_indx < 0 ) { return; }
            if ( ü_indx !== ( this._others.length - 1 ) ) {
              this._others.push( this._others[ ü_indx ] );
            }
            break;
      case CETrigger.EDITOR:
          if ( ü_activeDoc.uri.toString() !== this._mainUri.toString() ) {
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
    } else                                  { ü_args.push(       ü_verbatim ? wrapDoubleQuotes(     this._mainFsPath )[0]
                                                                            :                       this._mainFsPath   );
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
    const ü_whenCwd = await whenPromiseSettled( this._config.whenWorkingDir );
    if ( ü_whenCwd.rejected ) {
        if ( ü_whenCwd.reason instanceof ErrorMessage ) { window.showWarningMessage( ü_whenCwd.reason.text ); }
        else                                            {                      throw ü_whenCwd.reason       ; }
    } else { ü_cwd = ü_whenCwd.value; }
  //
    if ( ü_cwd.length > 0 ) {
      if ( ! isAbsolute( ü_cwd ) ) {
          ü_cwd = join( this._folderOfMain(), ü_cwd );
      }
    } else {
          ü_cwd = this._folderOfMain();
    }
  //
    return ü_cwd;
//
}

private _folderOfMain():string {
    return          this._mainIsFolder
         ?          this._mainFsPath
         : dirname( this._mainFsPath )
         ;
}

private async _whenPatternMatched( ö_pattern:string, ü_limit:number ):Promise<string[]> {
  //
    const ü_subsets = await Promise.all( this._all.map( ( ü_uri, ü_indx )=>
        ( ü_indx === this._mainIndx ? this._mainIsFolder
                                    : whenKnownAsFolder( ü_uri ) ) ? whenFilesFound( ü_uri, ö_pattern )
                                                                   :                 ü_uri
                                                          ) );
  //
    const ü_files = straightenArray( ü_subsets ).filter( ü_uri => ü_uri.scheme === CEUriScheme.file )
                                                .map   ( ü_uri => ü_uri.fsPath )
                                                ;
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
        const ü_list = ü_files.map( (ü_file,ü_indx) => new ListItem(              basename( ü_file )
                                                          , shortenText( dirname ( ü_file ), 72 )
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