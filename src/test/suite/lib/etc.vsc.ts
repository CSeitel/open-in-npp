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
  import { bindArguments
         } from '../../../lib/functionUtil';
  import { testSrc
         , whenAsyncFunctionTested
         , testFunction
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_(){
  //ß_trc&& ß_trc( ü_done.reason )
  //
    await whenChildProcessSpawned( __filename, [] );
  //whenShownInWindowsExplorer( __filename );
  //whenShownInOSExplorer( __filename );
  //
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