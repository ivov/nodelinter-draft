import { Validator } from "../services/Validator";
import {
  buildSourceFilePath,
  isDisabled,
  runTest,
  transpile,
} from "./testHelpers";
import { nodeDescriptionErrors } from "./testHelpers";

describe("Validator should validate node description", () => {
  const lintGroup = "nodeDescription";

  if (isDisabled(lintGroup)) return;

  const sourceFilePath = buildSourceFilePath(lintGroup);
  const validator = new Validator(sourceFilePath);

  transpile(validator, sourceFilePath);

  nodeDescriptionErrors.forEach(runTest(validator));
});
