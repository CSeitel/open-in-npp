/*
*/
  import { whenTestSuite
         , suiteSummary
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_async from './lib/async.impl';
  import * as ß_fs    from './lib/fs.impl'   ;
  import * as ß_test  from './lib/test.impl' ;
  import * as ß_text  from './lib/text.impl' ;
//====================================================================
  main(  true ); // = NOT skip single test

async function main( ü_skipTests = false ):Promise<void> {
  //
    await whenTestSuite( 'Single', { Test: ß_text.tst_expandEnvVariables
                                         },!!ü_skipTests );
    await whenTestSuite( 'Async' , ß_async,  ü_skipTests );
    await whenTestSuite( 'Fs'    , ß_fs   ,  ü_skipTests );
    await whenTestSuite( 'Test'  , ß_test , !ü_skipTests );
    await whenTestSuite( 'Text'  , ß_text ,  ü_skipTests );
  //
    const ü_rc = suiteSummary();
    process.exit( ü_rc );
}

//====================================================================
/*
*/