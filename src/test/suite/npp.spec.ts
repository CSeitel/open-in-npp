/*
*/
  import { whenTestSuite
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_any   from './lib/a.impl';
//====================================================================
  main(  true ); // = NOT skip single test

async function main( ü_skipTests = false ):Promise<void> {
    await whenTestSuite( 'Single', { Test: ß_any.tst_
                                   }, !ü_skipTests );
    await whenTestSuite( 'Any'   , ß_any,  ü_skipTests );
}

//====================================================================
/*
*/