import ts from "typescript";
import { errors } from "../../errors";

export class LimitValidator implements SubValidator {
  static lintGroup = "limit" as const;
  loggedErrors: LoggedError[];
  log: LogFunction;

  /**
   * Validate if the `limit` value is not lower than one.
   *
   * Return any validation errors found.
   */
  public run = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "name"
    ) {
      const nameValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      if (nameValue === "limit") {
        let hasTypeOptions = false;

        node.parent.forEachChild((node) => {
          if (
            ts.isPropertyAssignment(node) &&
            node.getChildAt(0).getText() === "typeOptions"
          ) {
            node.getChildAt(2).forEachChild((node) => {
              if (node.getChildAt(0).getText() === "minValue") {
                hasTypeOptions = true;
                const minValue = node.getChildAt(2).getText();
                if (Number(minValue) < 1) {
                  this.log(errors.limit.LIMIT_LOWER_THAN_ONE)(node);
                }
              }
            });
          }
        });

        if (!hasTypeOptions) {
          this.log(errors.limit.LIMIT_WITHOUT_TYPE_OPTIONS)(node);
        }
      }
    }

    return this.loggedErrors;
  };
}
