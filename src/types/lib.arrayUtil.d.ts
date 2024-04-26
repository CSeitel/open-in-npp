/*
*/
//====================================================================
  export type TOrderedPairArray<Tx,Ty> = [Tx,Ty][]

export interface IArrayPush<T> extends Array<T> {
    pushItems:( ...items:(T|void)[] )=>number
}