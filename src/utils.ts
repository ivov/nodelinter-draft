import ts from "typescript";
import fs from "fs";
import { errors } from "./errors";

export const isBooleanKeyword = (node: ts.Node) =>
  node.kind === ts.SyntaxKind.TrueKeyword ||
  node.kind === ts.SyntaxKind.FalseKeyword;

export const areAlphabetized = (optionValues: string[]) =>
  optionValues.join() === optionValues.sort().join();

export const startsWithCapital = (str: string) =>
  str[0] === str[0].toUpperCase();

export const isTitleCase = (str: string) => /^([A-Z]\w*\s*)*$/.test(str);

export const isCamelCase = (str: string) => /^([a-z]+[A-Z0-9]*)*$/.test(str);

export const hasAnchorLink = (str: string) => /<a href=/.test(str);

export const hasTargetBlank = (str: string) => /target="_blank"/.test(str);

export const printJson = (fileName: string, loggedErrors: LoggedError[]) =>
  fs.writeFileSync(`${fileName}.json`, JSON.stringify(loggedErrors, null, 2));

export function getLintGroup(errorMessage: string) {
  for (const lintGroup of Object.keys(errors)) {
    const groupMessages = Object.values(errors[lintGroup]);
    const found = groupMessages.find((message) => message === errorMessage);
    if (found) return lintGroup;
  }

  throw new Error(`No lint group found for ${errorMessage}`);
}
