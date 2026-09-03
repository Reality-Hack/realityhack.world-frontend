module.exports = {
  'realityhack-world-api': {
    input: {
      target: 'http://localhost:8000/schema/spectacular/',
      filters: {
        mode: 'exclude',
        tags: ['schema']
      }
    },
    output: {
      client: 'swr',
      mode: 'split',
      format: 'esm',
      httpClient: 'axios',
      target: './src/types/endpoints.ts',
      schemas: './src/types/models',
      override: {
        mutator: {
          path: './src/lib/custom-axios.ts',
          name: 'customAxios'
        }
      }
    }
  }
};
