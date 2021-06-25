import { Validator } from "../services/Validator";
import {
  buildSourceFilePath,
  isDisabled,
  runTest,
  transpile,
} from "./testHelpers";
import { paramDescriptionErrors } from "./testHelpers";

describe("Validator should validate param description values", () => {
  const lintGroup = "paramDescription";

  if (isDisabled(lintGroup)) return;

  const sourceFilePath = buildSourceFilePath(lintGroup);
  const validator = new Validator(sourceFilePath);

  transpile(validator, sourceFilePath);

  paramDescriptionErrors.forEach(runTest(validator));
});
