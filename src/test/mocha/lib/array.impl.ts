/*
*/
  import { ß_trc
         } from '../../../runtime/context';
  import { asyncNullOperation
         } from '../../../lib/functionUtil';
  import { testSrc
         , testEqual
         } from '../../../lib/testUtil';
//--------------------------------------------------------------------
  import { putFirst
         } from '../../../lib/arrayUtil';
//====================================================================
  export const tst_dispatch = asyncNullOperation;
//====================================================================

export async function tst_basic(){
    const ü_item_1 = 2;
    const ü_list_1 =   [0,1,ü_item_1];
    putFirst ( ü_list_1   , ü_item_1 );
    testEqual( ü_list_1[0], ü_item_1 );
  //
    const ü_item_2 = {a:2};
    const ü_list_2 = [{a:0},{a:1},
                            ü_item_2];
    putFirst ( ü_list_2   , ü_item_2.a, 'a' );
    testEqual( ü_list_2[0], ü_item_2        );
  //
}

//====================================================================
/*
*/