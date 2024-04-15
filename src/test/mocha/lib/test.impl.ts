/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
  import { type TBind
         } from '../../../types/lib.functionUtil.d';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../../runtime/context';
  import { whenDelay
         , whenTimeout
         , whenPromiseMapped
         } from '../../../lib/asyncUtil';
  import { bindArguments
         , bindAppending
         } from '../../../lib/functionUtil';
  import { testSrc
         , testSummary
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_bindArgs(){
  //const ö_whenMapped = bindArguments( whenPromiseMapped<number,string>, { realFirst:true }, parseInt );
    const ö_whenMapped = bindAppending( whenPromiseMapped<number,string>                    , parseInt );
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
    testEqual( await bindArguments( ö_whenDone, { prepare:{0:parseInt}, refine:ö_whenMapped }, '1' )(), 1 );
  //
    testSummary( 'Complex-Bind' );
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

export async function tst_a(){
    ß_trc&& ß_trc( 'A '+Date.now() );
    testEqual( 1 , 0 );
    await whenDelay( 1500 );

    ß_trc&& ß_trc( 'A '+Date.now() );
    testSummary( 'Aaa' );
}

export async function tst_b(){
    ß_trc&& ß_trc( 'B '+Date.now() );
    testEqual( 2 , 0 );
    await whenDelay( 100 );
    ß_trc&& ß_trc( 'B '+Date.now() );
    testSummary( 'Bbb' );
}

//====================================================================

export async function tst_testEquals_1(){
    testEqual( {}, {}, '9999' )
    testEqual(  0,  0 )
    testEqual(  0,  0 )
    const ü_fref = bindArguments( ö_echo, { arrangeReal:[2] }, '_0','_1' )
    testFunction( ü_fref, [['A_','_0\t_1\tA_']] as TResultArray<string,string> )
    testSummary();
    //strictEqual( 0, 1, ü_all.join('\r\n') )
function ö_echo<T>( ...ü_args:T[] ):string {
    return ü_args.join( '\t' );
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
    testSummary();
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
/*
*/