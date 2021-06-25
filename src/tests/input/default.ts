export const properties = [
  {
    displayName: 'Non-String Default',
    name: 'nonStringDefault',
    type: 'string',
    default: 3,
  },
  {
    displayName: 'Non-Numeric Default',
    name: 'nonNumericDefault',
    type: 'number',
    default: 'hello',
  },
  {
    displayName: 'Non-Boolean Default',
    name: 'nonBooleanDefault',
    type: 'boolean',
    default: 'hello',
  },
  {
    displayName: 'Non-Object Default',
    name: 'NonObjectDefault',
    type: 'collection',
    placeholder: 'Add Field',
    default: 'hello',
    options: [
      {
        displayName: 'Job title',
        name: 'jobTitle',
        type: 'string',
        default: '',
        description: 'Job Title of the contact at the account',
      },
    ],
  },
  {
    displayName: 'Non-Array Default',
    name: 'NonArrayDefault',
    type: 'multiOptions',
    placeholder: 'Add Field',
    default: 'hello',
    options: [
      {
        displayName: 'Job title',
        name: 'jobTitle',
        type: 'string',
        default: '',
        description: 'Job Title of the contact at the account',
      },
    ],
  },
  {
    displayName: 'Non-Option Default',
    name: 'nonOptionDefault',
    type: 'options',
    options: [
      {
        name: 'Public',
        value: 'public',
        description: 'Run the hooks when a contact triggers the action',
      },
      {
        name: 'Admin',
        value: 'admin',
        description: 'Run the hooks when an admin user triggers the action',
      },
      {
        name: 'Api',
        value: 'api',
        description: 'Run the hooks when an API call triggers the action',
      },
      {
        name: 'System',
        value: 'system',
        description: 'Run the hooks when automated systems triggers the action',
      },
    ],
    default: 'Invalid',
  },
  {
    displayName: 'Default Missing',
    name: 'defaultMissing',
    type: 'string',
    required: true,
    description: 'Account ID',
  },
];
