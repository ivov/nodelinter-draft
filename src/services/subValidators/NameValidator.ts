import ts from "typescript";
import { isCamelCase } from "../../utils";
import { errors } from "../../errors";

export class NameValidator implements SubValidator {
  static lintGroup = "name" as const;
  loggedErrors: LoggedError[];
  log: LogFunction;

  /**
   * Validate if the `name` value is camel cased and its `id` is properly cased.
   *
   * Return any validation errors found.
   */
  public run = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "name"
    ) {
      const hasDefaultsParent = node?.parent?.parent
        ?.getText()
        .startsWith("defaults"); // skip check for defaults

      if (hasDefaultsParent) return;

      const nameValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      let isOption = false;
      node.parent.forEachChild((node) => {
        if (
          ts.isPropertyAssignment(node) &&
          node.getChildAt(0).getText() === "value"
        ) {
          isOption = true;
        }
      });

      if (!isOption) {
        if (
          (nameValue.length > 2 && nameValue.includes(" id")) ||
          nameValue.includes(" ID")
        ) {
          this.log(errors.name.NAME_WITH_MISCASED_ID)(node);
        }

        if (!isCamelCase(nameValue)) {
          this.log(errors.name.NAME_WITH_NO_CAMELCASE)(node);
        }
      }
    }

    return this.loggedErrors;
  };
}
