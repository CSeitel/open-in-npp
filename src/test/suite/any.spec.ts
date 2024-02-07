/*
*/
  import { type TResultArray
         } from '../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { basename
         , join
         } from 'path';
  import { strictEqual
         } from 'assert';
/*
*/
  import { whenDelay
         , LockHandler
         } from '../../lib/asyncUtil';
  import { testSuite
         } from '../../lib/testUtil';
  import { tst_whenFileInfoRead
         , tst_whenFileTypeKnown
         } from './lib/any.impl';
//====================================================================
  const ß_testDir = join( __dirname, '../../../.vscode-temp' );
//const ß_testDir = join( process.cwd(), '../../.vscode-temp' );

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
  const ü_suite = 
    [ tst_whenFileInfoRead
    , tst_whenFileTypeKnown
    ];
  const ü_debug = 1 !== 1 ? (ü_suite.length=0,tst_whenFileInfoRead) : ()=>{};

suite( 'Debug', ()=>{
    test( 'Single', ü_debug );
});
testSuite( basename( __filename ), ü_suite );

//====================================================================

/*
test( '', async ()=>{
    const ü_info = await whenFileInfoRead( join( ß_testDir, 'virtual_3_d' ) );
    strictEqual( ü_info?.type, 66 )
});
  test( 'Execute Command', VscTestSpec.openInNpp );
  test( 'Env'            , VscTestSpec.test_2    );
*/

//====================================================================
/*
*/