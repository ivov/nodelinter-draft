export const properties = [
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    XtypeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 100,
    description: 'Number of results to return.',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
      minValue: 0,
      maxValue: 100,
    },
    default: 100,
    description: 'Number of results to return.',
  },
] as INodeProperties;