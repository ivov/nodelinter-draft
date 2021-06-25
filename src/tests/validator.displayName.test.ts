import { Validator } from "../services/Validator";
import {
  buildSourceFilePath,
  isDisabled,
  runTest,
  transpile,
} from "./testHelpers";
import { displayNameErrors } from "./testHelpers";

describe("Validator should validate displayName values", () => {
  const lintGroup = "displayName";

  if (isDisabled(lintGroup)) return;

  const sourceFilePath = buildSourceFilePath(lintGroup);
  const validator = new Validator(sourceFilePath);

  transpile(validator, sourceFilePath);

  displayNameErrors.forEach(runTest(validator));
});
