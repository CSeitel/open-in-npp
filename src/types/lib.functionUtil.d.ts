/*
*/
  import { TAnyFunctionSingleArg
         } from './generic.d'
//====================================================================

  export type TIndexMapping = number[]|Record<number,number>
  export type TArgumentsInfo<Ty=any,Tz=Ty> = {
      that        ?:any
      realFirst   ?:boolean
      arrangeReal ?:TIndexMapping
      arrangeBound?:TIndexMapping
      refine      ?:Record<number,TAnyFunctionSingleArg<any,any>>
      finalize    ?:              TAnyFunctionSingleArg<Tz ,Ty >
    }

//====================================================================
/*
*/