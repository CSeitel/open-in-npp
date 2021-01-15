/*
*/
  import * as ßß_vsCode from 'vscode';
  import {
         } from 'vscode';
//------------------------------------------------------------------------------
  import   ExtensionRuntime
           from '../extension';
  const ß_trc = ExtensionRuntime.developerTrace;
//==============================================================================

export class ListItem<T> implements ßß_vsCode.QuickPickItem {
  //public          detail      :string
constructor(
    public          label       :string
  , public          description :string
  , public readonly reference   :T
  , public          detail     ?:string
){}
//
}

type TListItems<T> =          ListItem<T>[]
                   | Promise< ListItem<T>[] >

//==============================================================================

export class SomeButton<B> implements ßß_vsCode.QuickInputButton {
    public          iconPath  :ßß_vsCode.ThemeIcon
constructor(
//  public iconPath: { light: ßß_vsCode.Uri dark : ßß_vsCode.Uri }
                  ü_icon      :string
  , public          tooltip   :string
  , public readonly reference :B
) {
  //this.icon = ü_icon;
    this.iconPath = new ßß_vsCode.ThemeIcon( ü_icon );
}
set icon( ü_icon:string ) {
    this.iconPath = new ßß_vsCode.ThemeIcon( ü_icon );
}
//
}

//------------------------------------------------------------------------------
  const CCancelButton    = Symbol();
  const  CancelButton    = new SomeButton( 'close'    , 'Cancel' , CCancelButton    );
//------------------------------------------------------------------------------

type TOptions<B> =
  { header      ?:string
         step   ?:number
    totalSteps  ?:number
    hint        ?:string
    buttons     ?:ReadonlyArray< SomeButton<B> >
    onButton    ?:( ü_button:B ) => boolean
    canPickMany ?:boolean
  }

export type TDropDownListOptions<B> = TOptions<B> &
  {
  }

//==============================================================================
  const SINITIAL  = Symbol();
  type  TINITIAL  = typeof SINITIAL
  type  TVALUE<T> = T[] | T | TINITIAL

export class DropDownList<T,B> {
//
static async whenItemPicked<T,B>( ü_items:TListItems<T>
                                , ü_opts :TDropDownListOptions<B> ):Promise<TVALUE<T>|B> {
  const ü_pick = new DropDownList<T,B>( ü_items, ü_opts );
  try {
    return await ü_pick.whenItemPicked();
  } finally {
    ü_pick.dispose();
  }
}
//
    private readonly _pick          = ßß_vsCode.window.createQuickPick< ListItem<T> >();
    private readonly _disposables    :ßß_vsCode.Disposable[] = [];
    private readonly _hint          ?:string
    private          _value          :       ListItem<T>[]|TINITIAL       = SINITIAL;
    private          _resolveItem    :( ü_value :TVALUE<T>|B ) => void    = () => {};
    private          _onButton      ?:( ü_button:          B ) => boolean
constructor(
    private          _items          :TListItems<T>
  , { header
    ,      step
    , totalSteps
    , hint
    , buttons
    , onButton
    , canPickMany
    }                       :TDropDownListOptions<B>
) {
    this._onButton = onButton;
    this._hint = hint === undefined
               ? `Press 'Enter' to confirm your input or 'Escape' to cancel`
               : hint
               ;
    this._pick.matchOnDescription = true;
    this._pick.ignoreFocusOut     = true;
    this._pick.canSelectMany      = canPickMany || false;
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
private _onDidChangeSelection( ü_items:ListItem<T>[] ):any {
    if(ß_trc){ß_trc( `onDidChangeSelection: "${ ü_items.length } items"` );}
    if ( ü_items.length > 0 ) {
      this._value = ü_items;
    }
}
private async _onDidTriggerButton( ü_bttn:ßß_vsCode.QuickInputButton ):Promise<any> {
        console.log( 'onDidTriggerButton' );
        const ü_button = ü_bttn as SomeButton<B>;
        if ( this._onButton instanceof Function ) {
          if ( this._onButton.call( null, ü_button.reference ) ) {
          //this._pick.
            return;
          }
        }
      //
        switch ( ü_button ) {
          case CancelButton as any:
            this._resolveItem( SINITIAL );
            break;
          default:
            this._resolveItem( ü_button.reference );
        }
      //
        this._pick.hide();
      //
    }
private _onDidHide() {
    console.log( 'onDidHide' );
    if ( this._value !== SINITIAL ) {
         this._value  =  SINITIAL;
    } else {
      this._resolveItem( SINITIAL );
    }
}
private _onDidAccept( ü_e:void ):any {
    console.log( 'onDidAccept' );
    if ( this._value === SINITIAL ) {
    } else {
      this._resolveItem( this._pick.canSelectMany
                       ? this._value.map( ü_item => ü_item.reference )
                       : this._value                   [0].reference
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
async whenItemPicked():Promise<TVALUE<T>|B> {
    const ü_whenItemPicked = new Promise<TVALUE<T>|B>( (ü_resolve,ö_reject) => { this._resolveItem = ü_resolve } );
  //
    this._pick.show();
    const ü_b = this._pick.buttons      ;
                this._pick.buttons = ü_b;
  //await whenDelay( 2000 );
  //
    this._pick.items   =       this._items instanceof Promise
                       ? await this._items
                       :       this._items
                       ;
    this._pick.busy    = false;
    this._pick.enabled = true ;
    this._pick.placeholder = this._hint;
  //
    return ü_whenItemPicked;
}
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
