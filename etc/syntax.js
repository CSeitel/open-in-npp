async function tst_syntax(){
    Promise.resolve(3).then(function(){ 
        throw new Error('5');
    });
  //await some_tick();
    await Promise.resolve();
async function some_tick() {
                                     let ü_r
    const ü_p = new Promise((resolve)=>{ ü_r = resolve; });
                             setTimeout( ü_r, 1 );
    return ü_p;
}
}
tst_syntax();