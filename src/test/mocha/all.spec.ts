/*
*/
  import { testSuite
         , whenTestSuite
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_async from './lib/async.impl';
  import * as ß_fs    from './lib/fs.impl'   ;
  import * as ß_test  from './lib/test.impl' ;
  import * as ß_text  from './lib/text.impl' ;
//====================================================================
  const ß_skipTests =  true; // = NOT skip single test

  testSuite( 'Single', { Test: ß_text.tst_expandEnvVariables
                             },!!ß_skipTests );
  testSuite( 'Async' , ß_async,  ß_skipTests );
  testSuite( 'Fs'    , ß_fs   ,  ß_skipTests );
  testSuite( 'Test'  , ß_test , !ß_skipTests ); main();
  testSuite( 'Text'  , ß_text ,  ß_skipTests );

//====================================================================
async function main() {
  await whenTestSuite();
}
/*
*/