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
        client: 'swr',
				mode: 'split',
        httpClient: 'axios',
        target: './src/types/endpoints.ts',
        schemas: './src/types/models',
        override: {
          mutator: {
            path: './src/lib/custom-axios.ts',
            name: 'customAxios',
          },
        },
			}
    },
};
