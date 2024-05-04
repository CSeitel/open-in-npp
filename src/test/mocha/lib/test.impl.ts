/*
*/
  import { type TOrderedPairs
         } from '../../../types/generic.d';
  import {
         } from '../../../types/lib.functionUtil.d';
  import { TAsyncFunctionSingleArg
         } from '../../../types/generic.d';
//--------------------------------------------------------------------
  import { ß_trc
         , ß_stringify
         } from '../../../runtime/context';
  import { includes
         } from '../../../lib/arrayUtil';
  import { whenDelay
         , createWhenResolved
         , createAsyncPostProcessor
         , whenDoneAndPostProcessed
         } from '../../../lib/asyncUtil';
  import { bindArguments
         , bindAppending
         , identityMap
         } from '../../../lib/functionUtil';
  import { testSrc
         , testEqual
         , testFunction
         , whenAsyncFunctionTested
         } from '../../../lib/testUtil';
//====================================================================
//export const tst_dispatch = tst_function;
//====================================================================

export async function tst_bindArguments(){
  //const ö_whenMapped = bindArguments( whenPromiseMapped<number,string>, { realFirst:true }, parseInt );
  //const ö_whenMapped = bindAppending( whenPromiseMapped<number,string>                    , ß_stringify );
    const ü_whenStringified = createAsyncPostProcessor( ß_stringify );
  //
    testEqual( bindArguments( ö_sorted, { realFirst:false }, 'b1','b2' )( 'r1','r2' ), 'b1b2r1r2' );
    testEqual( bindArguments( ö_sorted, { realFirst:false  , arrangeReal :[1]
                                                           , arrangeBound:{1:2} }
                                                           , 'b1','b2' )( 'r1','r2' ), 'b1r1b2r2' );
    testEqual( bindArguments( ö_sorted, { realFirst:true  }, 'b1','b2' )( 'r1','r2' ), 'r1r2b1b2' );
    testEqual( bindArguments( ö_sorted, { realFirst:true   , arrangeBound:[1]
                                                           , arrangeReal :{1:2} }
                                                           , 'b1','b2' )( 'r1','r2' ), 'r1b1r2b2' );
  //
    testEqual( await                             bindArguments( ö_whenDone, { prepare:{0:parseInt}, refine:ü_whenStringified }, '1' )               (     )  , '1' );
    testEqual( await ü_whenStringified         ( bindArguments( ö_whenDone, { prepare:{0:parseInt}                           }      )               ( '2' ) ), '2' );
    testEqual( await   whenDoneAndPostProcessed( bindArguments( ö_whenDone, { prepare:{0:parseInt}                           }      ), ß_stringify )( '3' )  , '3' );
  //
function ö_sorted( ...ü_args:string[] ):string {
    return ü_args.join( '' );
}
async function ö_whenDone( ü_nmbr:number ):Promise<number>{
  //await whenTimeout(  'w' );
    await whenDelay( 1 );
    return ü_nmbr;
}
}

//====================================================================

export async function tst_function(){
  //
    const ö_data_1 =
      [ [  0, 0 ]
      , [  1, 1 ]
      ] as TOrderedPairs<number,number>;
    const ö_data_2 =
      [ [ {}, 0 ]
      , [ {}, 1 ]
      ] as TOrderedPairs<{}    ,number>;
    const ö_map_1 = new Map( ö_data_1 );
    const ö_map_2 = new Map( ö_data_2 );
  //
    testFunction( identityMap, ö_map_1              );
    testFunction( ö_throw_1  , ö_data_1, ö_expErr_1 );
    testFunction( ö_throw_2  , ö_map_2 , ö_expErr_2 );
  //testFunction( ö_throw_2  , ö_map_2 , ö_throw_2  );
  //
    const ü_throw_3 = whenDoneAndPostProcessed( createWhenResolved<number>, ö_throw_1 );
    const ü_throw_4 = whenDoneAndPostProcessed( createWhenResolved<{}>    , ö_throw_2 );
    const ü_throw_5 = ö_throw_2 as TAsyncFunctionSingleArg<number,{}>
    await whenAsyncFunctionTested( createWhenResolved , ö_map_1              );
    await whenAsyncFunctionTested( ü_throw_3          , ö_data_1, ö_expErr_1 );
    await whenAsyncFunctionTested( ü_throw_4          , ö_map_2 , ö_expErr_2 );
  //await whenAsyncFunctionTested( ü_throw_4          , ö_map_2 , ö_throw_2  );
    await whenAsyncFunctionTested( ü_throw_5          , ö_map_2 , ö_expErr_2 );
  //
function ö_throw_1( ü_indx:number ):never {
    switch ( ü_indx ) {
        case  0: throw new Error( '0' );
        case  1: throw new Error( '1' );
        default: throw new Error( '_' );
    }
}
function ö_throw_2( ü_reason:{} ):never {
    throw ü_reason;
}
function ö_expErr_1( ü_x:number, ü_eX:any, ü_x_y:[number,number] ):number {
        const ü_indx = includes( ö_data_1, ü_x_y );
        const ü_jndx = parseInt( (ü_eX as Error).message );
        return ü_indx === ü_jndx && ü_indx === ü_x
             ? ü_indx : -1;
}
function ö_expErr_2( ü_x:{}, ü_eX:any ):number {
        const ü_indx = ö_map_2.get( ü_x )!;
        return ü_x === ü_eX
             ? ü_indx : -1;
}
}

//====================================================================
/*
*/