/*
*/
//--------------------------------------------------------------------
  import { strictEqual
         } from 'assert';
  import { whenDelay
         , UniqueResource
         , LockHandler
         } from '../../../lib/asyncUtil';
  import { testSummary
         , testEqual
         } from '../../../lib/testUtil';
  import { ß_trc
         } from '../../../runtime/context';
//====================================================================

export async function tst_UR(){
    const ö_usrc = new UniqueResource( {a:1} );
    const ü_id = 'init';
    const ü_when = ö_usrc.whenAvailable( 'init' );
    testEqual( ö_usrc.isPending( ü_id ), true );
  //
    const ü_done = await ü_when;
    testEqual( ö_usrc.getResource( ü_done ).a, 1 );
    try {
        ö_usrc.getResource( async()=>{} )
    } catch ( ü_eX ) {
        testEqual( ü_eX, ö_usrc.locked );
    }
  //
    const ü_eX = new TypeError( 'Dummy' );
    try {
        throw ü_eX;
        ü_done();
    } catch ( ü_eX ) {
        try {
            await ü_done( ü_eX );
            testEqual( 1, 0 );
        } catch (error) {
            testEqual( error, ü_eX );
        }
  //} finally {
    }
  //
    let ö_some = 0;
    ö_access( 3 )
    ö_access( 1 )
    await whenDelay( 0 );
    await whenDelay( 5 * 100 );
    testEqual( ö_some, 1  );
  //
    const ü_all = testSummary( strictEqual, 'UniqueResource' );
    console.log( ü_all );
//
async function ö_access( ü_secs:number ):Promise<void> {
    const ü_done = await ö_usrc.whenAvailable( ''+ü_secs );
    await whenDelay( ü_secs * 100 );
    ü_done();
    ü_done();
    ö_some = ü_secs;
}
}

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