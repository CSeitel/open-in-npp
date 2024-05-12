/*
*/
  import { type TOrderedPairs
         } from '../../../types/generic.d';
//--------------------------------------------------------------------
  import { format
         } from 'util';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../../runtime/context';
  import { asyncNullOperation
         } from '../../../lib/functionUtil';
  import { whenShownInWindowsExplorer
         , whenChildProcessSpawned
         } from '../../../lib/cpUtil';
  import { testSrc
         , testEqual
         , testFunction
         , whenAsyncFunctionTested
         } from '../../../lib/testUtil';
//====================================================================
  export const tst_dispatch = asyncNullOperation;
//====================================================================

export async function tst_cp(){
    const ü_done = await whenShownInWindowsExplorer( __filename );
    testEqual( ü_done, true );
}

//====================================================================

export async function tst_syntax(){
  //
                    const ü_null = null as null|Array<1>;
    testEqual( null     , ü_null             );
    testEqual( undefined, ü_null?.toString() );
}

export async function tst_format(){
  //
    const ü_data =
      [ [ '', '' ]
      , [ `"${1}"`, '"1"' ]
      , [ '\n', '\n' ]
      , [ {}   , '{}'       ]
      , [ {a:1}, '{ a: 1 }' ]
      ] as TOrderedPairs<any,string>;
  //
    testFunction( format, ü_data );
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
}

//====================================================================
/*
*/