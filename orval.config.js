const { Asap_Condensed } = require("next/font/google");

module.exports = {
    'realityhack-world-api': {
      input: {
				target: 'http://localhost:8000/schema/spectacular/',
        filters: {
          mode: 'exclude',
          tags: ['schema'] // Exclude any endpoints tagged with 'schema'
        }
			},
      output: {
        client: 'fetch',
				mode: 'split',
        httpClient: 'fetch',
        target: './src/types/endpoints.ts',
				baseUrl: '/backend',
        schemas: './src/types/models'
			}
    },
};
