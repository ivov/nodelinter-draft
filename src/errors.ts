export const errors: LintErrors = {
  default: {
    NON_STRING_DEFAULT: "Non-string default for string-type param",
    NON_NUMERIC_DEFAULT: "Non-numeric default for number-type param",
    NON_BOOLEAN_DEFAULT: "Non-boolean default for boolean-type param",
    NON_OBJECT_DEFAULT: "Non-object default for collection-type param",
    NON_ARRAY_DEFAULT: "Non-array default for multiOptions-type param",
    NON_OPTION_DEFAULT: "Non-option default for options-type param",
    DEFAULT_MISSING: "Default value missing for param",
  },
  paramDescription: {
    NO_CAPITALIZED_INITIAL: "Non-capital initial letter in param description",
    MISSING_FINAL_PERIOD: "Missing final period in param description",
    DESCRIPTION_MISSING: "Param description is missing",
    TARGET_BLANK_MISSING: 'Anchor link has no attribute target="_blank"',
    DESCRIPTION_IS_EMPTY_STRING: "Param description is an empty string",
    UNNEEDED_BACKTICKS: "Param description contains unneeded backticks",
    UNTRIMMED_DESCRIPTION: "Param description is not trimmed",
  },
  displayName: {
    DISPLAYNAME_WITH_MISCASED_ID: "Miscased `ID` in `displayName` property",
    DISPLAYNAME_WITH_NO_TITLECASE: "No title case in `displayName` property",
    UNTRIMMED_DISPLAYNAME: "`displayName` property is not trimmed",
  },
  limit: {
    LIMIT_WITHOUT_TYPE_OPTIONS: "Limit without `typeOptions`",
    LIMIT_LOWER_THAN_ONE: "Limit with value lower than one",
  },
  name: {
    NAME_WITH_MISCASED_ID: "Miscased `id` in `name` property",
    NAME_WITH_NO_CAMELCASE: "No camel case in `name` property",
  },
  options: {
    NON_ALPHABETIZED_OPTIONS:
      "Non-alphabetized `options` values in options-type param",
  },
  requiredFalse: {
    REQUIRED_FALSE: "Unneeded `required: false` in param property",
  },
  nodeDescription: {
    PNG_ICON: "Icon is PNG in node description",
    SUBTITLE_MISSING: "Missing `subtitle` in node description",
  },
};
