const fsProm = require('fs').promises;

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});



async function codeWithUnhandledPromise(){
    const notAwaited = Promise.resolve().then(function(){
        throw new Error('Irrelevant');
    });
    const ss = await fsProm.stat( __filename );
    console.log( ss, 'fs Not reached' );
}
async function main(){
    try {
      await codeWithUnhandledPromise();
    } catch (error) {
      console.log( 'Not reached' );
    } finally {
      console.log( 'Not Reached' );
    }
}

main().then(undefined,function(){ 
    console.log( 'Not Reached' );
    return;
});
console.log( 'done' );

//tst_syntax();
  //await some_tick();
/*
    const ü_p = Promise.resolve()
    const ü_6 = ü_p.then(function(){
        return;
    });
    await ü_6;
*/
async function some_tick() {
                                     let ü_r
    const ü_p = new Promise((resolve)=>{ ü_r = resolve; });
                             setTimeout( ü_r, 1 );
    return ü_p;
}