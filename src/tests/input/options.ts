export const properties = [
  {
    displayName: 'Non-Alphabetized Options',
    name: 'nonAlphabetizedOptions',
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
    default: 'public',
  },
];
