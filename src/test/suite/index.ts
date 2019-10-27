import * as ßß_path from 'path';
import * as Mocha from 'mocha';
import * as ßß_glob from 'glob';

export function run(): Promise<void> {
// Create the mocha test
  const ü_mocha = new Mocha({
    ui: 'tdd',
  });
  ü_mocha.useColors( true );

  const ü_testsRoot = ßß_path.resolve( __dirname, '..' );

  return new Promise(
(resolve,reject) => {
  ßß_glob( '**/**.test.js', { cwd: ü_testsRoot }, (err, files) => {
    if (err) { return reject(err); }

// Add files to the test suite
  files.forEach( fileName => ü_mocha.addFile( ßß_path.resolve( ü_testsRoot, fileName ) ) );

  try {
// Run the mocha test
    ü_mocha.run(
failures => {
  if (failures > 0) {
    reject(new Error(`${failures} tests failed.`));
  } else {
    resolve();
  }
} // run
    );
  } catch (err) {
    reject(err);
  }
} // glob
  );

} // promise
  );

}