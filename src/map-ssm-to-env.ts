import { SSM } from 'aws-sdk';

export async function mapSSMtoEnv(awsRegion = 'us-east-2') {
  const ssm = new SSM({
    region: 'us-east-2',
  });
  const ssmParams = await getSSMParameters(ssm);
  ssmParams.Parameters.forEach((param) => {
    const paramName = param.Name?.split('/').pop();
    if (paramName) {
      process.env[paramName] = param.Value || '';
    }
  });
}

async function getSSMParameters(ssm: SSM, ssmPath = '/dev') {
  const ssmParams = await ssm
    .getParametersByPath({
      Path: ssmPath,
      Recursive: true,
      WithDecryption: true,
    })
    .promise();
  return ssmParams;
}
