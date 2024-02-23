/*
*/
  import { whenAllTestsRun
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_a   from './lib/a.impl'   ;
  import * as ß_any from './lib/any.impl' ;
//====================================================================
export async function run():Promise<void> {

    const ß_skipTests =  true; // = except single test
    whenAllTestsRun([
        [ 'Single'   , [ ß_a.tst_
                           ], !ß_skipTests ]
      , [ 'Any'      , ß_any,  ß_skipTests ]
      ]);

}
//====================================================================
/*
*/