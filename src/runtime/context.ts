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
  import { format
         } from 'util';
//====================================================================
  
  type TInitialRuntimeContext = TWritable<IRuntimeContext>
         const ß_that           = ß_implement( {} as TInitialRuntimeContext );
  export const ß_RuntimeContext = ß_that;
//====================================================================

function ß_implement( ü_rtCntxt:TInitialRuntimeContext ):IRuntimeContext {
    ü_rtCntxt. typeCode      = 'any';
    ü_rtCntxt. tracePrefix   = 'TST';
    ü_rtCntxt. fatalExitCode = 99;
  //
    ü_rtCntxt. pathSep  = sep;
    ü_rtCntxt. lineSep  = sep === '/'
                        ?   '\n'
                        : '\r\n';
  //
    ü_rtCntxt. self       = ü_rtCntxt  ;
    ü_rtCntxt. globalThis = globalThis ;
    ü_rtCntxt. globalData = {}         ;

    ü_rtCntxt. devTrace    = ß_compileWriter( 'log'   );
    ü_rtCntxt. errTrace    = ß_compileWriter( 'error' );
  //
    return ü_rtCntxt;
}

//====================================================================

export const ß_trc:TDeveloperTrace|false = ß_that.devTrace;
export const ß_err:TDeveloperTrace       = ß_that.errTrace;

function _stringify( ü_oref:any ):string {
  //return format( '%o', ü_oref );
    return format(       ü_oref );
}

export function ß_writeStdOut( ü_text:string ):void {
    process.stdout.write( ü_text + ß_that.lineSep );
}

export function ß_toggleDevTrace():void {
    ( ß_trc as TNotReadonly<TDeveloperTrace|false> ) = ß_trc ? false
                                                             : ß_that.devTrace;
}

//====================================================================

function ß_compileWriter( ü_txt:'log'|'warn'|'error'):TDeveloperTrace {
    return ö_devTrace;
function ö_devTrace( ü_text:any, ü_intro?:string ):void {
    if ( typeof( ü_intro ) === 'string' ) { console[ ü_txt ]( '%s-%s: %o', ß_that.tracePrefix, ü_intro, ü_text ); }
    else                                  { console[ ü_txt ](    '%s: %o', ß_that.tracePrefix,          ü_text ); }
}
}

//====================================================================
/*
*/