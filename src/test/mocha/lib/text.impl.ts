/*
*/
  import { type TOrderedPairs
         } from '../../../types/generic.d';
  import { type TCreateOrderedPair
         } from '../../../types/lib.arrayUtil.d';
  import { CCharSet
         } from '../../../constants/text';
//--------------------------------------------------------------------
  import { format
         } from 'util';
  import { ß_trc
         , ß_RuntimeContext
         } from '../../../runtime/context';
  import { expandEnvVariables
         , expandTemplateString
         , escapeFF
         } from '../../../lib/textUtil';
  import { createArray
         , createOrderedPairs
         } from '../../../lib/arrayUtil';
  import { expectErrorCode
         } from '../../../lib/errorUtil';
  import { asyncNullOperation
         , bindArguments
         , identityMap
         } from '../../../lib/functionUtil';
  import { whenTempFile
         , whenKnownAsFile
         , whenFileWritten
         , whenItemRenamed
         } from '../../../lib/fsUtil';
  import { testSrc
         , testEqual
         , testFunction
         , whenAsyncFunctionTested
         } from '../../../lib/testUtil';
//====================================================================
  export const tst_dispatch = asyncNullOperation;
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
}

export async function tst_expandTemplateString(){
  //
    const ü_vars = ['00','11'];
    const ü_temp =
      [ [ 'a-{ 0 } {1}'  , 'a-00 11' ]
      , [ 'a-{ hugo}'    , 'a-HUGO'  ]
      ] as TOrderedPairs<string,string>;
  //
    const ö_object = bindArguments( expandTemplateString, { realFirst:true, arrangeBound:[1] }, Object.assign( ü_vars, { hugo:'HUGO' } ) );
    const ö_array  = bindArguments( expandTemplateString, { realFirst:true, arrangeBound:[1] }, ...            ü_vars                    );
  //
    testFunction( ö_object, ü_temp );
                            ü_temp[1][1] = ü_temp[1][0];
    testFunction( ö_array , ü_temp );
}

//====================================================================

//export async function tst_encodeURIC(){ testFunction( encodeURIComponent , createOrderedPairs( 129, String.fromCharCode.bind( String ), encodeURI           ) ); }
//export async function tst_encodeURI (){ testFunction( encodeURI          , createOrderedPairs( 129, String.fromCharCode.bind( String ), escape              ) ); }
export async function tst_js_escape (){ testFunction( escapeFF()         , createOrderedPairs( 256, String.fromCharCode.bind( String ), escape              ) ); }
export async function tst_js_format (){ testFunction( format             , createOrderedPairs( 256, String.fromCharCode.bind( String ), identityMap<string> ) ); }

//====================================================================

export async function tst_win32Names(){
  //
    const ü_count = 64//256;
    const ö_stub = await whenTempFile( 'qqqqqq' );
                                                                                let ö_file =  ö_stub +          '.txt';
    const ö_data = createOrderedPairs( ü_count, String.fromCharCode.bind( String ), ü_char => ö_stub + ü_char + '.txt' ).slice( 0x20 );
                   await whenFileWritten( ö_file, '' );
  //
    await whenAsyncFunctionTested( ö_whenRenamed, ö_data, function( ü_char, ü_eX, x_y ){
        expectErrorCode( 'ENOENT', ü_eX );
        return CCharSet.fs_win32.includes( ü_char.charCodeAt(0) )
             ? x_y[1]
             : '';
      //ß_trc&& ß_trc( ü_char+' '+ü_eX.message, 'Temp-File' );
    });
  //
async function ö_whenRenamed( ü_char:string ):Promise<string> {
                                 const ü_file = ö_data.find( ü_row => ü_row[0] === ü_char );
    if ( ü_file === undefined ) { throw new TypeError( ü_char ); }
        await whenItemRenamed( ö_file, ü_file[1] );
                        return ö_file= ü_file[1]  ;
}
}

//====================================================================
/*
*/