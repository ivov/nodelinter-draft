import ts from "typescript";
import { areAlphabetized } from "../../utils";
import { errors } from "../../errors";

export class OptionsValidator implements SubValidator {
  static lintGroup = "options" as const;
  loggedErrors: LoggedError[];
  log: LogFunction;

  /**
   * Validate if every param has a default and if the value for the default conforms to the param type.
   */
  public run = (node: ts.Node) => {
    [this.validateOptionsAlphabetization].forEach((f) => f(node));

    return this.loggedErrors;
  };

  private validateOptionsAlphabetization = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "type" &&
      node.getChildAt(2).getText() === "'options'"
    ) {
      let optionsNodeToReport: ts.Node = node;
      let optionsValues: string[] = [];

      node.parent.forEachChild((node) => {
        if (node.getChildAt(0).getText() !== "options") return;
        if (!ts.isArrayLiteralExpression(node.getChildAt(2))) return;

        optionsNodeToReport = node;
        node.getChildAt(2).forEachChild((node) => {
          if (!ts.isObjectLiteralExpression(node)) return;
          node.forEachChild((node) => {
            if (
              ts.isPropertyAssignment(node) &&
              node.getChildAt(0).getText() === "value"
            ) {
              optionsValues.push(
                node.getChildAt(2).getText().replace(/'/g, "") // remove single quotes from string
              );
            }
          });
        });
      });

      if (!areAlphabetized(optionsValues)) {
        this.log(errors.options.NON_ALPHABETIZED_OPTIONS)(optionsNodeToReport);
      }
    }
  };
}
