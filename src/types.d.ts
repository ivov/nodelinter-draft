type ParameterType =
  | "string"
  | "number"
  | "boolean"
  | "collection"
  | "multiOptions"
  | "options";

type LintGroup =
  | "default"
  | "paramDescription"
  | "displayName"
  | "limit"
  | "name"
  | "options"
  | "requiredFalse"
  | "nodeDescription";

type LintErrors = { [Key in LintGroup]: { [key: string]: string } };

type LoggedError = {
  message: string;
  line: number;
  excerpt: string;
  sourceFilePath: string;
  logLevel: LogLevel;
};

type LogFunction = (errorMessage: string) => (node: ts.Node) => void;

interface SubValidator {
  lintGroup?: LintGroup; // TODO: Make static instead of optional
  loggedErrors: LoggedError[];
  log: LogFunction;
  run: (node: ts.Node) => LoggedError[] | undefined;
}

interface SubValidatorConstructor {
  new (): SubValidator;
}

type LogLevel = "info" | "warning" | "error";

type Config = {
  n8nRepoPath: string;
  lintGroups: { [Key in LintGroup]: { enabled: boolean; level: LogLevel } };
  truncation: {
    enabled: boolean;
    charLimit: number;
  };
};

/**
 * Extend ObjectConstructor with a better type definition for `Object.keys()`
 */
interface ObjectConstructor {
  keys<T>(object: T): ObjectKeys<T>;
}

type ObjectKeys<T> = T extends object
  ? (keyof T)[]
  : T extends number
  ? []
  : T extends Array<any> | string
  ? string[]
  : never;
