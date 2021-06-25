import fs from "fs";
import ts from "typescript";
import path from "path";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { Traverser } from "../services/Traverser";
import { Validator } from "../services/Validator";
import { errors as errorSchema } from "../errors";
import { Presenter } from "../services/Presenter";

const repoUrl = "https://github.com/n8n-io/n8n.git";
const start = new Date();
let paths: string[] = [];
let tmpobj: any = null;

const argv = yargs(hideBin(process.argv)).argv;
if (!argv.branch && process.argv.length < 3) {
  console.log("Usage:");
  console.log("Scan either a local dir or a remote branch");
  console.log("  npm run lint <local_path_to_scan>");
  console.log("  npm run lint -- --branch <branch_name>");
  process.exit(0);
}

if (argv.branch) {
  // Find relevant new files in a branch

  // Create a tmp dir to check out the repository to
  const tmp = require("tmp");
  tmpobj = tmp.dirSync({ unsafeCleanup: true });
  const tmpDir = tmpobj.name;

  // Check out repository and get list of relevant changed files
  const execSync = require("child_process").execSync;
  console.log(`Fetching PR into ${tmpDir}`);
  var code = execSync(
    `git clone ${repoUrl} "${tmpDir}"; cd ${tmpDir}; git checkout ${argv.branch}; git pull`
  );
  var diff = execSync(
    `cd ${tmpDir}; git pull; git --no-pager diff --name-only FETCH_HEAD $(git merge-base FETCH_HEAD master)`
  ).toString();
  const changedFilePaths = diff.trim().split("\n");
  const filteredPaths = changedFilePaths.filter(
    (p: string) => p.includes(".node.ts") || p.includes("Description.ts")
  );
  paths = filteredPaths.map((p: string) => path.join(tmpDir, p));
  //console.log(paths)
} else {
  // Find relevant files in the local dir
  var glob = require("glob");
  // paths = glob.sync(`${process.argv[2]}/**/*.node.ts`);
  let paths1: string[] = glob.sync(`${process.argv[2]}/**/*.node.ts`);
  let paths2: string[] = glob.sync(`${process.argv[2]}/**/*Description.ts`);

  paths = [...paths1, ...paths2];
}

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

if (argv.branch)
  // Remove all the files we created
  tmpobj.removeCallback();
