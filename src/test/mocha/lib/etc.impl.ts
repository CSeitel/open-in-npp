/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
  import { type IPromiseRejected
         } from '../../../types/lib.asyncUtil.d';
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
    const ü_whenResaon = Promise.reject( new TypeError( 'Dummy Error' ) );
    const ü_done = await whenPromiseSettled( whenDoneWith( ü_whenResaon, 'Failure: {0}', '0.0' )
                                           ) as IPromiseRejected<TypeError>;
    testEqual( true, ü_done.rejected );
    testSummary();
}

//====================================================================