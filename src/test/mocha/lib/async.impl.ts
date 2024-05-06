/*
*/
//--------------------------------------------------------------------
  import { ß_trc
         } from '../../../runtime/context';
  import { whenDelay
         , UniqueResource
         , LockHandler
         , AsyncCalculation
         , createTimer
         } from '../../../lib/asyncUtil';
  import { asyncNullOperation
         , bindAppending
         } from '../../../lib/functionUtil';
  import { testSrc
         , testNever
         , testEqual
         } from '../../../lib/testUtil';
//====================================================================
  export const tst_dispatch = tst_AsyncCalculation;
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
}

//--------------------------------------------------------------------

export async function tst_UniqueResourceOrder(){
  //
    const ü_data = {};
    const ö_uSrc = new UniqueResource( ü_data );
    const ö_timer = createTimer();
  //
    const ö_expOrder = [200,100,10,1];
    const ö_actOrder = [] as number[];
    const ö_times    = [] as number[];
    await Promise.allSettled( ö_expOrder.map( ü_secs => ö_whenAccessed( ü_secs ) ) );
    testEqual( ö_actOrder.join(), ö_expOrder.join(), 'Order' );
    ß_trc&& ß_trc( ö_times );
  //
async function ö_whenAccessed( ü_ms:number ):Promise<void> {
    const ü_release = await ö_uSrc.whenAvailable( `${ ü_ms }` );
    await whenDelay( ü_ms );
  //ü_release();
    ö_uSrc.getResource( ü_release );
    ö_actOrder.push( ü_ms );
    ö_times.push( ö_timer() );
    ü_release();
}
}

//====================================================================

export async function tst_AsyncCalculation(){
  for ( const ü_lazy of [false] ) {
    const ü_calc = new AsyncCalculation( 200 as number, ö_whenY, ü_lazy );
    const ü_whenY_200 = ü_calc.whenY;
    ü_calc.x = 10;
    const ü_whenY_10  = ü_calc.whenY;
    ü_calc.x = 20;
    const ü_whenY_20  = ü_calc.whenY;
    const ü_20 = await ü_whenY_20;
    testEqual( ü_20, 33 );
    try {
        await ü_whenY_200;
        testNever()
    } catch (error) {
        testEqual( error instanceof Error, true, 'Reached'+ ü_calc.lazy );
    }
  }
//
async function ö_whenY( ü_x:number ):Promise<number> {
    ß_trc &&ß_trc( ü_x );
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