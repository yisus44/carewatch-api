import {
  SSMClient,
  GetParametersByPathCommand,
  GetParametersByPathCommandInput,
  Parameter,
} from '@aws-sdk/client-ssm';
export async function mapSSMtoEnv(awsRegion = 'us-east-2') {
  const ssm = new SSMClient({
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

async function getSSMParameters(ssm: SSMClient, ssmPath = '/dev') {
  let nextToken = null;
  let ssmParams: Parameter[] = [];

  do {
    const params: GetParametersByPathCommandInput = {
      Path: '/dev',
      Recursive: true,
      NextToken: nextToken,
      WithDecryption: true,
    };
    const command = new GetParametersByPathCommand(params);
    const response = await ssm.send(command);
    nextToken = response.NextToken;
    ssmParams.push(...response.Parameters);
  } while (nextToken);

  return ssmParams;
}
