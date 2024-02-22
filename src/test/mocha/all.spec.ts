/*
*/
  import { testSuite
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ß_async from './lib/async.impl';
  import * as ß_fs    from './lib/fs.impl'   ;
  import * as ß_test  from './lib/test.impl' ;
  import * as ß_text  from './lib/text.impl' ;
//====================================================================
  main(  true ); // = NOT skip single test

async function main( ü_skipTests = false ):Promise<void> {
    let ü_rc = 0;
    ü_rc += await testSuite( 'Single', { Test: ß_text.tst_expandEnvVariables
                                     },!!ü_skipTests );
    ü_rc += await testSuite( 'Async' , ß_async,  ü_skipTests );
    ü_rc += await testSuite( 'Fs'    , ß_fs   ,  ü_skipTests );
    ü_rc += await testSuite( 'Test'  , ß_test , !ü_skipTests );
    ü_rc += await testSuite( 'Text'  , ß_text ,  ü_skipTests );
    console.log( 'rr'+ü_rc );
    process.exit( ü_rc );
}

//====================================================================
/*
*/