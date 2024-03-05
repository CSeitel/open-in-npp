/*
*/
  import { type TTimer
         } from '../types/lib.asyncUtil.d';
  import { type TStringify
         } from '../types/generic.d';
//--------------------------------------------------------------------
//--------------------------------------------------------------------
  import { StatusBarAlignment, window
         } from 'vscode';
  import { ß_trc
         } from '../runtime/context';
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

async echoPromise<T>( ü_whenDone:PromiseLike<T> ):Promise<void> {
    const ü_done = await promiseSettled( ü_whenDone );
    if ( ü_done.rejected ) { this.echoMessage( ''+ü_done.reason, 'e' ); }
    else                   { this.echoMessage( ''+ü_done.value , 'i' ); }
}

async echoMessage( ü_text:string, ü_type:'i'|'w'|'e' = 'i', ü_tooltip?:string ):Promise<void> {
    const ß_a =
      { 'i': '\u24D8 ' // \u2139
      , 'w': '\u26A0 '
      , 'e': '\u274C ' // \u26A1
      };
  //
    this.item.tooltip = ü_tooltip ?? 'Notepad++';
    this.item.text    = '\u{1F4DD}'+ ß_a[ ü_type ]+ shortenText( ü_text, 80 );
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