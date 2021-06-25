import ts from "typescript";
import { Logger } from "./Logger";
import * as subValidators from "./subValidators";
import { config } from "../config";

export class Validator {
  public errorLog: LoggedError[] = [];
  private node: ts.Node;

  constructor(public sourceFilePath: string) {}

  public setNode(node: ts.Node) {
    this.node = node;
    return this;
  }

  public run() {
    Object.values(subValidators).forEach((subValidator) => {
      const isEnabled = config.lintGroups[subValidator.lintGroup].enabled;
      isEnabled && this.runSubValidator(subValidator);
    });
  }

  private runSubValidator(constructor: SubValidatorConstructor) {
    const SubValidator = Logger(constructor, this.sourceFilePath);
    const errors = new SubValidator().run(this.node);

    if (errors?.length) this.errorLog.push(...errors);
  }
}
