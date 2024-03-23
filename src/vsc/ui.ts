/*
*/
  import * as ßß_vsCode from 'vscode';
  import { ThemeIcon
         , window
         , Disposable as vscDisposable
         , QuickPickItem
         , QuickInputButton
         } from 'vscode';
  import { format
         } from 'util';
//--------------------------------------------------------------------
  import { ß_trc
         , ß_err
         , ß_RuntimeContext
         } from '../runtime/context';
  import { ß_ViewErrorDetails
         } from '../runtime/context-XTN';
  import { LCButton
         } from '../l10n/i18n';
  import { whenNewTextEditorOpened
         } from '../vsc/docUtil';
  import { ErrorMessage
         } from '../lib/errorUtil';
//--------------------------------------------------------------------
  type TIcons = 'close'
//====================================================================

export class MessageButton<T=unknown> {
    public readonly title  :string
    public readonly tooltip:string
constructor(
                   ü_titleId :keyof typeof LCButton
  , public readonly  dataRef?:T
){
    this.title = LCButton[ ü_titleId ]();
    this.tooltip = this.title;
}
}

//====================================================================

export async function threadShowError( ü_eX:any, ü_context:string ):Promise<void> {
    ß_err( ü_eX );
    const ü_more = new MessageButton( 'DETAILS' );
    const ü_info = `${ ü_context }: "${ ü_eX }"`;
    const ü_done = await window.showErrorMessage( ü_info, ü_more );
    switch ( ü_done ) {
        case ü_more:
          //ü_eX.get
          const ü_content = ü_eX instanceof Error
                          ? [ ü_eX.name
                            , ü_eX.message
                            , ''
                            , format( '%o', ü_eX )
                            ]
                          : [ format( ü_eX ) ]
                          ;
          if ( ü_eX instanceof ErrorMessage
            && ü_eX.reason instanceof Error ) {
              ü_content.push( '', '', format( '%o', ü_eX.reason ) )
          }
          ü_content.unshift( ü_context, '', '' );
          ß_ViewErrorDetails.whenNewDocumentShown( ü_content.join( ß_RuntimeContext.lineSep ) );
          break;
    }
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

//------------------------------------------------------------------------------
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

//==============================================================================
  const CNULL = null;
  type  TNULL = typeof CNULL
  type  TSingleValue   <T> = T   | typeof SCancelButtonId
  type  TMultipleValues<T> = T[] | typeof SCancelButtonId
//--------------------------------------------------------------------

export class DropDownList<T,B> {
//
static async whenItemPicked<T,B>( ü_items:TListItems<T>
                                , ü_opts :TDropDownListOptions<B> ):Promise<TSingleValue<T>|B> {
  const ü_pick = new DropDownList<T,B>( ü_items, ü_opts );
  try {
    return await ü_pick.whenItemPicked();
  } finally {
    ü_pick.dispose();
  }
}
//
static async whenItemsPicked<T,B>( ü_items:TListItems<T>
                                 , ü_opts :TDropDownListOptions<B> ):Promise<TMultipleValues<T>|B> {
  const ü_pick = new DropDownList<T,B>( ü_items, ü_opts );
  try {
    return await ü_pick.whenItemsPicked();
  } finally {
    ü_pick.dispose();
  }
}
//
    private readonly _pick          = window.createQuickPick< ListItem<T> >();
    private readonly _disposables    :vscDisposable[] = [];
    private readonly _hint          ?:string
    private          _selection      :readonly ListItem<T>[]|TNULL          = CNULL;
    private          _resolveItem    :( ü_value :TMultipleValues<T>|B|T ) => void    = () => {};
    private          _multiple                                                     = true;
    private          _onButton      ?:( ü_button:          B, ü_self: DropDownList<T,B> ) => boolean
constructor(
    private          _items          :TListItems<T>
  , { header
    ,      step
    , totalSteps
    , hint
    , buttons
    , onButton
  //, canPickMany
    }                       :TDropDownListOptions<B>
) {
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
    this._resolveItem( ü_pressed.reference );
    this._pick.hide();
  //
}
private _onDidHide() {
    if(ß_trc){ß_trc( `onDidHide: "${ this._selection?.length || -1 }"` );}
    if ( this._selection !== CNULL ) {
         this._selection  =  CNULL;
    } else {
      this._resolveItem( CancelButton.reference );
    }
}
private _onDidAccept( ü_e:void ):any {
    if(ß_trc){ß_trc( `onDidAccept: "${ this._selection?.length || -1 }"` );}
    if ( this._selection === CNULL ) {
    } else {
      this._resolveItem( this._multiple
                       ? this._selection.map( ü_item => ü_item.reference )
                       : this._selection                   [0].reference
                       );
    }
    this._pick.hide();
}

set header( ü_header:string ) {
    this._pick.title = ü_header;
}
set buttons( ü_buttons:readonly ßß_vsCode.QuickInputButton[] ) {
    this._pick.buttons = ü_buttons;
}
//
private async _whenPicked( ö_multiple:true    ):Promise<TMultipleValues<T>|B>
private async _whenPicked( ö_multiple:false   ):Promise<  TSingleValue <T>|B>
private async _whenPicked( ö_multiple:boolean ):Promise<TMultipleValues<T>|B|T> {
  //
    const ü_whenPicked = new Promise<TMultipleValues<T>|B|T>( (ü_resolve,ö_reject) => {
      this._resolveItem = ü_resolve ;
      this._multiple    = ö_multiple;
    } );
  //
    this._pick.canSelectMany = ö_multiple;
  //
             this._pick.show();
    const ü_b = this._pick.buttons      ;
                this._pick.buttons = ü_b;
  //await whenDelay( 2000 );
  //
    if ( this._items instanceof Promise ) {
             this._pick.items = await this._items;
    } else { this._pick.items =       this._items;
    }
  //
    this._pick.busy    = false;
    this._pick.enabled = true ;
    this._pick.placeholder = this._hint;
  //
    return ü_whenPicked;
}
//
async whenItemsPicked():Promise<TMultipleValues<T>|B> { return this._whenPicked( true  ); }
async whenItemPicked ():Promise<  TSingleValue <T>|B> { return this._whenPicked( false ); }
//
async whenItemsUpdated( ü_whenItems :() => TListItems<T> ):Promise<void> {
    this._pick.enabled = false;
    this._pick.busy    = true ;
                               this._items = ü_whenItems();
  //
    this._pick.items   =       this._items instanceof Promise
                       ? await this._items
                       :       this._items
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
