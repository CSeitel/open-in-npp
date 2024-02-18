/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { strictEqual
         } from 'assert';
  import { expandEnvVariables
         } from '../../../lib/textUtil';
  import { testSrc
         , testSummary
         , testAsyncFunction
         , testFunction
         , testEqual
         , bind
         } from '../../../lib/testUtil';
//====================================================================

export async function tst_expandEnvVariables(){
    const ü_env = process.env;
    const ü_data =
      [ [ '%TEMP%', ü_env[ 'TEMP' ] ]
      , [ '%Temp%', ü_env[ 'Temp' ] ]
      , [ '%TEMP$',       '%TEMP$'  ]
      , [ '%T__P%',       '%T__P%'  ]
      ] as TResultArray<string,string>;
    testFunction( expandEnvVariables, ü_data );
    console.log( testSummary( strictEqual, 'expandEnvVariables' ) );
}

/*
*/