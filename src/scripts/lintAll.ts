import fs from "fs";
import ts from "typescript";
import { Traverser } from "../services/Traverser";
import { Validator } from "../services/Validator";
import { errors as errorSchema } from "../errors";
import { Presenter } from "../services/Presenter";

// const tmpDir = "tmp";

//const fs = require('fs');
// const path = require("path");

// fs.readdir(tmpDir, (err: any, files: any) => {
//   if (err) throw err;

//   for (const file of files) {
//     fs.unlink(path.join(tmpDir, file), (err) => {
//       if (err) throw err;
//     });
//   }
// });
// process.exit();

const start = new Date();

if (process.argv.length < 3) {
  console.log("Enter the path to the directory to parse");
  process.exit(0);
}

var glob = require("glob");
let paths1: string[] = glob.sync(`${process.argv[2]}/**/*.node.ts`);
let paths2: string[] = glob.sync(`${process.argv[2]}/**/*Description.ts`);

const paths = [...paths1, ...paths2];

var errors: LoggedError[] = [];
paths.forEach((path) => {
  const source = fs.readFileSync(path, "utf8");

  const validator = new Validator(path);

  ts.transpileModule(source, {
    transformers: { before: [Traverser.traverse(validator)] },
  });

  errors.push(...validator.errorLog);
  Presenter.showLogs(validator.errorLog);
});

const execTime = new Date().getTime() - start.getTime();

// Summary

const num_files = paths.length;
const num_errors = errors.length;
const num_error_files = [
  ...new Set(errors.map((error) => error.sourceFilePath)),
].length;
const error_types = [...new Set(errors.map((error) => error.logLevel))];

console.log(`Parsed ${num_files} files in ${execTime / 1000}s`);

if (num_errors > 0) {
  console.log(`Found ${num_errors} errors in ${num_error_files} files`);

  // Breakdown by level
  console.log("Breakdown by level");
  error_types.forEach((error_type) => {
    const count = errors.filter(
      (error) => error.logLevel === error_type
    ).length;
    console.log(`  ${error_type}: ${count}`);
  });

  // Breakdown by group
  var lintGroupMapping: any = {};
  Object.keys(errorSchema).forEach((lintGroup) => {
    Object.values(errorSchema[lintGroup]).forEach((value) => {
      lintGroupMapping[value] = lintGroup;
    });
  });

  var lintGroupStats = Object.keys(errorSchema).map((lintGroup) => {
    return {
      name: lintGroup,
      count: errors.filter(
        (error) => lintGroupMapping[error.message] == lintGroup
      ).length,
    };
  });
  lintGroupStats.sort((a, b) => (a.count > b.count ? -1 : 1));

  console.log("Breakdown by type");
  lintGroupStats.forEach((lintGroup) => {
    if (lintGroup.count > 0)
      console.log(`  ${lintGroup["name"]}: ${lintGroup["count"]}`);
  });
} else {
  console.log("No errors! 🙌");
}
