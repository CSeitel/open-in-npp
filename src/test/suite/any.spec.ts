/*
*/
  import { basename
         } from 'path';
  import { testSuite
         , testToggle
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ßß_suite from './lib/any.impl';
//====================================================================
  const ü_single = !true;
suite( 'Debug', ()=>{
    test( 'Single', testToggle( ßß_suite.tst_whenFileTypeKnown, !ü_single ) );
});
  testSuite( basename( __filename ), ßß_suite, ü_single );
//====================================================================
/*
*/