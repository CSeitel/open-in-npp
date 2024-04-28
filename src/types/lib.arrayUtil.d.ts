/*
*/
  import { type TOrderedPairs
         } from './generic.d';
//====================================================================
//export type Tpredicate<T> = ( value:T, indx:number, obj:T[] ) => unknown //, thisArg?: any): number;
  export type Tpredicate<T,X> = ( value:X, indx:number, obj?:T[] ) => T //, thisArg?: any): number;
  export type TCreateOrderedPair<Tx,Ty> = ( x:Tx, indx:number ) => Ty // Tpredicate< TOrderedPair<Tx,Ty>, Tx >

export interface IArrayPush<T> extends Array<T> {
    pushItems:( ...items:(T|void)[] )=>number
}