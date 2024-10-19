/*
*/
//--------------------------------------------------------------------
//====================================================================
  export const enum CEResultSymbol { 
      none       = '?'
    //none       = '\u2754' // ❔ String.fromCharCode( 0x2754 );
    , successful = '\u2714' // ✔ String.fromCharCode( 0x2714 );
    , failing    = '\u2716' // ✖ String.fromCharCode( 0x2716 );
  //, failing    = '\u2757' // ❗ String.fromCharCode( 0x2757 );
    , success    = '\u2705' // ✅ String.fromCharCode( 0x2705 );
    , failure    = '\u274c' // ❌ String.fromCharCode( 0x274c );
  }
//--------------------------------------------------------------------
  export const enum CECheckIcon {
      notEqual = '≠' //String.fromCharCode( 0x2260 );
    ,    equal = '='
  }
//--------------------------------------------------------------------
  export const CEEmptyStringSymbol = '\ufffd '; // �  String.fromCharCode( 0xfffd, 0x20 );
//====================================================================
/*
         const emptyStringSymboL = '\u2036\u2033';// ‶″ String.fromCharCode( 0x2036, 0x2033 );
         const emptyStringSymbOl = '\u2035\u2032';// ‵′ String.fromCharCode( 0x2035, 0x2032 );
         const emptyStringSymbol = '\u201e\u2033';// „″ String.fromCharCode( 0x201e, 0x2033 );
// '\u221a'
         const ß_whiteSquare = String.fromCharCode( 0x25a1 ); //□
         const ß_pilcrow     = String.fromCharCode( 0x00b6 ); //¶
         const latinEpigraphicLetterReversedP = String.fromCharCode(0xa7fc); //ꟼ
*/