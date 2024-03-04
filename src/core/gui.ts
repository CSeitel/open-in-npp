/*
*/
  import { type TAsyncFunctionSingleArg
         } from '../types/generic.d';
  import { type TINITIAL
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { SINITIAL
         , EConfigurationIds
         , TXtnConfigKeys
         , CPrefix
         } from '../constants/extension';
//--------------------------------------------------------------------
  import { window
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
    private readonly _dura  = 5000;
    private          _delay = 0;
            readonly  item = window.createStatusBarItem();
    private readonly _ur   = new UniqueResource( this.item ); 

async echoPromise<T>( ü_whenDone:PromiseLike<T> ):Promise<void> {
    const ü_done = await promiseSettled( ü_whenDone );
    if ( ü_done.rejected ) { this.echoMessage( ''+ü_done.reason, 'e' ); }
    else                   { this.echoMessage( ''+ü_done.value , 'i' ); }
}

async echoMessage( ü_text:string, ü_type:'i'|'w'|'e' = 'i' ):Promise<void> {
    const ß_a =
      { 'i': '\u24D8 ' // \u2139
      , 'w': '\u26A0 '
      , 'e': '\u274C ' // \u26A1
      };
  //
    this.item.text = ß_a[ ü_type ]+ shortenText( ü_text, 50 );
    this._delay += this._dura;
  //
    if ( this._ur.isPending() ) { return; }
  //
    const ü_release = await this._ur.whenAvailable();
    try {
        this.item.show();
      //const ü_dura = createTimer();
        while ( this._delay > 0 ) {
            await whenDelay( this._delay );
                             this._delay -= this._dura;
        }
      //thisü_dura()
        this.item.hide();
    } finally {
        ü_release();
    }
}

}

//====================================================================
/*
*/