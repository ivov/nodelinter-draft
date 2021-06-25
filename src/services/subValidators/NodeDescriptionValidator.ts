import ts from "typescript";
import { errors } from "../../errors";

export class NodeDescriptionValidator implements SubValidator {
  static lintGroup = "nodeDescription" as const;
  loggedErrors: LoggedError[];
  log: LogFunction;

  /**
   * Validate if the node description has an SVG icon and if the subtitle is not missing.
   *
   * Return any validation errors found.
   */
  public run = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "icon"
    ) {
      const iconValue = node.getChildAt(2).getText();

      if (iconValue.endsWith(".png'")) {
        this.log(errors.nodeDescription.PNG_ICON)(node);
      }
    }

    if (
      ts.isObjectLiteralExpression(node) &&
      ts.isPropertyDeclaration(node.parent) &&
      node.parent.getChildAt(0).getText() === "description"
    ) {
      let hasSubtitle = false;

      node.forEachChild((child) => {
        if (child.getChildAt(0).getText() === "subtitle") {
          hasSubtitle = true;
        }
      });

      if (!hasSubtitle) {
        this.log(errors.nodeDescription.SUBTITLE_MISSING)(node);
      }
    }

    return this.loggedErrors;
  };
}
