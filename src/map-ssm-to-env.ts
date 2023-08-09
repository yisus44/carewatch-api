import { SSM } from 'aws-sdk';
import { ParameterList } from 'aws-sdk/clients/ssm';

export async function mapSSMtoEnv(awsRegion = 'us-east-2') {
  const ssm = new SSM({
    region: 'us-east-2',
  });
  const ssmParams = await getSSMParameters(ssm);
  ssmParams.forEach((param) => {
    const paramName = param.Name?.split('/').pop();
    if (paramName) {
      process.env[paramName] = param.Value || '';
    }
  });
}

async function getSSMParameters(ssm: SSM, ssmPath = '/dev') {
  let nextToken = null;
  let ssmParams: ParameterList = [];
  do {
    const newParams: any = await ssm
      .getParametersByPath({
        Path: ssmPath,
        Recursive: true,
        WithDecryption: true,
        NextToken: nextToken,
      })
      .promise();

    ssmParams = ssmParams.concat(newParams.Parameters);
    nextToken = newParams.NextToken;
  } while (nextToken);

  return ssmParams;
}
