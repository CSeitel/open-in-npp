/*
*/
  import { type TAllSpecsModule
         } from '../../types/test';
//--------------------------------------------------------------------
  import { join
         } from 'path';
//import '../../runtime/context-XTN';
  import { ß_trc
         } from '../../runtime/context';
//====================================================================

export async function run():Promise<number> {
    const ü_spec = join( __dirname, './all.spec' );
    ß_trc&& ß_trc( ü_spec, 'All Tests' );
    const ü_allSpecs = require( ü_spec ) as TAllSpecsModule;
     const ü_sum = await ü_allSpecs.whenTestSummary;
    return ü_sum.failed;
}

//====================================================================
/*
*/