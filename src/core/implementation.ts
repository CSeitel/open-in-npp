/*
https://nodejs.org/api/fs.html#file-system-flags
https://code.visualstudio.com/api/references/vscode-api
*/
  import { type SpawnOptions
         } from 'child_process';
  import { type TNotReadonly
         , type TWritable
         } from '../types/generic.d';
  import { type TShadowDoc
         } from '../types/vsc.extension.d';
  import { CETrigger
         , CECliArgument
         , CEXtnCommands
         } from '../constants/extension';
  import {
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
         } from 'crypto';
  import { Uri
         , window
         , TextDocument
         , workspace
         } from 'vscode';
//--------------------------------------------------------------------
  import { ß_trc
         , ß_err
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
         , putLastIndex
         } from '../lib/arrayUtil';
  import { ErrorMessage
         } from '../lib/errorUtil';
  import { whenFileInfoRead
         , whenTempFile
         } from '../lib/fsUtil';
  import { shortenText
         , escapeFF
         , wrapDoubleQuotes
         } from '../lib/textUtil';
  import { whenFilesFound
         , whenKnownAsFolder
         , hasFileScheme
         , uriToFile
         , matchingUris
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

export async function openInNppActive  (                           ):Promise<number> { return new CliArgs( CETrigger.PALETTE                    ).submit(); }
export async function openInNppEditor  ( ü_uri:Uri                 ):Promise<number> { return new CliArgs( CETrigger.EDITOR  , ü_uri            ).submit(); }
export async function openInNppExplorer( ü_uri:Uri, ü_all:Uri[]    ):Promise<number> { return new CliArgs( CETrigger.EXPLORER, ü_uri    , ü_all ).submit(); }
       async function openInNppShadow  ( ü_doc:VirtualDocumentView ):Promise<number> { return new CliArgs( CETrigger.EDITOR  , ü_doc.uri, ü_doc ).submit(); }

//====================================================================

class VirtualDocumentView {
  //
    private readonly _isInitial :boolean
    public  readonly  content   :string
    private readonly _newHash   :string
    private readonly _docViewBE :TShadowDoc
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
    this._docViewBE = this._isInitial ? { file: ''// await whenTempFile( ü_stub, '', ü_tempDir, ! ü_silent ) // silent = reuse
                                  , hash: this._newHash
                                  }
                                : this._docViews.get( this.doc )!
                                ;
}

get uri     ():Uri    { return Uri.file( this._docViewBE.file ); }
get fileName():string { return           this._docViewBE.file  ; }

async whenReady():Promise<this> {
    if ( this._isInitial ) {
        const ü_stub = escapeFF( CRgXp.fs_win32 )( (workspace.name??'')
                     + '-'
                     + this.doc.fileName );
        this._docViewBE.file = await whenTempFile( ü_stub, '', this.tempDir, ! this.reuse  );
    }
    return this;
}

async updateShadow():Promise<boolean> {
    let ü_writeFlag = 'w';
    if ( this._isInitial ) {
        if ( this.reuse ) {
            const ü_info = await whenFileInfoRead( this._docViewBE.file );
            if ( ü_info === null ) {
                ü_writeFlag = 'wx';
            } else {
                if ( ! ü_info.isFile() ) { throw new TypeError( 'Exists not as File' ); }
                const ü_content = await ßß_fs_p.readFile( this._docViewBE.file, this._encoding );
                const ü_oldHash = createHash( 'sha1' ).update(  ü_content  ).digest('hex');
                if ( ü_oldHash === this._newHash ) { ü_writeFlag = ''; ß_trc&& ß_trc( 'Shadow is recent. No write' ); }
            }
        } else { ü_writeFlag = 'wx'; }
    } else {
        if ( this._docViewBE.hash === this._newHash ) { ü_writeFlag = ''; ß_trc&& ß_trc( 'No update. No write.' ); }
    }
    const ü_done = ü_writeFlag.length > 0;
    if ( ü_done ) {
        await ßß_fs_p.writeFile( this._docViewBE.file, this.content, { encoding: this._encoding
                                                                , flag    : ü_writeFlag } );
    }
    if ( this._isInitial ) {
        if ( ! this.doc.isClosed ) { this._docViews.set( this.doc, this._docViewBE ); }
    } else {
        this._docViewBE.hash = this._newHash;
    }
    return ü_done;
}

}

//====================================================================

class CliArgs {
    private readonly _config                   = ß_getConfigSnapshot();
    private readonly _mode         :CETrigger
  //
    private readonly _mainUri      :Uri
    private readonly _mainIsFolder :boolean    = false;
  //private readonly _mainIsFs     :boolean
  //
    private readonly _ref          :VirtualDocumentView|null = null;
    private          _others       :Uri[]      = [];
    private          _asWorkspace  :boolean    = false;
  //
constructor( ü_mode:CETrigger.PALETTE                                                       )
constructor( ü_mode:CETrigger.EDITOR  ,   mainUri :Uri,   others?:      VirtualDocumentView )
constructor( ü_mode:CETrigger.EXPLORER,   mainUri :Uri,   others :Uri[]                     )
constructor( ü_mode:CETrigger         , ü_mainUri?:Uri, ü_others?:Uri[]|VirtualDocumentView ){
    this._mode    = ü_mode    ;
    this._mainUri = ü_mainUri!;
    this._others  = Array.isArray( ü_others ) ? ü_others
                                              : [];
  //
    switch ( this._mode ) {

        case CETrigger.PALETTE:
          if ( window.activeTextEditor === undefined )
               { this._mode    = CETrigger.None                      ; }
          else { this._mainUri = window.activeTextEditor.document.uri; }
          break;
        case CETrigger.EDITOR:
          if ( ü_others instanceof VirtualDocumentView ) { this._ref = ü_others; }
          break;
        case CETrigger.EXPLORER:
          break;

    }
}

private get _hasNoFileScheme():boolean {
    return ! hasFileScheme( this._mainUri );
}

private _setShadow( ü_ref:VirtualDocumentView ):this {
            ( this._ref     as TNotReadonly<VirtualDocumentView> ) = ü_ref; // silent without UI
            ( this._mode    as TNotReadonly<CETrigger          > ) = CETrigger.EDITOR;
            ( this._mainUri as TNotReadonly<Uri                > ) = this._ref!.uri;
  //
    return this;
}

async whenReady():Promise<this> {
    let ü_shadow = false;

    switch ( this._mode ) {

        case CETrigger.None:
            window.showInformationMessage( LCDoIt.no_active_file() );
            break;
        case CETrigger.PALETTE:
        case CETrigger.EDITOR:
            ü_shadow = this._hasNoFileScheme;
            break;

        case CETrigger.EXPLORER: // folders possible
          if ( await whenKnownAsFolder( this._mainUri ) ) {
              ( this._mainIsFolder as TNotReadonly<boolean> ) = true;
          } else {
          }
        //
          const ü_pattern = this._config.filesInFolderPattern;
          if ( ü_pattern.length > 0 ) { // only go for files
              
              if ( 0 === await this._whenPatternMatched( ü_pattern, this._config.matchingFilesLimit ) ) {
            ( this._mode    as TNotReadonly<CETrigger          > ) = CETrigger.None;
              }
              if ( this._config.openFolderAsWorkspace ) {} // ignored
          } else {
              if ( this._config.openFolderAsWorkspace ) { this._asWorkspace = true; }
              if ( ! this._mainIsFolder ) {
                  ü_shadow = this._hasNoFileScheme;
                  if ( ü_shadow ) { this._others.length = 0; }
              }
          }
          break;
    }
  //
    if ( ü_shadow ) {
        const ü_doc  = await workspace.openTextDocument( this._mainUri );//. this._activeEditor!.document;
        const ü_temp = await this._config.whenVirtualDocsDir;
        if ( ü_temp.length === 0 ) {
              this._threadShadowDone( ü_doc, ü_temp );
            ( this._mode    as TNotReadonly<CETrigger          > ) = CETrigger.None;
        } else {
            this._setShadow( await this._whenShadowReady( ü_doc, ü_temp, true ) // silent without UI
                                                                              );// switch to Editor mode
        }
    }
  //
    return this;
}

private async _submit():Promise<number> {
  //
    switch ( this._mode ) {

      case CETrigger.None:
          return CNotAPid;

      case CETrigger.EXPLORER:
          break;

    }
  //
    const ü_exe  = await this._config.whenExecutable;
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
        ß_trc&& ß_trc( [ ü_exe, ü_args, ü_opts ], 'Child-process' );
        const ü_pid = await whenChildProcessSpawned( ü_exe, ü_args, ü_opts );
        return ü_pid;
    } catch ( ü_eX ) {
      //ß_trc&& ß_trc( ü_eX );
        throw new ErrorMessage( LCDoIt.spawn_error,  ''+ü_eX  ).setReason( ü_eX );
    //ß_showInformationMessage( ( ü_eX as Error ).message );
      return CNotAPid;
    }
}

async submit():Promise<number> {
    try {
        return await( await this.whenReady() )._submit();
    } catch ( ü_eX ) {
        threadShowError( ü_eX, `When opening "${ this._mainUri }" in Notepad++` );
        return CNotAPid;
    }
}

private async _threadShadowDone( ü_doc:TextDocument, ü_shadowDir:string ):Promise<void> {
    try {
        const ü_docView = await this._whenShadowReady( ü_doc, ü_shadowDir, false ); // not silent with UI
    } catch ( ü_eX ) {
        threadShowError( ü_eX, 'Shadow' );
    }
}

private async _whenShadowReady( ü_doc:TextDocument, ü_shadowDir:string, ü_silent:boolean ):Promise<VirtualDocumentView> {
    const ü_docView = await new VirtualDocumentView( ü_doc
                                                   , ü_shadowDir
                                                   , this._config.virtualDocumentsFileReuse ).whenReady();
  //
    if ( ü_silent ) {
        ü_docView.updateShadow();
    } else {
        const ü_yes    = new MessageButton( 'YES' );
        const ü_create = LCDoIt.createShadow( ü_doc.fileName, ü_docView.fileName );
        const ü_todo = await window.showInformationMessage( ü_create, ü_yes );
        switch ( ü_todo ) {
          case ü_yes:
              ü_docView.updateShadow();
              openInNppShadow( ü_docView );
            break;
        }
    }
    return ü_docView;
}

private async _compileCursorPosition( ü_args:string[], ü_others:Uri[] ):Promise<void> {
    const ü_editor = window.activeTextEditor;
    if ( ü_editor === undefined ) { return; }
    const ü_uriWithCursor = ü_editor.document.uri;
  //
    switch ( this._mode ) {

        case CETrigger.EXPLORER:
            const ü_indx = ü_others.findIndex( ü_uri => matchingUris( ü_uri, ü_uriWithCursor ) );
            if ( ü_indx < 0 ) { return; }
            putLastIndex( this._others, ü_indx );
            break;

        case CETrigger.EDITOR:
            const ü_doc = await workspace.openTextDocument( ü_uriWithCursor );
            if ( ü_doc == this._ref?.doc ) {
               1 == 1;
            } 
            if ( ! matchingUris( ü_uriWithCursor, this._ref === null ? this._mainUri
                                                                     : this._ref.doc.uri ) ) { return; }
            break;

    }
  //
    const ü_selection = ü_editor.selection;
    if (   ü_selection === null
      || ! ü_selection.isEmpty ) { return; }
  //
    ü_args.push( CECliArgument.  lineNumber + ( 1 + ü_selection.active.line      ) );
    ü_args.push( CECliArgument.columnNumber + ( 1 + ü_selection.active.character ) );
}

private async _arguments( ü_verbatim:boolean ):Promise<string[]> {
    if ( this._mode !== CETrigger.EXPLORER )
       { this._others.push( this._mainUri ); }
    const ü_others = this._others;
  //
    const ü_args = [];
  //
    if ( this._config.multiInst
      || this._asWorkspace                ) { ü_args.push( CECliArgument.multipleInstances      ); }
  //
    if ( this._config.skipSessionHandling ) { ü_args.push( CECliArgument.skipSessionHandling    ); }
  //
    if ( this._asWorkspace                ) { ü_args.push( CECliArgument.openFoldersAsWorkspace ); }
    if ( this._config.preserveCursor ) {
           await this._compileCursorPosition( ü_args, this._others ); }
  //
                                              ü_args.push( ... this._config.commandLineArguments );
  //
    const ü_items = this._others.filter( hasFileScheme ).map( uriToFile );
    const ü_todo  = ( ü_verbatim ? wrapDoubleQuotes( ... ü_items )
                                 :                       ü_items );
                                              ü_args.push( ... ü_todo );
  //
    return ü_args;
}

private async _options():Promise<SpawnOptions> {
    const ü_more = this._config.spawnOptions;
  //
    const ü_opts:SpawnOptions =
      { stdio   : 'ignore'
      , detached: this._config.decoupledExecution
      , cwd     :  ü_more.cwd === undefined ? await this._cwd()
                                            : '' //
      };
  //
    Object.assign( ü_opts, ü_more );
  //
    return ü_opts;
}

private async _cwd():Promise<string> {
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
    return                       this._hasNoFileScheme
         ? ''
         :                       this._mainIsFolder
           ?          uriToFile( this._mainUri )
           : dirname( uriToFile( this._mainUri ) )
         ;
}

private async _whenPatternMatched( ö_pattern:string, ü_limit:number ):Promise<number> {
    const ü_others = this._others;
  //
    const ü_subsets = await Promise.all( ü_others.map(  async ( ü_uri )=>
        ( matchingUris( ü_uri, this._mainUri ) ? this._mainIsFolder
                                               : await whenKnownAsFolder( ü_uri ) ) ? await whenFilesFound( ü_uri, ö_pattern )
                                                                                    :                       ü_uri
                                                      ) );
  //
    const ü_files = straightenArray( ü_subsets );
        //ü_files.sort();
  //
    if ( ü_files.length > ü_limit ) {
        await this._whenSelected( ü_files, ü_limit );
    } else {
        window.showInformationMessage( LCDoIt.file_hits( ü_files.length, ö_pattern ) );
    }
  //
    ü_others.length = 0;
    ü_others.push( ... ü_files );
    return ü_files.length;
}

private async _whenSelected( ü_files:Uri[], ü_limit:number ):Promise<boolean> {
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
        const ü_list = ü_files.map( (ü_file,ü_indx) => new ListItem(     basename( ü_file.fsPath )
                                                          , shortenText( dirname ( ü_file.fsPath ), 72 )
                                                          ,                        ü_file
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