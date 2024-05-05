/*
*/
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../../runtime/context';
  import { whenDelay
         , UniqueResource
         , LockHandler
         , AsyncCalculation
         } from '../../../lib/asyncUtil';
  import { asyncNullOperation
         , bindAppending
         } from '../../../lib/functionUtil';
  import { testSrc
         , testNever
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================
  export const tst_dispatch = tst_UniqueResource;
//====================================================================

export async function tst_UniqueResource(){
  //
    const ü_data = {a:1};
    const ö_uSrc = new UniqueResource( ü_data );
    const ü_id = 'init';
    testEqual( ö_uSrc.isPending( ü_id ), false );
    const ü_when = ö_uSrc.whenAvailable<undefined>( 'init' );
    testEqual( ö_uSrc.isPending( ü_id ), true  );
    const ü_release = await ü_when;
    testEqual( ö_uSrc.isPending( ü_id ), true  );
  //
    testEqual( ö_uSrc.getResource( ü_release ), ü_data );
  //
    try {
        ö_uSrc.getResource( asyncNullOperation );
        testNever();
    } catch ( ü_eX ) {
        testEqual( ü_eX instanceof Error, true );
    }
  //
               const ü_eX = new TypeError( 'Dummy' );
    await ü_release( ü_eX ).then(                testNever
                                , bindAppending( testEqual, ü_eX, 'Rethrow' )
                                );
  //
    let ö_some = 0;
    ö_access( 3 )
    ö_access( 1 )
    await whenDelay( 0 );
    await whenDelay( 5 * 100 );
    testEqual( ö_some, 1  );
  //
async function ö_access( ü_secs:number ):Promise<void> {
    const ü_done = await ö_uSrc.whenAvailable( ''+ü_secs );
    await whenDelay( ü_secs * 100 );
    ü_done();
    ü_done();
    ö_some = ü_secs;
}
}

//====================================================================

export async function tst_XY(){
  for ( const ü_step of [1,2] ) {
    const ü_calc = new AsyncCalculation( 200 as number, ö_whenY, ü_step === 2 );
    const ü_whenY = ü_calc.whenY;
    ü_calc.x = 10;
    testEqual( await ü_calc.whenY,  23 );
    let ü_y = 0;
    try {
        ü_y = await ü_whenY;
    } catch (error) {
        ü_y = 0;
    }
    testEqual( ü_y, 0, 'Reached'+ ü_calc.lazy );
  }
//
async function ö_whenY( ü_x:number ):Promise<number> {
    await whenDelay( ü_x );
    return ü_x + 13;
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

//====================================================================
/*
*/