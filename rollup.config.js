"use strict";

import clean from "rollup-plugin-clean";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import screeps from "rollup-plugin-screeps";

const cfg = process.env.NODE_ENV === 'production' ? 'main' : 'sim';

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs"
  },

  sourcemap: true,

  plugins: [
    clean(),
    replace({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      __BUILD_TIME__: JSON.stringify(Date.now())
    }),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    screeps({
      config: require("./screeps")[cfg],
      // if `NODE_ENV` is local, perform a dry run
      dryRun: process.env.NODE_ENV === 'local'
    })
  ]
}
