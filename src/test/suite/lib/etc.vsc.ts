/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { CEFileType
         } from '../../../constants/vsc';
/*
*/
  import { ß_trc
     
         } from '../../../runtime/context';
  import { whenOpenedInOSDefaultApp
         } from '../../../vsc/cmdUtil';
  import { expect
         } from '../../../lib/errorUtil';
  import { 
         } from '../../../lib/errorUtil';
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
    const ü_done = await whenPromiseSettled<1>( whenDoneWith( Promise.reject( new TypeError( 'Dummy Error' ) ), '{0}', 'a' ) );
  //ß_trc&& ß_trc( ü_done.reason )
    testEqual( true, !ü_done.rejected );
    testSummary();
}

//====================================================================