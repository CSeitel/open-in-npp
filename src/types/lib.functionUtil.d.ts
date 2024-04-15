/*
*/
  import { TAnyFunctionSingleArg
         } from './generic.d'
//====================================================================
  export type TBind = typeof Function.prototype.bind

  export type TIndexMapping = number[]|Record<number,number>
  export type TProcessingInfo<Ty=any,Tz=Ty> = {
      that        ?:any
      realFirst   ?:boolean
      arrangeReal ?:TIndexMapping
      arrangeBound?:TIndexMapping
      prepare     ?:Record<number,TAnyFunctionSingleArg<any,any>>
      refine      ?:              TAnyFunctionSingleArg<Tz ,Ty >
    }

//====================================================================
/*
*/