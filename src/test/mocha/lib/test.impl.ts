/*
*/
  import { type TOrderedPairArray
         } from '../../../types/lib.arrayUtil.d';
  import {
         } from '../../../types/lib.functionUtil.d';
//--------------------------------------------------------------------
  import { ß_trc
         , ß_stringify
         } from '../../../runtime/context';
  import { whenDelay
         , whenTimeout
         , createAsyncPostProcessor
         , whenDoneAndPostProcessed
         } from '../../../lib/asyncUtil';
  import { bindArguments
         , bindAppending
         , identityMap
         , whenValuePassedBack
         } from '../../../lib/functionUtil';
  import { testSrc
         , testSummary_
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_dispatch(){
    return tst_self();
    await  tst_self();
}

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

export async function tst_self(){
  //
    const ö_data_1 =
      [ [  0, 0 ]
      , [  1, 1 ]
      ] as TOrderedPairArray<number,number>;
    const ö_data_2 =
      [ [ {}, 0 ]
      , [ {}, 1 ]
      ] as TOrderedPairArray<{}    ,number>;
    const ö_map = new Map( ö_data_2 );
  //
    testFunction( identityMap, new Map( ö_data_1 ) );
    testFunction( ö_throw_1    ,          ö_data_1, function( ü_x_y, ü_eX ){
        const ü_indx = ö_data_1.findIndex( x_y => x_y === ü_x_y );
        const ü_jndx = parseInt( (ü_eX as Error).message );
        return ü_indx === ü_jndx ? ü_indx : -1;
    });
    testFunction( ö_throw_2    , ö_map, function( ü_x_y, ü_eX ){
        const ü_indx = ö_map.get( ü_x_y[0] );
      //const ü_jndx = parseInt( (ü_eX as Error).message );
        return ü_indx!;
    }
  );
  //
    await whenAsyncFunctionTested( whenValuePassedBack, ö_data_1 );
  //await whenAsyncFunctionTested( whenDelay, ü_data );
  //const ü_whenDone = whenDoneAndPostProcessed( whenDelay, identityMap.bind( null, 1 ) );
  //
function ö_throw_1( ü_indx:number ):never {
    switch ( ü_indx ) {
        case 0: throw new Error( '0' );
        case 1: throw new Error( '1' );
        default: throw new Error( '_' );
    }
}
function ö_throw_2( ü_indx:{} ):never {
    ö_throw_1( 0 )
}
}

export async function tst_testEquals(){
  //
    const ü_data = new Map<string,boolean>( );
          ü_data.set( 'true' , true  );
          ü_data.set( 'false', false );
          ü_data.set( '_'    , false );
  //
    await whenAsyncFunctionTested( ö_someAsync, ü_data );
    testSummary_();
  //
async function ö_someAsync( ü_text:string ):Promise<boolean> {
    await whenTimeout();
    switch ( ü_text ) {
        case 'true' : return true ;
        case 'false': return false;
        default: throw new TypeError( `Not a boolean: ${ ü_text }` );
    }
  //
}

}

//====================================================================

export async function tst_a(){
    ß_trc&& ß_trc( 'A '+Date.now() );
    testEqual( 1 , 0 );
    await whenDelay( 1500 );

    ß_trc&& ß_trc( 'A '+Date.now() );
    testSummary_( 'Aaa' );
}

export async function tst_b(){
    ß_trc&& ß_trc( 'B '+Date.now() );
    testEqual( 2 , 0 );
    await whenDelay( 100 );
    ß_trc&& ß_trc( 'B '+Date.now() );
    testSummary_( 'Bbb' );
}

//====================================================================

export async function tst_testEquals_1(){
    testEqual( {}, {}, '9999' )
    testEqual(  0,  0 )
    testEqual(  0,  0 )
    const ü_fref = bindArguments( ö_echo, { arrangeReal:[2] }, '_0','_1' )
    testFunction( ü_fref, [['A_','_0\t_1\tA_']] as TOrderedPairArray<string,string> )
    testSummary_();
    //strictEqual( 0, 1, ü_all.join('\r\n') )
function ö_echo<T>( ...ü_args:T[] ):string {
    return ü_args.join( '\t' );
}
}

//====================================================================
/*
*/