/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { testSrc
         , testSummary
         , testAsyncFunction
         , testFunction
         , testEqual
         , bindArgs
         } from '../../../lib/testUtil';
  import { whenDelay
         , whenTimeout
         } from '../../../lib/asyncUtil';
  import { ß_trc
         } from '../../../runtime/context';
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
    const ü_fref = bindArgs( ö_echo, { arrangeReal:[2] }, '_0','_1' )
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
    await testAsyncFunction( ö_someAsync, ü_data );
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