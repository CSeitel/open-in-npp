/*
https://webpack.js.org/configuration/target/#target
*/
//import { type Configuration
//       } from 'webpack';
/**@type {import('webpack').Configuration}*/
  type Configuration = object
//--------------------------------------------------------------------
  import {join
         } from 'path';
//====================================================================

export default function ß_compileConfig( ü_env:Record<string,boolean|string>, ü_argv:Object ):Configuration {
    const ü_tsRule = 
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
const ß_config =
    { target: 'webworker'
  //, entry: './src/extension.ts'
    , entry: './out/extension.js'
    , output:
      { path: join( __dirname, '../../', 'dist' )
      , filename: 'extension.js'
      , libraryTarget: 'commonjs2'
      , devtoolModuleFilenameTemplate: '../[resource-path]'
      }
    , devtool: 'source-map'
    , externals:
      { vscode: 'commonjs vscode'
      , child_process: 'node:child_process'
      , path: 'node:path'
      , util: 'node:util'
      , fs  : 'node:fs'
      , os  : 'node:os'
      }
    , resolve:
      { mainFields: ['browser', 'module', 'main'] // look for `browser` entry point in imported node modules
      , extensions: ['.ts', '.js']
      , alias: { // provides alternate implementation for node module and source files
               }
      , fallback: {
      // Webpack 5 no longer polyfills Node.js core modules automatically.
      // see https://webpack.js.org/configuration/resolve/#resolvefallback
      // for the list of Node.js core module polyfills.
                  }
      }
    , module:
      { rules: [ ü_tsRule ]
      }
    };
  //
    console.log( ß_config );
    return ß_config;
}

//====================================================================
/*
*/