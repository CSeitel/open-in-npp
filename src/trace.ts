/*
*/
//export type trace = any;
export type trace = ( (...args:any[])=>void ) | false;
export let ß_trc:trace ;

  ß_trc = false;
//ß_trc = console.log;
//if(ß_trc){ß_trc( 1 );}