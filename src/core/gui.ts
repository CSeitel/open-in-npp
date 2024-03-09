/*
*/
  import { type IMessage
         , type TMessageType
         } from '../types/lib.errorUtil.d';
  import { type TStringify
         } from '../types/generic.d';
//--------------------------------------------------------------------
  import { StatusBarAlignment
         , window
         } from 'vscode';
  import { LCButton
         } from '../l10n/i18n';
  import { ß_trc
         } from '../runtime/context';
  import { ErrorMessage
         , InfoMessage
         } from '../lib/errorUtil';
  import { shortenText
         } from '../lib/textUtil';
  import { UniqueResource
         , createTimer
         , whenDelay
         , promiseSettled
         } from '../lib/asyncUtil';
//====================================================================

export class XtnStatusBarItem {
    private readonly _duration = 5000;
    private          _delay    = 0;
    private readonly _timer    = createTimer( true );
            readonly  item     = window.createStatusBarItem( StatusBarAlignment.Right );
    private readonly _ur       = new UniqueResource( this.item ); 

async echoPromise<T>( ü_whenDone:PromiseLike<T>, ü_msg:InfoMessage ):Promise<void> {
    const ü_done = await promiseSettled( ü_whenDone );
    if ( ü_done.rejected ) {
        if ( ü_done.reason instanceof ErrorMessage )
             { this.echoMessage( ü_done.reason ); }
        else { throw             ü_done.reason  ; }
    } else {
        ü_msg.variables[ 0 ] = ''+ü_done.value;
        this.echoMessage( ü_msg );
    }
}

async echoMessage(   text :       IMessage                                               ):Promise<void>
async echoMessage( ü_text :string         , ü_type:TMessageType      , ü_tooltip?:string ):Promise<void>
async echoMessage( ü_text_:string|IMessage, ü_type:TMessageType = 'i', ü_tooltip?:string ):Promise<void> {
    const ß_a =
      { 'i': '\u24D8 ' // \u2139
      , 'w': '\u26A0 '
      , 'e': '\u274C ' // \u26A1
      };
  //
    const ü_msg = typeof( ü_text_ ) === 'string'
                ? { text: ü_text_
                  , type: ü_type
                  } as IMessage
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