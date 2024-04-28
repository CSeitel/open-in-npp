/*
*/
  import { type TOrderedPairs
         } from '../../../types/generic.d';
  import { type TCreateOrderedPair
         } from '../../../types/lib.arrayUtil.d';
//--------------------------------------------------------------------
  import { format
         } from 'util';
  import { ß_trc
         } from '../../../runtime/context';
  import { expandEnvVariables
         , expandTemplateString
         , escapeFF
         } from '../../../lib/textUtil';
  import { createArray
         , createOrderedPairs
         } from '../../../lib/arrayUtil';
  import { bindArguments
         , identityMap
         } from '../../../lib/functionUtil';
  import { whenTempFile
         , whenKnownAsFile
         , whenFileWritten
         , whenItemRenamed
         } from '../../../lib/fsUtil';
  import { testSrc
         , testSummary_
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_dispatch(){
  //return;
    return tst_encodeURIC();
    await  tst_js_escape();
}
//====================================================================

export async function tst_expandEnvVariables(){
    const ü_env = process.env;
    const ü_data =
      [ [ '%TEMP%', ü_env[ 'TEMP' ] ]
      , [ '%Temp%', ü_env[ 'Temp' ] ]
      , [ '%TEMP$',       '%TEMP$'  ]
      , [ '%T__P%',       '%T__P%'  ]
      ] as TOrderedPairs<string,string>;
    testFunction( expandEnvVariables, ü_data );
  //
    const ü_temp =
      [ [ 'a-${ 0 } ${1}'  , 'a-00 11'   ]
      , [ 'a-${ hugo}', 'a-HUGO'  ]
      ] as TOrderedPairs<string,string>;
    const ü_vars = ['00','11'];
    const ö_expandTemplateString_o = bindArguments( expandTemplateString, { arrangeBound:[1], realFirst:true }
                                           , Object.assign( ü_vars, {hugo : 'HUGO'} ) );
    testFunction( ö_expandTemplateString_o, ü_temp );
  //
    const ö_expandTemplateString_a = bindArguments( expandTemplateString, { arrangeBound:[1], realFirst:true }
                                           , ...            ü_vars                    );
    testFunction( ö_expandTemplateString_a, ü_temp );
  //
}

//====================================================================

export async function tst_encodeURIC(){ testFunction( encodeURIComponent , createOrderedPairs( 129, String.fromCharCode.bind( String ), encodeURI           ) ); }
export async function tst_encodeURI (){ testFunction( encodeURI          , createOrderedPairs( 129, String.fromCharCode.bind( String ), escape              ) ); }
export async function tst_js_escape (){ testFunction( escapeFF()         , createOrderedPairs( 256, String.fromCharCode.bind( String ), escape              ) ); }
export async function tst_js_format (){ testFunction( format             , createOrderedPairs( 256, String.fromCharCode.bind( String ), identityMap<string> ) ); }

//====================================================================

export async function tst_win32Names(){
    const ö_stub = await whenTempFile( 'qqqqqq' );
    let ü_file = ö_stub+'.txt';
                   await whenFileWritten( ü_file, '' );
    let ü_indx = 0x21;
    do {
        const ü_char = String.fromCharCode( ü_indx );
        try {
            ü_file = await ö_rename( ü_file, ü_char );
        } catch ( error ) {
            switch ( ü_char ) {
                case '"': //\x22
                case '*': //\x2a
                case '/': //\x2f
                case ':': //\x3a
                case '<': //\x3c
                case '>': //\x3e
                case '?': //\x3f
                case '\\'://\x5c
                case '|': //\x7c
                  testEqual( ü_char, ü_char, ü_indx.toString(16) );
                  break;
                default:
                  testEqual( ü_indx.toString(16), ü_char );
            }
            continue;
        }
        
        testEqual( true, await whenKnownAsFile( ü_file ), ü_file );
      //break;
    } while ( ü_indx ++ < 0x100 );
    testSummary_( 'File Names' );
async function ö_rename( ü_file:string, ü_char:string ):Promise<string> {
    const ü_done = ö_stub+ü_char+'.txt';
    await whenItemRenamed( ü_file, ü_done );
    return ü_done;
}
}

//====================================================================
/*
*/