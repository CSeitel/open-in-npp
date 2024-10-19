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
  import { pickPair
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
  import { echoAsJSON
         , echoAsString
         } from '../../../lib/jsonUtil';
  import { testSrc
         , testEqual
         , testFunction
         , whenAsyncFunctionTested
         } from '../../../lib/testUtil';
//====================================================================
  export const tst_dispatch = !true ? asyncNullOperation
                                    : tst_JSONLike2;
  const ß_JSON_stringify = JSON.stringify.bind( JSON ) as ()=>string|void;
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

export async function tst_JSONLike1(){
    const ü_date = new Date();
    const ü_data =
      [
      , [ null     , 'null' ]
      , [ ü_date   , `"${ ü_date.toISOString()}"` ]
      , [ true     , 'true' ]
      , [ -1       , '-1'   ]
      , [ ''       , '""'   ]
      , [ '" \\ \n \r \t \v \b \f'   , '"\\" \\\\ \\n \\r \\t \\u000b \\b \\f"' ]
                                   //, '"\\" \\\\ \\n \\r \\t \\v \\b \\f"' ]

      , [ {'\x09'        :'\x09'          }, '{"\\t":"\\t"}'         ]
      , [ {'\x10'        :'\x10'          }, '{"\\u0010":"\\u0010"}' ]
      , [ {'\u0010'      :'\u0010'        }, '{"\\u0010":"\\u0010"}' ]
      , [ {'\ud834\udd1e': '\ud834\udd1e' }, '{"𝄞":"𝄞"}'             ]
      , [ {'\u2260'      :'\u2260'        }, '{"≠":"≠"}'             ]

      , [ Boolean(), 'false' ]
      , [ Number (), '0'     ]
      , [ String (), '""'    ]

      , [ {a:null     }, '{"a":null}' ]
      , [ {a:ü_date   }, `{"a":"${ ü_date.toISOString()}"}` ]
      , [ {a:true     }, '{"a":true}' ]
      , [ {a:-1       }, '{"a":-1}'   ]
      , [ {a:[]       }, '{"a":[]}'   ]
      , [ [null,false,-1], '[null,false,-1]' ]
      ] as TOrderedPairs<any,string>;
    const ö_array  = bindArguments( echoAsJSON, { realFirst:true, arrangeBound:[1] },  true                   );
  //
    testFunction( ß_JSON_stringify, ü_data );
    testFunction( echoAsJSON      , ü_data );
  //testFunction( echoAsJSON      , ü_data );
  //
    const ü_code = tst_JSONLike1.toString().slice(0,20);
    const ü_data_2 =
      [
      , [    undefined                 , undefined,      'undefined'              ]
      , [                tst_JSONLike1 , undefined,                    ü_code     ]
      , [ {a:undefined,b:tst_JSONLike1}, '{}'     , '{a:undefined,b:${ ü_code }}' ]
      , [   [undefined,  tst_JSONLike1], '[null]' ,     '[undefined,${ ü_code }]' ]
      ] as [any,string,string][];
    const ü_01 = ü_data_2.map( pickPair<any,string>( 0, 1 ) );
    const ü_02 = ü_data_2.map( pickPair<any,string>( 0, 2 ) );
  //
    testFunction( ß_JSON_stringify, ü_01 );
    testFunction( echoAsJSON      , ü_01 );
    testFunction( echoAsString    , ü_02 );
}

export async function tst_JSONLike2(){
    const echoAsStringExp = bindArguments( echoAsString, { realFirst:true, arrangeBound:[1] }, true );
    const ü_code = tst_JSONLike2.toString().slice(0,20);
  //
    const ü_ref_0 = {a0:true};
    const ü_ref_1 = {a1:true,b1:ü_ref_0};
    const ü_ref_2 = ü_ref_1.b1 = {a2:true,b2:ü_ref_1} as any;
    const ü_ref_4 = [1,{a4:[] }] as any[];
          ü_ref_4[1].a4 = ü_ref_4;
    const ü_ref_3 = {a3:true} as any;
          ü_ref_3.a = ü_ref_3.b = ü_ref_3;
    const ü_ref_5 = {a5:true,b:tst_JSONLike2,c:[tst_JSONLike2]};
    const ö_recursion = 'Recursion';
  //
    const ü_data =
      [
        [ {a:ü_ref_0,b:ü_ref_0}       
        , '{a:{a0:true},b:{a0:true}}'
        , '{a:<*1>{a0:true},b:(#1)}'
        , '{"a":{"a0":true},"b":{"a0":true}}'
        ]
      , [ {a:true,b:ü_ref_1,c:ü_ref_2}
        , '{a:true,b:<*1>{a1:true,b1:{a2:true,b2:(#1)}},c:<*2>{a2:true,b2:{a1:true,b1:(#2)}}}'
        , '{a:true,b:<*1>{a1:true,b1:<*2>{a2:true,b2:(#1)}},c:(#2)}'
        , ö_recursion
        ]
      , [ ü_ref_3
        , '<*1>{a3:true,b:(#1),a:(#1)}'
        , '<*1>{a3:true,b:(#1),a:(#1)}'
        , ö_recursion
        ]
      , [ ü_ref_4
        , '<*1>[1,{a4:(#1)}]'
        , '<*1>[1,{a4:(#1)}]'
        , ö_recursion
        ]
      , [ ü_ref_5
        , `{a5:true,b:${ ü_code },c:[${ ü_code }]}`
        , `{a5:true,b:<*1>${ ü_code },c:[(#1)]}`
        , '{"a5":true,"c":[null]}'
        ]
        /*
  //
    ü_01.forEach( ü_row => { ü_row[1] = 'Recursion' } );
    ü_01.splice( 0, ü_01  .length - 2 );
        */
      ] as [any,string,string,string][];
  //
    const ü_01 = ü_data.map( pickPair<any,string>( 0, 1 ) ); // Text expanded
    const ü_02 = ü_data.map( pickPair<any,string>( 0, 2 ) ); // Text
    const ü_03 = ü_data.map( pickPair<any,string>( 0, 3 ) ); // JSON
  //
    testFunction( echoAsString   , ü_02   );
    testFunction( echoAsStringExp, ü_01   );
  //
    testFunction( ß_JSON_stringify, ü_03, ö_expectRecursion );
    testFunction( echoAsJSON      , ü_03, ö_expectRecursion );
  //
function ö_expectRecursion( ü_x:any, ü_eX:any, ü_x_y:[any,string|void] ):string|void {
  //console.log( ü_eX )
    return ü_eX instanceof TypeError && ü_eX.message.startsWith( 'Converting circular structure to JSON' )
         ? ö_recursion
         : ` ${ ü_eX }`;
}
}

//====================================================================
/*
{
  a: true,
  b: <ref *1> { a1: true, b1: { a2: true, b2: [Circular *1] } }, 
  c: <ref *2> {
    a2: true,
    b2: <ref *1> { a1: true, b1: [Circular *2] }
  }
}
*/