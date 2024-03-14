/*
*/
  import { type TResultArray
         } from '../../../types/lib.testUtil.d';
//--------------------------------------------------------------------
  import { expandEnvVariables
         , expandTemplateString
         } from '../../../lib/textUtil';
  import { testSrc
         , testSummary
         , testAsyncFunction
         , testFunction
         , testEqual
         , bindArgs
         } from '../../../lib/testUtil';
  import { ß_trc
         } from '../../../runtime/context';
//====================================================================

export async function tst_expandEnvVariables(){
    const ü_env = process.env;
    const ü_data =
      [ [ '%TEMP%', ü_env[ 'TEMP' ] ]
      , [ '%Temp%', ü_env[ 'Temp' ] ]
      , [ '%TEMP$',       '%TEMP$'  ]
      , [ '%T__P%',       '%T__P%'  ]
      ] as TResultArray<string,string>;
  //testFunction( expandEnvVariables, ü_data );
  //
    const ü_temp =
      [ [ 'a-${ 0 }'  , 'a-000'   ]
      , [ 'a-${ hugo}', 'a-HUGO'  ]
      ] as TResultArray<string,string>;
    const ü_vars = ['000'];
    const ö_expandTemplateString_o = bindArgs( expandTemplateString, { arrangeBound:[1], realFirst:true }
                                           , Object.assign( ü_vars, {hugo : 'HUGO'} ) );
    testFunction( ö_expandTemplateString_o, ü_temp );
  //
    const ö_expandTemplateString_a = bindArgs( expandTemplateString, { arrangeBound:[1], realFirst:true }
                                           , ...            ü_vars                    );
    testFunction( ö_expandTemplateString_a, ü_temp );
  //
    testSummary( 'expand' );
}

//====================================================================
/*
*/