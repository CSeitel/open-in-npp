/*
*/
  import { type TOrderedPair
         } from '../../../types/lib.arrayUtil.d';
//--------------------------------------------------------------------
  import { format
         } from 'util';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../../runtime/context';
  import { summarizeError
         , ErrorWithUixMessage
         } from '../../../lib/errorUtil';
  import { isDirectInstanceOf
         } from '../../../lib/objectUtil';
  import { bindArguments
         } from '../../../lib/functionUtil';
  import { testSrc
         , testSummary_
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_(){
  //
    return tst_class();
  //
    testSummary_();
}

//====================================================================

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
      ] as TOrderedPair<object,boolean>;
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
      ] as TOrderedPair<any,string>;
  //
    testFunction( format, ü_data );
    testSummary_( 'Syntax' );
}

//====================================================================

export async function tst_class(){
  //
function ö_Class( this:any ):TClass {
    Object.assign( this, ü_class );
    return this;
}
class Ö_Class {
    prop = ['Class']
}
  //
    const ü_super = { super:['proto'] };
    const ü_class = { prop :['class'] };
    ö_Class.prototype = ü_super;
    ü_super.constructor = ö_Class;
    type TClass = typeof ü_class & typeof ü_super & Object
  //
    const ü_inst = new (<any> ö_Class)() as TClass;
    const ü_Inst = new Ö_Class();
    const ü_prot = Object.getPrototypeOf( ü_inst );
    const ü_Prot = Object.getPrototypeOf( ü_Inst );
    const ü_prt2 = Object.getPrototypeOf( ü_prot );
  //
    testEqual( ü_Inst.hasOwnProperty( 'prop'        ), true  );
    testEqual( ü_inst.hasOwnProperty( 'prop'        ), true  );
    testEqual( ü_inst.hasOwnProperty( 'super'       ), false );
    testEqual( ü_inst.hasOwnProperty( 'constructor' ), false );
    testEqual( ü_Inst.hasOwnProperty( 'constructor' ), false );
    testEqual( ü_prot, ü_super           );
    testEqual( ü_Prot, Ö_Class.prototype );
    testEqual( ü_prot.hasOwnProperty( 'constructor' ), true  );
    testEqual( ü_Prot.hasOwnProperty( 'constructor' ), true  );
    testEqual( ü_prt2.hasOwnProperty( 'constructor' ), true  );
    testEqual( ( ü_inst as any ).constructor, ö_Class );
    testEqual(   ü_Inst         .constructor, Ö_Class );
    testEqual(   ü_prot         .constructor, ö_Class );
    testEqual(   ü_Prot         .constructor, Ö_Class );
    testEqual(   ü_prt2         .constructor, Object  );
    testEqual( ü_inst.super, ü_super.super );
    testEqual( ü_inst.prop , ü_class.prop  );
  //
    testSummary_( 'Class' );
}

//====================================================================
/*
*/