/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
  import { type IPromiseRejected
         } from '../../../types/lib.asyncUtil.d';
//--------------------------------------------------------------------
  import { format } from 'util';
  import { CEFileType
         } from '../../../constants/vsc';
  import { ß_trc
         } from '../../../runtime/context';
  import { whenOpenedInOSDefaultApp
         } from '../../../vsc/cmdUtil';
  import { summarizeError
         , ErrorMessage
         } from '../../../lib/errorUtil';
  import { isDirectInstanceOf
         } from '../../../lib/objectUtil';
  import { whenPromiseSettled
         , whenDoneWith
         } from '../../../lib/asyncUtil';
  import { testSrc
         , testSummary
         , testAsyncFunction
         , testFunction
         , testEqual
         , bindArgs
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_(){
    
  //
    return tst_error();
  //
    const ü_n = null as null|Array<1>;
  //
  //const ü_whenResaon = Promise.reject( new TypeError( 'Dummy Error' ) );
  //const ü_done = await whenPromiseSettled( whenDoneWith( ü_whenResaon, 'Failure: {0}', '0.0' )
  //                                       ) as IPromiseRejected<TypeError>;
    testEqual( 1, ü_n?.toString() || 1 );
    testSummary();
}

//====================================================================
class ErrorX        extends Error        { more = 12; }
class ErrorMessageX extends ErrorMessage { more = 12; }

export async function tst_error(){
  //
    const ü_errMsg  = new ErrorMessage ('w','u');
    const ü_errMsgX = new ErrorMessageX('w','u');
    const ü_err     = new Error        ('w')    ;
    const ü_errX    = new ErrorX       ('w')    ;
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
    testFunction( bindArgs( isDirectInstanceOf, { realFirst:true, arrangeBound:[1] }, ErrorMessage ), ü_data );
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
        ü_eX = new ErrorMessageX( '{0}', 'PREVIOUS' ).setReason( ü_eX );
        const ü_prot = Object.getPrototypeOf( ü_eX );
        ü_txt = summarizeError( new Error(), 'TEST' );
        ü_txt = summarizeError( new ErrorX(), 'TEST' );
        ü_txt = summarizeError( ü_eX, 'TEST' );
    }
    testEqual( ü_txt, '' );
    testSummary( 'Error' );
}

//====================================================================

export async function tst_syntax(){
    const ü_n = null as null|Array<1>;
    
    testEqual( null     , ü_n             );
    testEqual( undefined, ü_n?.toString() );
  //
    const ü_data =
      [ [ '', '' ]
      , [ `"${1}"`, '"1"' ]
      , [ '\n', '\n' ]
      , [ {}   , '{}'       ]
      , [ {a:1}, '{ a: 1 }' ]
      ] as TResultArray<any,string>;
  //
    testFunction( format, ü_data );
    testSummary( 'Syntax' );
}

//====================================================================
/*
*/