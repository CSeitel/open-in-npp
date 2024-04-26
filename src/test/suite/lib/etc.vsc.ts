/*
*/
  import { type TOrderedPairArray
         } from '../../../types/lib.arrayUtil.d';
  import { CEFileType
         } from '../../../constants/vsc';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../../runtime/context';
  import { threadShowError
         } from '../../../vsc/uiUtil';
  import { expect
         } from '../../../lib/errorUtil';
  import { whenShownInWindowsExplorer
         , whenChildProcessSpawned
         } from '../../../lib/cpUtil';
  import { whenPromiseSettled
         , whenDoneWith
         } from '../../../lib/asyncUtil';
//--------------------------------------------------------------------
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
    const ü_done = await whenPromiseSettled<1>( whenDoneWith( Promise.reject( new TypeError( 'Dummy Error' ) ), '{0}', 'a' ) );
  //ß_trc&& ß_trc( ü_done.reason )
  //
    await whenChildProcessSpawned( __filename, [] );
  //whenShownInWindowsExplorer( __filename );
  //whenShownInOSExplorer( __filename );
  //
    testEqual( true, ü_done.rejected );
    testSummary_();
}

//====================================================================

export async function tst_show(){
    try {
        
    } catch ( ü_eX ) {
        threadShowError( ü_eX, 'Outer' );
    }
}

//====================================================================
/*
*/