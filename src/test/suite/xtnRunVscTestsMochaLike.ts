/*
*/
  import { join
         } from 'path';
//import '../../runtime/context-XTN';
  import { ß_trc
         } from '../../runtime/context';
//--------------------------------------------------------------------
//====================================================================

export async function run():Promise<number> {
    type TAllSpecs = { whenAllTestsExecuted:Promise<number> }
    const ü_spec = join( __dirname, './all.spec' );
    ß_trc&& ß_trc( ü_spec, 'All Tests' );
    const ü_allSpecs = require( ü_spec ) as TAllSpecs;
    const ü_rc = await ü_allSpecs.whenAllTestsExecuted;
    return ü_rc;
}

//====================================================================
/*
*/