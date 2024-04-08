/*
*/
  import { type MessageItem
         , type Disposable as TDisposable
         } from 'vscode';
  import { type IUiXMessage
         , type TUiXMessageType
         , type TUiXMessageTemplate
         , type IExpandUiXMessageVars
         } from '../types/lib.errorUtil.d';
  import { type TButton
         } from '../types/vsc.uiUtil.d';
  import { CEUiXMessageType
         , CUiXMessageTypeIcon
         } from '../constants/error';
  import { CButton
         } from '../l10n/ui';
//--------------------------------------------------------------------
  import { ThemeIcon
         , window
         , StatusBarAlignment
         , OpenDialogOptions
         , QuickPickItem
         , QuickInputButton
         } from 'vscode';
  import { ß_trc
         , ß_err
         } from '../runtime/context';
  import { ß_ViewErrorDetails
         } from '../runtime/context-XTN';
  import { summarizeError
        , expandTemplate
         } from '../lib/errorUtil';
  import { ß_stringify
         } from '../runtime/context';
  import { shortenText
         } from '../lib/textUtil';
  import { createPromise
         , UniqueResource
         , createTimer
         , whenDelay
         , whenDoneWithMessage
         } from '../lib/asyncUtil';
  import { fileToUri
         , uriToFile
         } from '../vsc/fsUtil';
//--------------------------------------------------------------------
  type TIcons = 'close'
//====================================================================

export class MessageButton<T=unknown> implements MessageItem {
    public readonly title  :string
    public readonly tooltip:string
constructor(
    public readonly _button :TButton
  , public readonly dataRef?:T
){
    this.title   = expandTemplate( _button.text    as IExpandUiXMessageVars, [] );
    this.tooltip =                 _button.tooltip === undefined
                 ? ''
                 : expandTemplate( _button.tooltip as IExpandUiXMessageVars, [] );
                 ;
}
}

//====================================================================

export async function threadShowError( ü_eX:any, ü_context:string ):Promise<void> {
  //
    ß_err( ü_eX );
    const ü_more = new MessageButton( CButton.showDetails );
    const ü_info = `${ ü_context }: "${ ü_eX }"`;
    const ü_done = await window.showErrorMessage( ü_info, ü_more );
    switch ( ü_done ) {
        case ü_more:
          ß_ViewErrorDetails.whenNewDocumentShown( summarizeError( ü_eX, ü_context ) );
          break;
    }
}

//====================================================================

export class XtnStatusBarItem {
    private          _delay    = 0;
    private readonly _timer    = createTimer( true );
            readonly  item     = window.createStatusBarItem( StatusBarAlignment.Right );
    private readonly _ur       = new UniqueResource( this.item ); 
  //
constructor(
    private readonly _duration  = 5000
  , private readonly _maxLength =   80
){
}

async echoPromise<T>( ü_whenDone:PromiseLike<T>, ü_msg:TUiXMessageTemplate ):Promise<void> {
    const ü_done = await whenDoneWithMessage( ü_whenDone, ü_msg );
    this.echoMessage( ü_done );
}

async echoMessage(   text :       IUiXMessage                                                                    ):Promise<void>
async echoMessage( ü_text :string            , ü_type:TUiXMessageType                        , ü_tooltip?:string ):Promise<void>
async echoMessage( ü_text_:string|IUiXMessage, ü_type:TUiXMessageType = CEUiXMessageType.info, ü_tooltip?:string ):Promise<void> {
  //
    const ü_msg = typeof( ü_text_ ) === 'string'
                ? { text: ü_text_
                  , type: ü_type
                  } as IUiXMessage
                :         ü_text_ ;
  //
    this.item.text    = CUiXMessageTypeIcon.verified[ ü_msg.type ]
                      + shortenText( ü_msg.text, this._maxLength );//'\u{1F4DD}'+
    this.item.tooltip = ü_tooltip ?? ü_msg.text;
  //
    if ( this._ur.isPending() ) {
                      this._timer() ; // reset
        this._delay = this._duration; // reset
        return;
    }
  //
    const ü_release = await this._ur.whenAvailable();
    try {
        this.item.show();
      //const ü_dura = createTimer();
        
                                            this._timer() ; // reset
                             this._delay  = this._duration; // reset
        while (            ( this._delay -= this._timer() ) > 0 ) {
            await whenDelay( this._delay );
        }
        this.item.hide();
    } finally {
        ü_release();
    }
}

}

//====================================================================

export async function whenFolderSelected( ü_previousFolder:string, ü_dialogTitle = '', ü_buttonText = '' ):Promise<string> {
  //
    const ü_opts:OpenDialogOptions =
      { canSelectFolders: true
      , canSelectFiles  : false
      , canSelectMany   : false
      , defaultUri      : fileToUri( ü_previousFolder )
      , title    : ü_dialogTitle
      , openLabel: ü_buttonText
      };
  //
    const ü_uris = await window.showOpenDialog( ü_opts );
    if ( ü_uris        === undefined
      || ü_uris.length === 0
       ) { return ''; }
           return uriToFile( ü_uris[0] );
}

//====================================================================

export class ListItem<T> implements QuickPickItem {
    public          picked     ?:boolean
constructor(
    public          label       :string
  , public          description :string
  , public readonly reference   :T
  , public          detail     ?:string
){}
//
setPicked( ü_picked:boolean = true ):ListItem<T> {
    this.picked = ü_picked;
    return this;
}
}

type TListItems<T> =          ListItem<T>[]
                   | Promise< ListItem<T>[] >

//====================================================================

export class VscQIButton<B> implements QuickInputButton {
    public          iconPath  :ThemeIcon
constructor(
//  public iconPath: { light: ßß_vsCode.Uri dark : ßß_vsCode.Uri }
                  ü_icon      :TIcons
  , public          tooltip   :string
  , public readonly reference :B
){
  //this.icon = ü_icon;
    this.iconPath = new ThemeIcon( ü_icon );
}
set icon( ü_icon:string ) {
    this.iconPath = new ThemeIcon( ü_icon );
}
//
}

//--------------------------------------------------------------------
  export const SCancelButtonId  = Symbol();
         const  CancelButton    = new VscQIButton( 'close', 'Cancel', SCancelButtonId    );
  export type TButtons = VscQIButton<typeof SCancelButtonId>[]
//--------------------------------------------------------------------

type TOptions<B> =
  { header      ?:string
         step   ?:number
    totalSteps  ?:number
    hint        ?:string
    buttons     ?:ReadonlyArray< VscQIButton<B> >
    onButton    ?:( ü_button:B ) => boolean
  //canPickMany ?:boolean
  }

export type TDropDownListOptions<B> = TOptions<B> &
  {
  }

//====================================================================
  const CNULL = null;
  type  TNULL = typeof CNULL
  type  TSingleValue   <T> = T   | typeof SCancelButtonId
  type  TMultipleValues<T> = T[] | typeof SCancelButtonId
//--------------------------------------------------------------------

export class DropDownList<T,B> {
//
static async whenItemPicked<T,B>( ü_items:TListItems<T>
                                , ü_opts :TDropDownListOptions<B>
                                ):Promise<TSingleValue<T>|B> {
    const ü_pick = new DropDownList<T,B>( ü_items, ü_opts );
    try {
        return await ü_pick._whenPicked( false );
    } finally {
        ü_pick.dispose();
    }
}
//
static async whenItemsPicked<T,B>( ü_items:TListItems<T>
                                 , ü_opts :TDropDownListOptions<B>
                                 ):Promise<TMultipleValues<T>|B> {
    const ü_pick = new DropDownList<T,B>( ü_items, ü_opts );
    try {
        return await ü_pick._whenPicked( true  );
    } finally {
        ü_pick.dispose();
    }
}
  //
    private readonly _whenDone                     = createPromise<TMultipleValues<T>|B|T>();
    private readonly _disposables :TDisposable[] = [];
    private readonly _pick                         = window.createQuickPick<ListItem<T>>();
    private readonly _hint       ?:string
    private          _selection   :readonly ListItem<T>[]|TNULL          = CNULL;
    private          _multiple                                                     = true;
    private          _onButton   ?:( ü_button:          B, ü_self: DropDownList<T,B> ) => boolean
private constructor(
    private          _whenItems   :TListItems<T>
  , { header
    ,      step
    , totalSteps
    , hint
    , buttons
    , onButton
  //, canPickMany
    }                       :TDropDownListOptions<B>
){
    this._onButton = onButton;
    this._hint = hint === undefined
               ? `Press 'Enter' to confirm your input or 'Escape' to cancel`
               : hint
               ;
    this._pick.matchOnDescription = true;
    this._pick.ignoreFocusOut     = true;
  //
    this._pick.enabled     = false;
    this._pick.busy        = true ;
    this._pick.placeholder = 'Loading ...';
  //
    this._pick.title      = header    ;
    this._pick.     step  =      step ;
    this._pick.totalSteps = totalSteps;
    this._pick.buttons    = buttons === undefined
                          ? []
                          : buttons
                          ;
  //
    this._pick.onDidChangeValue    ( this._onDidChangeValue    , this, this._disposables );
    this._pick.onDidChangeSelection( this._onDidChangeSelection, this, this._disposables );
    this._pick.onDidTriggerButton  ( this._onDidTriggerButton  , this, this._disposables );
    this._pick.onDidHide           ( this._onDidHide           , this, this._disposables );
    this._pick.onDidAccept         ( this._onDidAccept         , this, this._disposables );
  //
}
private _onDidChangeValue( ü_value:string ):any {
    if(ß_trc){ß_trc( `onDidChangeValue: "${ ü_value }"` );}
}
private _onDidChangeSelection( ü_items:readonly ListItem<T>[] ):any {
    if(ß_trc){ß_trc( `onDidChangeSelection: "${ ü_items.length } items"` );}
    this._selection = ü_items;
}
private async _onDidTriggerButton( ü_button:QuickInputButton ):Promise<any> {
    if(ß_trc){ß_trc( `onDidTriggerButton: "${ ü_button.tooltip }"` );}
    
    const ü_pressed = ü_button as VscQIButton<B>;
  //
    if ( this._onButton instanceof Function ) {
      if ( this._onButton.call( null, ü_pressed.reference, this ) ) {
        return;
      }
    }
  //
    this._whenDone.resolve( ü_pressed.reference );
    this._pick.hide();
  //
}
private _onDidHide() {
    if(ß_trc){ß_trc( `onDidHide: "${ this._selection?.length || -1 }"` );}
    if ( this._selection !== CNULL ) {
         this._selection  =  CNULL;
    } else {
      this._whenDone.resolve( CancelButton.reference );
    }
}
private _onDidAccept( ü_e:void ):any {
    if(ß_trc){ß_trc( `onDidAccept: "${ this._selection?.length || -1 }"` );}
    if ( this._selection === CNULL ) {
    } else {
        this._whenDone.resolve( this._multiple
                              ? this._selection.map( ü_item => ü_item.reference )
                              : this._selection                   [0].reference
                              );
    }
    this._pick.hide();
}

set header( ü_header:string ) {
    this._pick.title = ü_header;
}
set buttons( ü_buttons:readonly QuickInputButton[] ) {
    this._pick.buttons = ü_buttons;
}
//
private async _whenPicked(   multiple:true    ):Promise<TMultipleValues<T>|B>
private async _whenPicked(   multiple:false   ):Promise<  TSingleValue <T>|B>
private async _whenPicked( ü_multiple:boolean ):Promise<TMultipleValues<T>|B|T> {
    const ü_items = await this._whenItems;
  //
    this._multiple           =
    this._pick.canSelectMany = ü_multiple;
  //
    this._pick.show();
  //
    const ü_b = this._pick.buttons      ;
                this._pick.buttons = ü_b;
  //await whenDelay( 2000 );
    this._pick.items         = ü_items;
    this._pick.selectedItems = ü_items.filter( ü_item => ü_item.picked );
  //
  //if ( this._items instanceof Promise ) { } else { }
  //
    this._pick.busy    = false;
    this._pick.enabled = true ;
    this._pick.placeholder = this._hint;
  //
    return this._whenDone.promise;
}
//
async whenItemsUpdated( ü_whenItems :() => TListItems<T> ):Promise<void> {
    this._pick.enabled = false;
    this._pick.busy    = true ;
                               this._whenItems = ü_whenItems();
  //
    this._pick.items   =       this._whenItems instanceof Promise
                       ? await this._whenItems
                       :       this._whenItems
                       ;
    this._pick.busy    = false;
    this._pick.enabled = true ;
}
//
dispose() {
    this._disposables.forEach( ü_d => ü_d.dispose() );
    this._pick.dispose();
}
//
}

//==============================================================================
