const ü_s = require('fs').promises

async function tst_syntax(){
    const ü_p = Promise.resolve()
    ü_p.then(function(){ 
        throw new Error('5');
    });
  //await some_tick();
    const ü_6 = ü_p.then(function(){
        return;
    });
    await ü_6;
    await ü_s.stat( __filename )
    console.log( '6' )
async function some_tick() {
                                     let ü_r
    const ü_p = new Promise((resolve)=>{ ü_r = resolve; });
                             setTimeout( ü_r, 1 );
    return ü_p;
}
}
async function wrap(){
    try {
      await tst_syntax();
        
    } catch (error) {
      return;
    }
}

wrap();
console.log( 'done' );
//tst_syntax();