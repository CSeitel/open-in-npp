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

/*
*/
