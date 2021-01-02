/*
*/
//------------------------------------------------------------------------------
/*
*/
  import   ExtensionRuntime
           from '../../extension';
  import { whenDelay
         , LockHandler
         } from '../../lib/any';
  import   TestRuntime
           from './index';
  const ß_trc = TestRuntime.developerTrace;
//==============================================================================

class VscTestSpec {

static get some():number {
    return 1;
}

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

//==============================================================================

suite( 'Library ANY', () => {

  test( 'INIT'           , VscTestSpec.test_0    );
/*
  test( 'Execute Command', VscTestSpec.openInNpp );
  test( 'Env'            , VscTestSpec.test_2    );
*/
});

//==============================================================================
/*
*/