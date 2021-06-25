import { Validator } from "../services/Validator";
import {
  buildSourceFilePath,
  isDisabled,
  runTest,
  transpile,
} from "./testHelpers";
import { requiredFalseErrors } from "./testHelpers";

describe("Validator should validate `required: false` values", () => {
  const lintGroup = "requiredFalse";

  if (isDisabled(lintGroup)) return;

  const sourceFilePath = buildSourceFilePath(lintGroup);
  const validator = new Validator(sourceFilePath);

  transpile(validator, sourceFilePath);

  requiredFalseErrors.forEach(runTest(validator));
});
