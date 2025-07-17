/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Forwarded-Host'
          }
        ]
      }
    ];
  },
  webpack: config => {
    config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
    return config;
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/backend/:path*',
          destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*/`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
