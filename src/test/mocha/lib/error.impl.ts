/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
  import { type IUiXMessage
         } from '../../../types/lib.errorUtil.d';
//--------------------------------------------------------------------
  import { format
         } from 'util';
  import { ß_trc
         } from '../../../runtime/context';
  import { stringifyUpToSuper
         , summarizeError
         , ErrorWithUixMessage
         } from '../../../lib/errorUtil';
  import { whenDoneWithUiXMessage
         , whenDoneAndPostProcessed
         } from '../../../lib/asyncUtil';
  import { isDirectInstanceOf
         } from '../../../lib/objectUtil';
  import { bindArguments
         , bindAppending
         } from '../../../lib/functionUtil';
  import { testSrc
         , testSummary_
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_dispatch(){
    return tst_UiX();
}

//====================================================================

export async function tst_print(){
class ö_ClassA extends Object   { aaa = 12; }
class ö_ClassB extends ö_ClassA { bbb = 12; }
    const ü_ss =   new ö_ClassB()
    const ü_c = stringifyUpToSuper( ü_ss );
  //
    const ü_oref_a = new TypeError( 'ABC' );
    const ü_a = stringifyUpToSuper( ü_oref_a );
    const ü_oref_b = Object.create( { name:'TypeError', message:'' } )
          ü_oref_b.message = 'ABC'
          ü_oref_b.stack = ü_oref_a.stack;
    const ü_b = stringifyUpToSuper( ü_oref_b );
  //
    let s = '';
    for ( const ü_mKey in ü_oref_a ) { s += ü_mKey; }
  //
    testSummary_();
}

//====================================================================

export async function tst_UiX(){
    const ü_data_true =
      [
        [ Promise.reject (                      new Error('A')     ), 'Error: A' ]
      , [ Promise.resolve( 2 ).then(()=>{ throw new Error('B'); }  ), 'Error: B' ]
      , [ Promise.reject ( 3 )                                      , '3'        ]
      , [ Promise.reject ( new ErrorWithUixMessage( 'X:{0}', 'C' ) ), 'X:C'      ]
      , [ Promise.resolve( 1 )                                      , 'YES:1'    ]
    /*
    */
      ] as TResultArray<object,string>;
    const ü_data_with = ü_data_true.slice(0).map(function(row){  return row.slice(0);  }) as TResultArray<object,string>;
          ü_data_with[0][1] = 'NO:' + ü_data_with[0][1] ;
          ü_data_with[1][1] = 'NO:' + ü_data_with[1][1] ;
          ü_data_with[2][1] = 'NO:' + ü_data_with[2][1] ;
          ü_data_true[2][1] = 'ß'   + ü_data_true[2][1] ;
    const ü_data_none = ü_data_true.slice(0).map(function(row){  return row.slice(0);  }) as TResultArray<object,string>;
          ü_data_none[0][1] = 'ß'   + ü_data_true[0][1] ;
          ü_data_none[1][1] = 'ß'   + ü_data_true[1][1] ;
  //
    const ü_with = whenDoneAndPostProcessed( bindAppending( whenDoneWithUiXMessage, 'YES:{0}', 'NO:{0}' ), ö_finalize );
    const ü_true = whenDoneAndPostProcessed( bindAppending( whenDoneWithUiXMessage, 'YES:{0}', true     ), ö_finalize );
    const ü_none = whenDoneAndPostProcessed( bindAppending( whenDoneWithUiXMessage, 'YES:{0}'           ), ö_finalize );
  //
    await whenAsyncFunctionTested( ü_with, ü_data_with          );
    await whenAsyncFunctionTested( ü_true, ü_data_true, ö_error );
    await whenAsyncFunctionTested( ü_none, ü_data_none, ö_error );
  //
    testSummary_();
  //
function ö_finalize( val:IUiXMessage ):string {
    return val.text;
}
function ö_error( ü_x:object, ü_eX:any, ü_y:string ):string {
    return 'ß' + ü_eX;
}
}

//--------------------------------------------------------------------
export async function tst_error(){
class ö_ErrorX        extends Error        { more = 12; }
class ö_ErrorMessageX extends ErrorWithUixMessage { more = 12; }
  //
    const ü_errMsg  = new   ErrorWithUixMessage ('w','u');
    const ü_errMsgX = new ö_ErrorMessageX('w','u');
    const ü_err     = new   Error        ('w')    ;
    const ü_errX    = new ö_ErrorX       ('w')    ;
  //
    const ü_errMsg_Y  = summarizeError( ü_errMsg , 'TEST' );
    const ü_errMsgX_Y = summarizeError( ü_errMsgX, 'TEST' );
    const ü_err_Y     = summarizeError( ü_err    , 'TEST' );
    const ü_errX_Y    = summarizeError( ü_errX   , 'TEST' );
  //
    const ü_data =
      [ [ ü_errMsg  , true  ]
      , [ ü_errMsgX , false ]
      , [ ü_err     , false ]
      , [ ü_errX    , false ]
      ] as TResultArray<object,boolean>;
    testFunction( bindArguments( isDirectInstanceOf, { realFirst:true, arrangeBound:[1] }, ErrorWithUixMessage ), ü_data );
  //
        const ü_prot_a = Object.getPrototypeOf( ü_errMsgX );
        const ü_prot_b = Object.getPrototypeOf( ü_errMsg );
        const ü_prot_c = Object.getPrototypeOf( ü_err );
  //
    const ü_errX_Z_ = format(                        ü_errX       );
    const ü_errX_Z  = format( Object.setPrototypeOf( ü_errX, {} ) );
    const ü_err_Z_  = format(                        ü_err        );
    const ü_err_Z   = format( Object.setPrototypeOf( ü_err , {} ) );
  //
    let ü_txt = ''
    try {
        throw 3;
      //ß_trc&& ß_trc( ü_i );
    } catch ( ü_eX ) {
        ü_eX = new ö_ErrorMessageX( '{0}', 'PREVIOUS' ).setReason( ü_eX );
        const ü_prot = Object.getPrototypeOf( ü_eX );
        ü_txt = summarizeError( new Error (), 'TEST' );
        ü_txt = summarizeError( new ö_ErrorX(), 'TEST' );
        ü_txt = summarizeError( ü_eX, 'TEST' );
    }
    testEqual( ü_txt, '' );
    testSummary_( 'Error' );
}

//====================================================================
/*
*/