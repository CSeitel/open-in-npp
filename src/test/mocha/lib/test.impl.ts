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
         , bind
         } from '../../../lib/testUtil';
  import { whenDelay
         } from '../../../lib/asyncUtil';
  import { ß_trc
         } from '../../../runtime/context';
//====================================================================

export async function tst_a(){
    testEqual( 1 , 0 );
    ß_trc&& ß_trc( testSummary( 'Aaa' ) );
}

export async function tst_b(){
    testEqual( 1 , 0 );
    ß_trc&& ß_trc( testSummary( 'Bbb' ) );
}

/*
*/
