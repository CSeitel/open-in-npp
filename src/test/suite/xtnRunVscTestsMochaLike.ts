/*
*/
  import { type TAllSpecsModule
         } from '../../types/test.d';
//--------------------------------------------------------------------
  import { join
         } from 'path';
//import '../../runtime/context-XTN';
  import { ß_trc
         } from '../../runtime/context';
  import { // for reference
         } from './all.spec';
//====================================================================

export async function run():Promise<void> {
  // externalApi
    const ü_main = join( __dirname, './all.spec' );
    ß_trc&& ß_trc( ü_main, 'MochaLike-Runner' );
    const ü_triggered = require( ü_main ) as TAllSpecsModule;
    const ü_failed    = ( await ü_triggered.whenTestSummary ).failed;
  //
    true || process.exit( ü_failed ); // implemented by main
}

//====================================================================
/*
*/