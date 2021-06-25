import { Validator } from "../services/Validator";
import {
  buildSourceFilePath,
  isDisabled,
  runTest,
  transpile,
} from "./testHelpers";
import { optionsErrors } from "./testHelpers";

describe("Validator should validate options", () => {
  const lintGroup = "options";

  if (isDisabled(lintGroup)) return;

  const sourceFilePath = buildSourceFilePath(lintGroup);
  const validator = new Validator(sourceFilePath);

  transpile(validator, sourceFilePath);

  optionsErrors.forEach(runTest(validator));
});
