export const properties = [
  {
    displayName: 'Required False',
    name: 'requiredFalse',
    required: false,
    type: 'string',
    default: '',
    description: 'This has a required false.'
  },
] as INodeProperties[]; // Removing casing causes test to fail, for unknown reason.
