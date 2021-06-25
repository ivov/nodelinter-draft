import ts from "typescript";
import fs from "fs";
import { Traverser } from "../services/Traverser";
import { Validator } from "../services/Validator";
import { config } from "../config";
import { errors } from "../errors";
import path from "path";

export const transpile = (validator: Validator, sourceFilePath: string) => {
  const source = fs.readFileSync(sourceFilePath, "utf8");

  ts.transpileModule(source.toString(), {
    transformers: { before: [Traverser.traverse(validator)] },
  });
};

export const runTest = (validator: Validator) => (errorMessage: string) => {
  test(errorMessage, () => {
    const loggedError = validator.errorLog.find(
      (loggedError) => loggedError.message === errorMessage
    );

    expect(loggedError).toBeDefined();
  });
};

export const isDisabled = (lintGroup: LintGroup) =>
  !config.lintGroups[lintGroup].enabled;

export const buildSourceFilePath = (lintGroup: LintGroup) => {
  return path.join("src", "tests", "input", `${lintGroup}.ts`);
};

export const defaultErrors = Object.values(errors.default);
export const paramDescriptionErrors = Object.values(errors.paramDescription);
export const nameErrors = Object.values(errors.name);
export const optionsErrors = Object.values(errors.options);
export const requiredFalseErrors = Object.values(errors.requiredFalse);
export const displayNameErrors = Object.values(errors.displayName);
export const limitErrors = Object.values(errors.limit);
export const nodeDescriptionErrors = Object.values(errors.nodeDescription);
