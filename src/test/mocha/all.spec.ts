/*
*/
  import { testSuite
         , testToggle
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_fs    from './lib/fs.impl';
  import * as ß_async from './lib/async.impl';
//====================================================================
  const ß_skipTests =  true;

  testSuite( 'Single', { Test: ß_async.tst_UR }
                              , !ß_skipTests );
  testSuite( 'Async' , ß_async,  ß_skipTests );
  testSuite( 'fs'    , ß_fs   ,  ß_skipTests );

//====================================================================
/*
*/