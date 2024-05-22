/*
*/
  import { type TOrderedPairs
         } from '../../../types/generic.d';
  import { CEFileType
         } from '../../../constants/vsc';
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../../runtime/context';
  import { threadShowError
         } from '../../../vsc/uiUtil';
  import { expectErrorCode
         } from '../../../lib/errorUtil';
  import { whenShownInWindowsExplorer
         , whenChildProcessSpawned
         } from '../../../lib/cpUtil';
  import { whenPromiseSettled
         } from '../../../lib/asyncUtil';
//--------------------------------------------------------------------
  import { asyncNullOperation
         , bindArguments
         } from '../../../lib/functionUtil';
  import { testSrc
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================
  export const tst_dispatch =  true ? asyncNullOperation
                                    : tst_a;
//====================================================================

export async function tst_a(){
    testEqual( '2', '1' );
}

//====================================================================

export async function tst_b(){
    testEqual( '2', '1' );
}

//====================================================================
/*
*/