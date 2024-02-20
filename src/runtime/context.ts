/*
*/
  import { type IRuntimeContext
         } from '../types/runtime.context.d';
//====================================================================

  const ß_that:IRuntimeContext =
    { pathSep: '\\'
    , lineSep: '\r\n'
    , devTrace: ß_devTrace
    , globalData:{}
    };
//--------------------------------------------------------------------
  export const ß_RuntimeContext = ß_that;
  export const ß_trc            = ß_that.devTrace;
//====================================================================

function ß_devTrace( ü_text:string ):void {
    console.log( ü_text );
}

//====================================================================
/*
*/