import ts from "typescript";
import { isBooleanKeyword } from "../../utils";
import { errors } from "../../errors";

export class DefaultValidator implements SubValidator {
  static lintGroup = "default" as const;

  loggedErrors: LoggedError[];
  log: LogFunction;

  /**
   * Validate if every param has a default and if the value for the default conforms to the param type.
   */
  public run = (node: ts.Node) => {
    [
      this.validateDefaultExists,
      this.validateStringDefault,
      this.validateNumberDefault,
      this.validateBooleanDefault,
      this.validateCollectionDefault,
      this.validateMultiOptionsDefault,
      this.validateOptionsDefault,
    ].forEach((f) => f(node));

    return this.loggedErrors;
  };

  /**
   * Validate if a param has a default.
   */
  private validateDefaultExists = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "type"
    ) {
      let hasDefault = false;
      node.parent.forEachChild((node) => {
        if (
          ts.isPropertyAssignment(node) &&
          node.getChildAt(0).getText() === "default"
        ) {
          hasDefault = true;
        }
      });

      if (!hasDefault) {
        this.log(errors.default.DEFAULT_MISSING)(node);
      }
    }
  };

  /**
   * Generate a function that validates if the value for a `default` conforms to the param type.
   */
  private defaultValidatorGenerator =
    (
      typeName: ParameterType,
      typeCheck: (node: ts.Node) => boolean,
      errorMessage: string
    ) =>
    (node: ts.Node) => {
      if (
        ts.isPropertyAssignment(node) &&
        node.getChildAt(0).getText() === "type" &&
        node.getChildAt(2).getText() === `'${typeName}'`
      ) {
        node.parent.forEachChild((node) => {
          if (
            node.getChildAt(0).getText() === "default" &&
            !typeCheck(node.getChildAt(2))
          )
            this.log(errorMessage)(node);
        });
      }
    };

  /**
   * Validate if a param with `type: string` has a string default.
   */
  private validateStringDefault = this.defaultValidatorGenerator(
    "string",
    ts.isStringLiteral,
    errors.default.NON_STRING_DEFAULT
  );

  /**
   * Validate if a param with `type: number` has a numeric default.
   */
  private validateNumberDefault = this.defaultValidatorGenerator(
    "number",
    ts.isNumericLiteral,
    errors.default.NON_NUMERIC_DEFAULT
  );

  /**
   * Validate if a param with `type: boolean` has a boolean default.
   */
  private validateBooleanDefault = this.defaultValidatorGenerator(
    "boolean",
    isBooleanKeyword,
    errors.default.NON_BOOLEAN_DEFAULT
  );

  /**
   * Validate if a param with `type: collection` has an object literal expression default.
   */
  private validateCollectionDefault = this.defaultValidatorGenerator(
    "collection",
    ts.isObjectLiteralExpression,
    errors.default.NON_OBJECT_DEFAULT
  );

  /**
   * Validate if a param with `type: multiOptions` has an array literal expression default.
   */
  private validateMultiOptionsDefault = this.defaultValidatorGenerator(
    "multiOptions",
    ts.isArrayLiteralExpression,
    errors.default.NON_ARRAY_DEFAULT
  );

  /**
   * Validate if a param with `type: options` has an option value as default.
   */
  private validateOptionsDefault = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "type" &&
      node.getChildAt(2).getText() === "'options'"
    ) {
      let defaultNodeToReport: ts.Node = node; // if the includes check fails
      let defaultOptionValue = "";
      let optionValues: string[] = [];

      node.parent.forEachChild((node) => {
        if (node.getChildAt(0).getText() === "default") {
          defaultOptionValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes
          defaultNodeToReport = node;
        }
      });

      node.parent.forEachChild((node) => {
        if (node.getChildAt(0).getText() !== "options") return;
        if (!ts.isArrayLiteralExpression(node.getChildAt(2))) return;

        node.getChildAt(2).forEachChild((node) => {
          if (!ts.isObjectLiteralExpression(node)) return;
          node.forEachChild((node) => {
            if (
              ts.isPropertyAssignment(node) &&
              node.getChildAt(0).getText() === "value"
            ) {
              optionValues.push(
                node.getChildAt(2).getText().replace(/'/g, "") // remove single quotes from string
              );
            }
          });
        });
      });

      if (!optionValues.includes(defaultOptionValue)) {
        this.log(errors.default.NON_OPTION_DEFAULT)(defaultNodeToReport);
      }
    }
  };
}
