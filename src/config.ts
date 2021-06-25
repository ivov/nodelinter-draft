export const config: Config = {
  n8nRepoPath: "/Users/ivov/Development/n8n",
  lintGroups: {
    default: {
      enabled: true,
      level: "info",
    },
    paramDescription: {
      enabled: true,
      level: "warning",
    },
    displayName: {
      enabled: true,
      level: "error",
    },
    limit: {
      enabled: true,
      level: "error",
    },
    name: {
      enabled: true,
      level: "warning",
    },
    options: {
      enabled: true,
      level: "warning",
    },
    requiredFalse: {
      enabled: true,
      level: "error",
    },
    nodeDescription: {
      enabled: true,
      level: "error",
    },
  },
  truncation: {
    enabled: true,
    charLimit: 40,
  },
};
