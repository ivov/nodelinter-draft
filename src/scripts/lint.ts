import fs from "fs";
import ts from "typescript";
import { Presenter } from "../services/Presenter";
import { Traverser } from "../services/Traverser";
import { Validator } from "../services/Validator";

const SOURCE_FILE_PATH = "src/input/scratchpad5.ts";

const source = fs.readFileSync(SOURCE_FILE_PATH, "utf8");

const validator = new Validator(SOURCE_FILE_PATH);

ts.transpileModule(source, {
  transformers: { before: [Traverser.traverse(validator)] },
});

Presenter.showLogs(validator.errorLog);
