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
  import { type TDropDownListOptions
         } from '../vsc/uiUtil';
  import { CETrigger
         , CECliArgument
         , CETraceIds
         } from '../constants/extension';
  import { CRgXp
         } from '../constants/text';
//--------------------------------------------------------------------
  import { join
         , isAbsolute
         , dirname
         , basename
         } from 'path';
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
         , LCHeader
         } from '../l10n/i18n';
  import { CButton
         } from '../l10n/ui';
//------------------------------------------------------------------------------
  import { whenChildProcessSpawned
         } from '../lib/cpUtil';
  import { whenPromiseSettled
         } from '../lib/asyncUtil';
  import { straightenArray
         , putLastIndex
         } from '../lib/arrayUtil';
  import { ErrorMessage
         , toErrorMessage
         } from '../lib/errorUtil';
  import { whenFileInfoRead
         , getTempFolder
         , whenTempFile
         , whenFileWritten
         , whenFileRead
         } from '../lib/fsUtil';
  import { shortenText
         , escapeFF
         , wrapDoubleQuotes
         } from '../lib/textUtil';
  import { whenFilesFound
         , whenKnownAsFolder
         , hasFileScheme
         , hasNoFileScheme
         , uriToFile
         , matchingUris
         , formatUri
         } from '../vsc/fsUtil';
//--------------------------------------------------------------------
  import { MessageButton
         , threadShowError
         , SCancelButtonId
         , whenFolderSelected
         , ListItem
         , DropDownList
         } from '../vsc/uiUtil';
//====================================================================
  const CNotAPid = -1;
//====================================================================

export async function openInNppActive  (                           ):Promise<number> { return new CliArgs( CETrigger.PALETTE                    ).submit(); }
export async function openInNppEditor  ( ü_uri:Uri                 ):Promise<number> { return new CliArgs( CETrigger.EDITOR  , ü_uri            ).submit(); }
export async function openInNppExplorer( ü_uri:Uri, ü_all:Uri[]    ):Promise<number> { return new CliArgs( CETrigger.EXPLORER, ü_uri    , ü_all ).submit(); }
       async function ß_openInNppShadow( ü_doc:VirtualDocumentView ):Promise<number> { return new CliArgs( CETrigger.EDITOR  , ü_doc.uri, ü_doc ).submit(); }

//====================================================================

class VirtualDocumentView {
  //
    private readonly _isInitial :boolean
    public  readonly  content   :string
    private readonly _newHash   :string
    private readonly _docViewBE :TShadowDoc
    private readonly _docViews  = ß_XtnOpenInNpp.shadowDocsBfr;
    private readonly _encoding  = 'utf8';
    public  readonly whenReady:Promise<this> 
constructor(
    public  readonly  doc      :TextDocument
  , public  readonly  reuse    :boolean
  ,                 ü_shadowDir:string
){
    this._isInitial = ! this._docViews.has( this.doc );
    this.content    = this.doc.getText();
    this._newHash   = createHash( 'sha1' ).update( this.content ).digest('hex');
    this._docViewBE = this._isInitial
                    ? { file: ''// await whenTempFile( ü_stub, '', ü_tempDir, ! ü_silent ) // silent = reuse
                      , hash: this._newHash
                      }
                    : this._docViews.get( this.doc )!
                    ;
    this.whenReady  = this._isInitial ? this._whenReady( ü_shadowDir )
                                      : Promise.resolve( this );
}

get uri     ():Uri    { return Uri.file( this._docViewBE.file ); }
get fileName():string { return           this._docViewBE.file  ; }

private _compileFsStub():string {
    const ü_sep = '\u2014'; //'-\u2e3a'
    const ü_uri      = this.doc.uri;
    const ü_wsName   = workspace.name;
    const ü_wsFolder = workspace.getWorkspaceFolder( ü_uri );
      let ü_stub     = ( ü_wsName ?? ' ' ) + ü_sep;
    if ( ü_wsFolder === undefined ) {
          ü_stub    += decodeURI(          ü_uri.toString().replace( ':', ü_sep ) )
    } else {
          ü_stub    += ü_wsFolder.name
                     + ü_sep
                     + decodeURI( ü_wsFolder.uri.toString().replace( ':', ü_sep ) )
                     + workspace.asRelativePath( ü_uri, false )
                     ;
    }
    return escapeFF( CRgXp.fs_win32 )( ü_stub );
}

private async _whenReady( ü_shadowDir:string ):Promise<this> {
    this._docViewBE.file = await whenTempFile( this._compileFsStub(), '', ü_shadowDir, ! this.reuse  );
    return this;
}

async whenShadowUpToDate( ü_resetShadowDir?:string ):Promise<this> {
    if ( ü_resetShadowDir ) {
        await this._whenReady( ü_resetShadowDir );
    }
  //
    let ü_writeFlag = 'w';
    if ( this._isInitial ) {
        if ( this.reuse ) {
            const ü_info = await whenFileInfoRead( this._docViewBE.file );
            if ( ü_info === null ) {
                ü_writeFlag = 'wx';
            } else {
                if ( ! ü_info.isFile() ) { throw new ErrorMessage( '"{0}" exists, but is not a file', this._docViewBE.file ); }
                const ü_content = await whenFileRead( this._docViewBE.file, this._encoding );
                const ü_oldHash = createHash( 'sha1' ).update(  ü_content  ).digest('hex');
                if ( ü_oldHash === this._newHash ) { ü_writeFlag = ''; }
            }
        } else { ü_writeFlag = 'wx'; }
    } else {
        if ( this._docViewBE.hash === this._newHash ) { ü_writeFlag = ''; }
    }
    const ü_done = ü_writeFlag.length > 0;
    if ( ü_done ) {
        ß_trc&& ß_trc( `Updating shadow "${ this._docViewBE.file }"`, CETraceIds.shadowDoc );
        await whenFileWritten( this._docViewBE.file, this.content, { encoding: this._encoding
                                                                   , flag    : ü_writeFlag } );
    } else {
        ß_trc&& ß_trc( 'Shadow is recent. No write', CETraceIds.shadowDoc );
    }
    if ( this._isInitial ) {
        if ( ! this.doc.isClosed ) { this._docViews.set( this.doc, this._docViewBE ); }
    } else {
        this._docViewBE.hash = this._newHash;
    }
    return this;
  //return ü_done;
}

}

//====================================================================

class CliArgs {
    private readonly _config                   = ß_getConfigSnapshot();
    private readonly _whenReady    :Promise<boolean>
    private readonly _mode         :CETrigger
  //
    private readonly _mainUri      :Uri
    private readonly _mainIsFolder :boolean    = false;
  //
    private readonly _ref          :VirtualDocumentView|null
                                               = null;
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
          if ( window.activeTextEditor === undefined ) {
              window.showInformationMessage( LCDoIt.no_active_file() );
              this._whenReady = Promise.resolve( false );
              return;
          }
          else { this._mainUri = window.activeTextEditor.document.uri; }
          break;
        case CETrigger.EDITOR:
          if ( ü_others instanceof VirtualDocumentView ) { this._ref = ü_others; }
          break;
    }
    this._whenReady = this.whenReady();
}

private _setShadow( ü_ref:VirtualDocumentView ):this {
            ( this._ref          as TNotReadonly<VirtualDocumentView> ) = ü_ref; // silent without UI
            ( this._mode         as TNotReadonly<CETrigger          > ) = CETrigger.EDITOR;
            ( this._mainUri      as TNotReadonly<Uri                > ) = this._ref!.uri;
            ( this._mainIsFolder as TNotReadonly<boolean            > ) = false;
  //
    return this;
}

private async whenReady():Promise<boolean> {
    let ü_refUri:Uri|null = null;

    switch ( this._mode ) {

      case CETrigger.PALETTE:
      case CETrigger.EDITOR:
          if ( hasNoFileScheme( this._mainUri ) ) { ü_refUri = this._mainUri; }
          break;

      case CETrigger.EXPLORER: // folders possible
          if ( await whenKnownAsFolder( this._mainUri ) ) {
              ( this._mainIsFolder as TNotReadonly<boolean> ) = true;
          }
      //
          const ü_pattern = this._config.filesInFolderPattern;
          if ( ü_pattern.length > 0 ) {
            // only go for files
              const ü_hits = await this._whenPatternMatched( ü_pattern, this._config.matchingFilesLimit );
              if ( ü_hits === 0 ) {
                  return false;
              }
              const ü_others = this._others.filter( hasFileScheme );
              if ( ü_others.length > 0 ) {
                                  this._others = ü_others;
              } else { ü_refUri = this._others[0];
                                  this._others.length = 0;
              }
          } else {
            // folders possible
              if ( this._config.openFolderAsWorkspace ) { this._asWorkspace = true; }
            //
              const ü_others = this._others.filter( hasFileScheme );
              if ( ü_others.length > 0 ) {
                                  this._others = ü_others;
              } else if ( this._mainIsFolder ) {
                  const ö_isNoFolder = await Promise.all( this._others.map(  async ( ü_uri, ü_indx )=>
                          ü_indx > 0 ? !( await whenKnownAsFolder( ü_uri ) )
                                     : false
                      ) );
                       ü_refUri = this._others.find(  ( ü_uri, ü_indx )=>ö_isNoFolder[ ü_indx ]  ) ?? null;
                                  this._others.length = 0;
                  if ( ü_refUri === null ) { window.showInformationMessage( LCDoIt.only_folders() );
                                             return false; }
              } else { ü_refUri = this._others[0];
                                  this._others.length = 0;
              }
          }
          break;
    }
  //
    if ( ü_refUri !== null ) {
        const ü_refDoc    = await workspace.openTextDocument( ü_refUri );
        const ü_shadowDir = await this._config.whenVirtualDocsDir;
        if ( ü_shadowDir.length === 0 ) {
            this._threadShadowDone( ü_refDoc );
            return false;
        }
            this._setShadow( await this._whenShadowReady( ü_refDoc, ü_shadowDir, true ) // silent without UI
                                                                                 );// switch to Editor mode
    }
  //
    return true;
}

private async _submit():Promise<number> {
  //
    const ü_opts = await this._options();
    const ü_exe  = await this._config.whenExecutable;
  //
    const ü_args = this._arguments( ü_opts.windowsVerbatimArguments ?? false );
    if ( ü_args.length === 0 ) { return CNotAPid; }
  //
    try {
        const ü_cp = await whenChildProcessSpawned( ü_exe, ü_args, ü_opts );
        ß_trc&& ß_trc( [ ü_exe, ü_args, ü_opts, ü_cp ], `ChildProcess[${ ü_cp.pid }]` );
        return ü_cp.pid;
    } catch ( ü_eX ) {
        throw new ErrorMessage( LCDoIt.spawn_error, toErrorMessage( ü_eX ) )
                              .setReason( ü_eX )
                              .setContext( { executable:ü_exe, arguments:ü_args, options:ü_opts } );
    }
}

private _arguments( ü_verbatim:boolean ):string[] {
  //
    let ü_others:Uri[]
    switch ( this._mode ) {
        case CETrigger.EXPLORER:
            ü_others = this._others;
            break;
        case CETrigger.PALETTE:
        case CETrigger.EDITOR:
            ü_others = [ this._mainUri ];
            break;
    }
  //
    const ü_args = [];
  //
    if ( this._config.multiInst
      || this._asWorkspace                ) { ü_args.push( CECliArgument.multipleInstances      ); }
  //
    if ( this._config.skipSessionHandling ) { ü_args.push( CECliArgument.skipSessionHandling    ); }
  //
    if ( this._asWorkspace                ) { ü_args.push( CECliArgument.openFoldersAsWorkspace ); }
    if ( this._config.preserveCursor      ) {
                 this._compileCursorPosition( ü_args, ü_others ); }
  //
                                              ü_args.push( ... this._config.commandLineArguments );
  //
    const ü_items = ü_verbatim ? wrapDoubleQuotes( ... ü_others.map( uriToFile ) )
                               :                       ü_others.map( uriToFile )
                               ;
                                              ü_args.push( ... ü_items );
  //
    return ü_args;
}

private _compileCursorPosition( ü_args:string[], ü_others:Uri[] ):void {
    const ü_editor = window.activeTextEditor;
    if ( ü_editor === undefined ) { return; }
    const ü_uriWithCursor = ü_editor.document.uri;
  //
    switch ( this._mode ) {

        case CETrigger.PALETTE:
        case CETrigger.EDITOR:
          //const ü_doc = await workspace.openTextDocument( ü_uriWithCursor );
          //if ( ü_doc == this._ref?.doc ) { 1 == 1; } 
            if ( ! matchingUris( ü_uriWithCursor, this._ref === null ? this._mainUri
                                                                     : this._ref.doc.uri ) ) { return; }
            break;

        case CETrigger.EXPLORER:
            const ü_indx = ü_others.findIndex( ü_uri => matchingUris( ü_uri, ü_uriWithCursor ) );
            if ( ü_indx < 0 ) { return; }
            putLastIndex( ü_others, ü_indx );
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

private async _options():Promise<SpawnOptions> {
    const ü_more = this._config.spawnOptions;
  //
    const ü_opts:SpawnOptions =
      { stdio   : 'ignore'
      , detached: this._config.decoupledExecution
      , cwd     : ü_more.cwd === undefined ? await this._cwd()
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
    return      hasNoFileScheme( this._mainUri )
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

private async _whenSelected( ü_uris:Uri[], ö_limit:number ):Promise<boolean> {
  //
    const ü_todo = ö_limit === 0
                 ?               { _button: CButton.selectFiles }
                 : await window.showInformationMessage( LCDoIt.max_items( ö_limit, ü_uris.length )
                       , new MessageButton( CButton.OK          )
                       , new MessageButton( CButton.selectFiles )
                       , new MessageButton( CButton.selectAll   )
                       )
                 ;
  //
    switch ( ü_todo?._button ) {

      case CButton.selectFiles: {
          const ü_list = ü_uris.map( (ü_ri,ü_indx) => new ListItem(     basename( ü_ri.fsPath )
                                                            , shortenText( dirname ( ü_ri.fsPath ), 72 )
                                                            ,                        ü_ri
                                                            ).setPicked( ü_indx < ö_limit ) );
          ü_uris.length = 0;
        //
          const ü_opts:TDropDownListOptions<never> =
            { header: LCDoIt.confirmSelection()
            };
             const ü_items = await DropDownList.whenItemsPicked( ü_list, ü_opts );
          switch ( ü_items ) {
              case SCancelButtonId:
                break;
              default:
                for ( const ü_item of ü_items ) { ü_uris.push( ü_item ); }
          }
        //
          return ü_uris.length > 0;
      }
    //
      case CButton.OK      : ü_uris.length = ö_limit; return true;
      case CButton.selectAll     :                          return true;
    //
      case CButton.CANCEL  :
      case undefined :
      default        : ü_uris.length = 0; return false;
    }
}

async submit():Promise<number> {
    try {
        if ( await this._whenReady ) {
            return await this._submit();
        }
    } catch ( ü_eX ) {
        threadShowError( ü_eX
                       , LCDoIt.context( formatUri( this._mainUri ) ) );
    }
    return CNotAPid;
}

private async _threadShadowDone( ü_doc:TextDocument ):Promise<void> {
    try {
        const ü_docView = await this._whenShadowReady( ü_doc, '', false ); // not silent with UI
    } catch ( ü_eX ) {
        threadShowError( ü_eX, 'Shadow' );
    }
}

private async _whenShadowReady( ü_doc:TextDocument, ü_shadowDir:string, ü_silent:boolean ):Promise<VirtualDocumentView> {
  //
    if ( ! ü_silent ) {
        const ü_cfgHist = ß_XtnOpenInNpp.globalHistory.config;
        ü_shadowDir = ü_cfgHist.dataRef.shadowDir || getTempFolder();
        ß_trc&& ß_trc( ü_shadowDir, 'History-Shadow-Folder' );
    }
  //
    const ü_docView = await new VirtualDocumentView( ü_doc
                                                   , this._config.virtualDocumentsFileReuse
                                                   , ü_shadowDir
                                                   ).whenReady;
  //
    if ( ü_silent ) { return ü_docView.whenShadowUpToDate(); }
  //
        const ü_todo = await window.showInformationMessage( LCDoIt.createShadow( ü_doc.fileName, ü_docView.fileName )
                                                          , new MessageButton( CButton.YES             )
                                                          , new MessageButton( CButton.selectShadowDir ) );
        switch ( ü_todo?._button ) {

            case CButton.selectShadowDir:
                const ü_selectedDir = await whenFolderSelected( ü_shadowDir, LCHeader.selectShadowDir() );
                if ( ü_selectedDir.length > 0 ) {
                    ß_whenHistory( ü_selectedDir );
                                 await ü_docView.whenShadowUpToDate( ü_selectedDir );
                    ß_openInNppShadow( ü_docView );
                }
                break;

            case CButton.YES:
                             await ü_docView.whenShadowUpToDate();
                ß_openInNppShadow( ü_docView );
                break;
        }
    return ü_docView;
}

}

//--------------------------------------------------------------------

async function ß_whenHistory( ü_resetShadowDir:string ):Promise<void> {
    const ü_cfgHist = ß_XtnOpenInNpp.globalHistory.config;
    const ü_release = await ü_cfgHist.whenDataRef();
    try {
           //const ü_cfgData = ü_cfgHist.dataRef;
        if ( ü_cfgHist.dataRef.shadowDir !== ü_resetShadowDir ) {
           //ü_cfgData.shadowDir          =  ü_selectedDir ;
             ü_cfgHist.dataRef.shadowDir  =  ü_resetShadowDir ;
             ü_cfgHist.triggerCommit();
        }
    } finally { ü_release(); }
}

//====================================================================
/*
*/