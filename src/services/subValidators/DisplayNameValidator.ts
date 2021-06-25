import ts from "typescript";
import { errors } from "../../errors";
import { isTitleCase } from "../../utils";

export class DisplayNameValidator implements SubValidator {
  static lintGroup = "displayName" as const;
  loggedErrors: LoggedError[];
  log: LogFunction;

  /**
   * Validate if the `displayName` value is title cased and its `ID` is properly cased.
   *
   * Return any validation errors found.
   */
  public run = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "displayName"
    ) {
      if (
        node.getChildAt(2).getText().startsWith("' ") ||
        node.getChildAt(2).getText().endsWith(" '")
      ) {
        this.log(errors.displayName.UNTRIMMED_DISPLAYNAME)(node);
      }

      const displayNameValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      if (
        displayNameValue.includes(" id") ||
        displayNameValue.includes(" Id")
      ) {
        this.log(errors.displayName.DISPLAYNAME_WITH_MISCASED_ID)(node);
      }

      if (!isTitleCase(displayNameValue)) {
        this.log(errors.displayName.DISPLAYNAME_WITH_NO_TITLECASE)(node);
      }
    }

    return this.loggedErrors;
  };
}
