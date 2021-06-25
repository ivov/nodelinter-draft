import { Validator } from "../services/Validator";
import {
  buildSourceFilePath,
  isDisabled,
  runTest,
  transpile,
} from "./testHelpers";
import { nameErrors } from "./testHelpers";

describe("Validator should validate name values", () => {
  const lintGroup = "name";

  if (isDisabled(lintGroup)) return;

  const sourceFilePath = buildSourceFilePath(lintGroup);
  const validator = new Validator(sourceFilePath);

  transpile(validator, sourceFilePath);

  nameErrors.forEach(runTest(validator));
});
