/*
*/
  import { type TWritable
         , type TNotReadonly
         } from '../types/generic.d';
  import { type IRuntimeContext
         , type TDeveloperTrace
         } from '../types/runtime.context.d';
//--------------------------------------------------------------------
  import { sep
         } from 'path';
//====================================================================
  type TInitialRuntimeContext = TWritable<IRuntimeContext>
         const ß_that           = ß_implement( {} as TInitialRuntimeContext );
  export const ß_RuntimeContext = ß_that;
//====================================================================

function ß_implement( ü_rtCntxt:TInitialRuntimeContext ):IRuntimeContext {
    ü_rtCntxt. typeCode = 'any';
    ü_rtCntxt. pathSep  = sep;
    ü_rtCntxt. lineSep  = sep === '/'
                        ?   '\n'
                        : '\r\n';

    ü_rtCntxt. self       = ü_rtCntxt  ;
    ü_rtCntxt. globalThis = globalThis ;
    ü_rtCntxt. globalData = {}         ;

    ü_rtCntxt. devTrace    = ß_trc         ;
    ü_rtCntxt. writeStdOut = ß_writeStdOut ;
  //
    return ü_rtCntxt;
}

//====================================================================

export const ß_trc:TDeveloperTrace = function( ü_text:any ):void {
    console.error( 'TST:', ü_text );
}

export function ß_writeStdOut( ü_text:string ):void {
    process.stdout.write( ü_text + ß_that.lineSep );
}

export function ß_toggleDevTrace():void {
    ( ß_trc as TNotReadonly<TDeveloperTrace> ) = ß_trc ? false : ß_that.devTrace;
}

//====================================================================
/*
*/