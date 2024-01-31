
  export type TAssert<T=any> = (actual:unknown, expected:T, message?:string|Error) => asserts actual is T;
//( act:any, exp:, message?:string )=>void