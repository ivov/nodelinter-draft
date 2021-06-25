const properties = [
  {
    displayName: 'Non-Initial Capital',
    name: 'nonInitialCapital',
    type: 'string',
    default: 'abc',
    description: 'description without initial capital.',
  },
  {
    displayName: 'Missing Final Period',
    name: 'missingFinalPeriod',
    type: 'string',
    default: 'abc',
    description: 'Description without final period',
  },
  {
    displayName: 'Missing Description',
    name: 'missingDescription',
    type: 'string',
    default: 'abc',
  },
  {
    displayName: 'Account Contact ID',
    name: 'accountContactId',
    type: 'number',
    displayOptions: {
      show: {
        operation: ['delete'],
        resource: ['accountContact'],
      },
    },
    required: true,
    description: 'This is a <a href="https://www.hello.com">link</a>.',
  },
  {
		displayName: 'Description Is Empty String',
		name: 'descriptionIsEmptyString',
		type: 'string',
		description: '',
		default: '',
	},
  {
		displayName: 'Uneeded backticks',
		name: 'unneededBackticks',
		type: 'string',
		description: `Hello goodbye.`,
		default: '',
	},
  {
    displayName: 'Untrimmed description',
    name: 'timeZone',
    type: 'string',
    typeOptions: {
      loadOptionsMethod: 'getTimezones',
    },
    default: '',
    description: ' Time zone used in the response. The default is the time zone of the calendar.',
  },
];
