/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { promises as ß_fs_p
         } from 'fs';
  import { ß_trc
         } from '../../../runtime/context';
  import { expandEnvVariables
         , expandTemplateString
         , escapeFF
         } from '../../../lib/textUtil';
  import { createArray
         } from '../../../lib/arrayUtil';
  import { whenTempFile
         , whenKnownAsFile
         } from '../../../lib/fsUtil';
  import { bindArguments
         } from '../../../lib/functionUtil';
  import { testSrc
         , testSummary_
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_expandEnvVariables(){
    const ü_env = process.env;
    const ü_data =
      [ [ '%TEMP%', ü_env[ 'TEMP' ] ]
      , [ '%Temp%', ü_env[ 'Temp' ] ]
      , [ '%TEMP$',       '%TEMP$'  ]
      , [ '%T__P%',       '%T__P%'  ]
      ] as TResultArray<string,string>;
    testFunction( expandEnvVariables, ü_data );
  //
    const ü_temp =
      [ [ 'a-${ 0 } ${1}'  , 'a-00 11'   ]
      , [ 'a-${ hugo}', 'a-HUGO'  ]
      ] as TResultArray<string,string>;
    const ü_vars = ['00','11'];
    const ö_expandTemplateString_o = bindArguments( expandTemplateString, { arrangeBound:[1], realFirst:true }
                                           , Object.assign( ü_vars, {hugo : 'HUGO'} ) );
    testFunction( ö_expandTemplateString_o, ü_temp );
  //
    const ö_expandTemplateString_a = bindArguments( expandTemplateString, { arrangeBound:[1], realFirst:true }
                                           , ...            ü_vars                    );
    testFunction( ö_expandTemplateString_a, ü_temp );
  //
    testSummary_( 'expand' );
}

//====================================================================

export async function tst_escape(){
    const ü_chars = createArray( 256, function(ü_indx){
        const ü_c = String.fromCharCode( ü_indx ); return [ ü_c, encodeURI( ü_c ) ] as [string,string]; });
  //
    const ü_2 = ü_chars.map((ü_item)=>[ü_item[0],escape(ü_item[0])] as [string,string])
    const ü_temp =
      [ 
      , [ 'a-${ hugo}', 'a-HUGO'  ]
      ] as TResultArray<string,string>;
  //
    testFunction( escapeFF(), ü_2 );
    testFunction( escape, ü_chars );
  //
    testSummary_( 'escape' );
}

export async function tst_win32Names(){
    const ö_stub = await whenTempFile( 'qqqqqq' );
    let ü_file = ö_stub+'.txt';
                   await ß_fs_p.writeFile( ü_file, '' );
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
    await ß_fs_p.rename( ü_file, ü_done );
    return ü_done;
}
}

//====================================================================
/*
*/