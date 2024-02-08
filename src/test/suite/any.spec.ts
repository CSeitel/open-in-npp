/*
*/
  import { basename
         } from 'path';
  import { whenDelay
         , LockHandler
         } from '../../lib/asyncUtil';
  import { testSuite
         , testToggle
         } from '../../lib/testUtil';
//--------------------------------------------------------------------
  import * as ßß_suite from './lib/any.impl';
//====================================================================
  const ü_single = !true;
suite( 'Debug', ()=>{
    test( 'Single', testToggle( ßß_suite.tst_whenFileInfoRead, !ü_single ) );
});
  testSuite( basename( __filename ), ßß_suite, ü_single );
//====================================================================

class VscTestSpec {

static get some():number { return 1; }


static async test_0():Promise<void> {
    const ö_lock = new LockHandler( 'some', VscTestSpec );
    const ü_a = ö_cycle( 2 );
    const ü_b = ö_cycle( 1 );
    await ö_lock.whenLocked();
//
async function ö_cycle( ü_secs:number ):Promise<void> {
    await ö_lock.whenLocked();
    await whenDelay( ü_secs * 1000 );
    ö_lock.release();
}

}
}

//====================================================================
/*
*/