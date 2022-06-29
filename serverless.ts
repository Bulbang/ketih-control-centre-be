import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import resources from './resources'

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: 'keith-control-centre-be',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    stage: '${opt:stage, "dev"}',
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { hello },
  resources,
  package: { individually: true },
  custom: {
    prefix: "${self:service}-${self:provider.stage}",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
