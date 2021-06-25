import ts from "typescript";
import { errors } from "../../errors";
import { hasAnchorLink, hasTargetBlank, startsWithCapital } from "../../utils";

export class DescriptionValidator implements SubValidator {
  static lintGroup = "paramDescription" as const;
  loggedErrors: LoggedError[];
  log: LogFunction;

  /**
   * Validate if a `description`
   * - starts with a capital letter,
   * - has no unneeded backticks,
   * - ends with a final period, and
   * - is not missing (except `credentials`, `defaults` and `resource` options).
   *
   * Return any validation errors found.
   */
  public run = (node: ts.Node) => {
    const hasCredentialsParent = node?.parent?.parent?.parent
      ?.getText()
      .startsWith("credentials"); // skip check for credentials

    const hasDefaultsParent = node?.parent?.parent
      ?.getText()
      .startsWith("defaults"); // skip check for defaults

    if (!ts.isPropertyAssignment(node)) return;

    if (node.getChildAt(0).getText() === "description") {
      if (
        node.getChildAt(2).getText().startsWith("' ") ||
        node.getChildAt(2).getText().endsWith(" '")
      ) {
        this.log(errors.paramDescription.UNTRIMMED_DESCRIPTION)(node);
      }

      if (
        ts.isNoSubstitutionTemplateLiteral(node.getChildAt(2)) &&
        !node.getChildAt(2).getText().includes("'")
      ) {
        this.log(errors.paramDescription.UNNEEDED_BACKTICKS)(node);
      }

      const descriptionValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      if (descriptionValue === "") {
        this.log(errors.paramDescription.DESCRIPTION_IS_EMPTY_STRING)(node);
      }

      if (descriptionValue && !startsWithCapital(descriptionValue)) {
        this.log(errors.paramDescription.NO_CAPITALIZED_INITIAL)(node);
      }

      if (!descriptionValue.endsWith(".") && !descriptionValue.endsWith(".`")) {
        this.log(errors.paramDescription.MISSING_FINAL_PERIOD)(node);
      }

      if (
        hasAnchorLink(descriptionValue) &&
        !hasTargetBlank(descriptionValue)
      ) {
        this.log(errors.paramDescription.TARGET_BLANK_MISSING)(node);
      }
    }

    if (
      node.getChildAt(0).getText() === "name" &&
      node.getChildAt(2).getText() !== "'additionalFields'"
    ) {
      let hasDescription = false;
      let hasResourceParent = false; // skip check for resource options

      node.parent.forEachChild((node) => {
        node.parent.parent.parent.parent.forEachChild((child) => {
          if (child.getText() === "name: 'resource'") {
            hasResourceParent = true;
          }
        });

        if (
          ts.isPropertyAssignment(node) &&
          node.getChildAt(0).getText() === "description"
        ) {
          hasDescription = true;
        }
      });

      if (
        !hasDescription &&
        !hasResourceParent &&
        !hasCredentialsParent &&
        !hasDefaultsParent
      ) {
        this.log(errors.paramDescription.DESCRIPTION_MISSING)(node);
      }
    }

    return this.loggedErrors;
  };
}
