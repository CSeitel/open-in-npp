/*
*/
  import { testSuite
         , whenTestSuite
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_a   from './lib/a.impl'   ;
  import * as ß_any from './lib/any.impl' ;
//====================================================================
export async function run():Promise<void> {
  const ß_skipTests =  true; // = NOT skip single test

  testSuite( 'Single'   , { Test: ß_a.tst_
                            } , !ß_skipTests );
  await whenTestSuite();
  testSuite( 'Any'      , ß_any, ß_skipTests );
  await whenTestSuite();
}
//====================================================================
//====================================================================
/*
*/