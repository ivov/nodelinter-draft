import ts, { getLineAndCharacterOfPosition as getLine } from "typescript";
import { config } from "../config";
import { getLintGroup } from "../utils";
import { Traverser } from "./Traverser";

// type SubValidatorConstructor<T = {}> = new (...args: any[]) => T;

type Constructor = new (...args: any[]) => {};

export function Logger<BaseClass extends Constructor>(
  Base: BaseClass,
  sourceFilePath: string
) {
  return class extends Base {
    loggedErrors: LoggedError[] = [];

    public log = (errorMessage: string) => (node: ts.Node) => {
      const { line } = getLine(
        Traverser.sourceFile,
        node.getChildAt(2).getEnd()
      );

      const lintGroup = getLintGroup(errorMessage);

      this.loggedErrors.push({
        message: errorMessage,
        line: line + 1,
        excerpt: config.truncation.enabled
          ? this.truncate(node.getText())
          : node.getText(),
        sourceFilePath: sourceFilePath,
        logLevel: config.lintGroups[lintGroup].level,
      });
    };

    private truncate = (text: string) => {
      if (text.includes("\t")) return "<large excerpt omitted>";

      return text.slice(0, config.truncation.charLimit);
    };
  };
}
