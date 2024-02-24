/*
*/
  import { whenAllTestsRun
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_any   from './lib/a.impl';
//====================================================================

  const ß_skipTests =  true; // = except single test
  whenAllTestsRun([
      [ 'Single', [ ß_any.tst_dbg
                      ], !ß_skipTests ]
    , [ 'Any'   , ß_any,  ß_skipTests ]
    ]);

//====================================================================
/*
*/