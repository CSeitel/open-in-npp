/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
  import { type IPromiseRejected
         } from '../../../types/lib.asyncUtil.d';
//--------------------------------------------------------------------
  import { format } from 'util';
  import { CEFileType
         } from '../../../constants/vsc';
  import { ß_trc
         } from '../../../runtime/context';
  import { whenOpenedInOSDefaultApp
         } from '../../../vsc/cmdUtil';
  import { summarizeError
         , ErrorMessage
         } from '../../../lib/errorUtil';
  import { whenPromiseSettled
         , whenDoneWith
         } from '../../../lib/asyncUtil';
  import { testSrc
         , testSummary
         , testAsyncFunction
         , testFunction
         , testEqual
         , bindArgs
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_(){
    
  //
    return tst_error();
  //
    const ü_n = null as null|Array<1>;
  //
  //const ü_whenResaon = Promise.reject( new TypeError( 'Dummy Error' ) );
  //const ü_done = await whenPromiseSettled( whenDoneWith( ü_whenResaon, 'Failure: {0}', '0.0' )
  //                                       ) as IPromiseRejected<TypeError>;
    testEqual( 1, ü_n?.toString() || 1 );
    testSummary();
}

//====================================================================
export class TstErr extends ErrorMessage {
   public  more// = 'MORE';
constructor(a:string, b:string){
    super(a,b);
    this.more = 'RRR'
}
     }

export async function tst_error(){
    const ü_a = new TstErr('w','u')
    const ü_b = new ErrorMessage('w','u')
    const ü_c = new Error('w')
        const ü_prot_a = Object.getPrototypeOf( ü_a );
        const ü_prot_b = Object.getPrototypeOf( ü_b );
        const ü_prot_c = Object.getPrototypeOf( ü_c );
  //
    let ü_txt = ''
    try {
        throw 3;
      //ß_trc&& ß_trc( ü_i );
    } catch ( ü_eX ) {
        ü_eX = new TstErr( '{0}', 'PREVIOUS' ).setReason( ü_eX );
        const ü_prot = Object.getPrototypeOf( ü_eX );
        ü_txt = summarizeError( ü_eX, 'TEST' );
    }
    testEqual( ü_txt, '' );
    testSummary();
}

//====================================================================

export async function tst_syntax(){
    const ü_n = null as null|Array<1>;
    
    testEqual( null     , ü_n             );
    testEqual( undefined, ü_n?.toString() );
  //
    const ü_data =
      [ [ '', '' ]
      , [ `"${1}"`, '"1"' ]
      , [ '\n', '\n' ]
      , [ {}   , '{}'       ]
      , [ {a:1}, '{ a: 1 }' ]
      ] as TResultArray<any,string>;
    testFunction( format, ü_data );
    testSummary( 'Syntax' );
}

//====================================================================
/*
*/