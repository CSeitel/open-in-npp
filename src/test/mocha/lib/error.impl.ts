/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { format
         } from 'util';
  import { ß_trc
         } from '../../../runtime/context';
  import { stringifyUpToSuper
         , summarizeError
         , ErrorWithUixMessage
         } from '../../../lib/errorUtil';
  import { isDirectInstanceOf
         } from '../../../lib/objectUtil';
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
    return tst_print();
  //
    testSummary();
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
    testSummary();
}

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
    testFunction( bindArgs( isDirectInstanceOf, { realFirst:true, arrangeBound:[1] }, ErrorWithUixMessage ), ü_data );
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
    testSummary( 'Error' );
}

//====================================================================
/*
*/