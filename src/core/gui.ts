/*
*/
  import { type IUiXMessage
         , type TUiXMessageType
         , type TUiXMessageTemplate
         } from '../types/lib.errorUtil.d';
  import { type TStringify
         } from '../types/generic.d';
  import { CEUiXMessageType
         } from '../constants/error';
//--------------------------------------------------------------------
  import { StatusBarAlignment
         , window
         } from 'vscode';
  import { ß_stringify
         } from '../runtime/context';
  import { shortenText
         } from '../lib/textUtil';
  import { UniqueResource
         , createTimer
         , whenDelay
         , whenPromiseSettled_
         } from '../lib/asyncUtil';
  import { threadShowError
         } from '../vsc/ui';
//====================================================================

export class XtnStatusBarItem {
    private readonly _duration = 5000;
    private          _delay    = 0;
    private readonly _timer    = createTimer( true );
            readonly  item     = window.createStatusBarItem( StatusBarAlignment.Right );
    private readonly _ur       = new UniqueResource( this.item ); 

async echoPromise<T>( ü_whenDone:PromiseLike<T>, ü_msg:TUiXMessageTemplate ):Promise<void> {
    const ü_done = await whenPromiseSettled_( ü_whenDone, ü_msg );
    this.echoMessage( ü_done );
}

async echoMessage(   text :       IUiXMessage                                                                    ):Promise<void>
async echoMessage( ü_text :string            , ü_type:TUiXMessageType                        , ü_tooltip?:string ):Promise<void>
async echoMessage( ü_text_:string|IUiXMessage, ü_type:TUiXMessageType = CEUiXMessageType.info, ü_tooltip?:string ):Promise<void> {
    const ß_a =
      { 'i': '\u24D8 ' // \u2139
      , 'w': '\u26A0 '
      , 'e': '\u274C ' // \u26A1
      };
  //
    const ü_msg = typeof( ü_text_ ) === 'string'
                ? { text: ü_text_
                  , type: ü_type
                  } as IUiXMessage
                :         ü_text_ ;
  //
    this.item.text    = '\u{1F4DD}'+ ß_a[ ü_msg.type ]+ shortenText( ü_msg.text, 80 );
    this.item.tooltip = ü_tooltip ?? 'Notepad++';
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
          //ß_trc&& ß_trc( this._delay, 'Dela' )
        }
        this.item.hide();
    } finally {
        ü_release();
    }
}

}

//====================================================================
/*
*/