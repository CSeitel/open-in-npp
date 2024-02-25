/*
*/
  import { type TWritable
         } from '../types/generic.d';
  import { type IRuntimeContext
         } from '../types/runtime.context.d';
//====================================================================
  type TInitialRuntimeContext = TWritable<IRuntimeContext>
//--------------------------------------------------------------------
         const ß_that           = ß_implement( {} as TInitialRuntimeContext );
  export const ß_RuntimeContext = ß_that;
  export const ß_trc            = ß_that.devTrace;
//====================================================================

function ß_implement( ü_rtCntxt:TInitialRuntimeContext ):IRuntimeContext {
    ü_rtCntxt. typeCode = 'any';
    ü_rtCntxt. pathSep  = '\\';
    ü_rtCntxt. lineSep  = '\r\n';

    ü_rtCntxt. self       = ü_rtCntxt  ;
    ü_rtCntxt. globalThis = globalThis ;
    ü_rtCntxt. globalData = {}         ;

    ü_rtCntxt. devTrace = ß_devTrace;
  //
    return ü_rtCntxt;
}

//====================================================================

function ß_devTrace( ü_text:string ):void {
    console.log( ü_text );
}

//====================================================================
/*
*/