import ts from "typescript";
import { errors } from "../../errors";

export class RequiredFalseValidator implements SubValidator {
  static lintGroup = "requiredFalse" as const;
  loggedErrors: LoggedError[];
  log: LogFunction;

  /**
   * Validate that no property is `required: false`.
   *
   * Return any validation errors found.
   */
  public run = (node: ts.Node) => {
    if (
      ts.isAsExpression(node) &&
      ts.isArrayLiteralExpression(node.getChildAt(0))
    ) {
      node.getChildAt(0).forEachChild((node) =>
        node.forEachChild((node) => {
          if (
            ts.isPropertyAssignment(node) &&
            node.getChildAt(0).getText() === "required" &&
            node.getChildAt(2).getText() === "false"
          ) {
            this.log(errors.requiredFalse.REQUIRED_FALSE)(node);
          }
        })
      );
    }

    return this.loggedErrors;
  };
}
