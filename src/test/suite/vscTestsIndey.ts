/*
*/
  import { whenAllTestsRun
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_a  from './lib/a.impl'   ;
  import * as ß_fs from './lib/fs.impl' ;
//====================================================================
export async function run():Promise<void> {

    const ß_skipTests =  true; // = except single test
    await whenAllTestsRun([
        [ 'Single'   , [ ß_a.tst_dbg
                           ], !ß_skipTests ]
      , [ 'fs'       , ß_fs,  ß_skipTests ]
      ]);

}
//====================================================================
/*
*/