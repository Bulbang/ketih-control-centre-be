import {
    AwsCfFunction,
    AwsCfIf,
    AwsArn,
    AwsCfInstruction,
    AwsArnString,
    FunctionName,
    AwsSecretsManagerArnString,
    AwsCfImport,
    AwsCfRef,
    AwsAlbListenerArn,
    AwsAlexaEventToken,
    AwsLogGroupName,
    FilterPatterns,
    AwsLambdaArchitecture,
    AwsKmsArn,
    AwsResourceCondition,
    AwsResourceDependsOn,
    AwsLambdaEnvironment,
    AwsCfGetAtt,
    AwsCfJoin,
    EcrImageUri,
    AwsLambdaLayers,
    AwsLogRetentionInDays,
    AwsLambdaMemorySize,
    AwsLambdaRole,
    AwsLambdaRuntime,
    AwsResourceTags,
    AwsLambdaTimeout,
    AwsLambdaTracing,
    AwsLambdaVersioning,
    AwsLambdaVpcConfig,
    AwsHttpApiPayload,
} from '@serverless/typescript'

export type LambdaConfig = {
    name?: string
    events?: (
        | {
              __schemaWorkaround__: null
          }
        | {
              schedule:
                  | string
                  | {
                        rate: string[]
                        enabled?: boolean
                        name?: string
                        description?: string
                        input?:
                            | string
                            | (
                                  | {
                                        body: string
                                    }
                                  | {
                                        [k: string]: unknown
                                    }
                              )
                        inputPath?: string
                        inputTransformer?: {
                            inputTemplate: string
                            inputPathsMap?: {
                                [k: string]: unknown
                            }
                        }
                    }
          }
        | {
              s3:
                  | string
                  | {
                        bucket: string | AwsCfFunction | AwsCfIf
                        event?: string
                        existing?: boolean
                        forceDeploy?: boolean
                        rules?: {
                            prefix?: string | AwsCfFunction
                            suffix?: string | AwsCfFunction
                        }[]
                    }
          }
        | {
              http:
                  | string
                  | {
                        async?: boolean
                        authorizer?:
                            | string
                            | {
                                  arn?: AwsArn
                                  authorizerId?: AwsCfInstruction
                                  claims?: string[]
                                  identitySource?: string
                                  identityValidationExpression?: string
                                  managedExternally?: boolean
                                  name?: string
                                  resultTtlInSeconds?: number
                                  scopes?: string[]
                                  type?:
                                      | string
                                      | string
                                      | string
                                      | string
                                      | string
                              }
                        connectionId?: AwsCfInstruction
                        connectionType?: string | string
                        cors?:
                            | boolean
                            | {
                                  allowCredentials?: boolean
                                  cacheControl?: string
                                  headers?: string[]
                                  maxAge?: number
                                  methods?: (
                                      | 'GET'
                                      | 'POST'
                                      | 'PUT'
                                      | 'PATCH'
                                      | 'OPTIONS'
                                      | 'HEAD'
                                      | 'DELETE'
                                      | 'ANY'
                                  )[]
                                  origin?: string
                                  origins?: string[]
                              }
                        integration?:
                            | string
                            | string
                            | string
                            | string
                            | string
                            | string
                            | string
                            | string
                            | string
                            | string
                        method: string
                        operationId?: string
                        path: string
                        private?: boolean
                        request?: {
                            contentHandling?:
                                | 'CONVERT_TO_BINARY'
                                | 'CONVERT_TO_TEXT'
                            method?: string
                            parameters?: {
                                querystrings?: {
                                    [k: string]:
                                        | boolean
                                        | {
                                              required?: boolean
                                              mappedValue?: AwsCfInstruction
                                          }
                                }
                                headers?: {
                                    [k: string]:
                                        | boolean
                                        | {
                                              required?: boolean
                                              mappedValue?: AwsCfInstruction
                                          }
                                }
                                paths?: {
                                    [k: string]:
                                        | boolean
                                        | {
                                              required?: boolean
                                              mappedValue?: AwsCfInstruction
                                          }
                                }
                            }
                            passThrough?:
                                | 'NEVER'
                                | 'WHEN_NO_MATCH'
                                | 'WHEN_NO_TEMPLATES'
                            schemas?: {
                                [k: string]:
                                    | {
                                          [k: string]: unknown
                                      }
                                    | string
                            }
                            template?: {
                                [k: string]: string
                            }
                            uri?: AwsCfInstruction
                        }
                        response?: {
                            contentHandling?:
                                | 'CONVERT_TO_BINARY'
                                | 'CONVERT_TO_TEXT'
                            headers?: {
                                [k: string]: string
                            }
                            template?: string
                            statusCodes?: {
                                [k: string]: {
                                    headers?: {
                                        [k: string]: string
                                    }
                                    pattern?: string
                                    template?:
                                        | string
                                        | {
                                              [k: string]: string
                                          }
                                }
                            }
                        }
                    }
          }
        | {
              websocket:
                  | string
                  | {
                        route: string
                        routeResponseSelectionExpression?: '$default'
                        authorizer?:
                            | AwsArnString
                            | FunctionName
                            | (
                                  | {
                                        [k: string]: unknown
                                    }
                                  | {
                                        [k: string]: unknown
                                    }
                              )
                    }
          }
        | {
              sns:
                  | string
                  | AwsArnString
                  | (
                        | {
                              [k: string]: unknown
                          }
                        | {
                              [k: string]: unknown
                          }
                    )
          }
        | {
              stream:
                  | AwsArnString
                  | (
                        | {
                              arn: AwsCfFunction
                              [k: string]: unknown
                          }
                        | {
                              arn: AwsArnString
                              [k: string]: unknown
                          }
                    )
          }
        | {
              kafka: {
                  accessConfigurations: {
                      vpcSubnet?: string[]
                      vpcSecurityGroup?: string[]
                      saslPlainAuth?: AwsSecretsManagerArnString[]
                      saslScram256Auth?: AwsSecretsManagerArnString[]
                      saslScram512Auth?: AwsSecretsManagerArnString[]
                      clientCertificateTlsAuth?: AwsSecretsManagerArnString[]
                      serverRootCaCertificate?: AwsSecretsManagerArnString[]
                  }
                  batchSize?: number
                  maximumBatchingWindow?: number
                  enabled?: boolean
                  bootstrapServers: string[]
                  startingPosition?: 'LATEST' | 'TRIM_HORIZON'
                  topic: string
              }
          }
        | {
              activemq: {
                  arn: string | AwsCfImport | AwsCfRef
                  basicAuthArn:
                      | AwsSecretsManagerArnString
                      | AwsCfImport
                      | AwsCfRef
                  batchSize?: number
                  maximumBatchingWindow?: number
                  enabled?: boolean
                  queue: string
              }
          }
        | {
              rabbitmq: {
                  arn: string | AwsCfImport | AwsCfRef
                  basicAuthArn:
                      | AwsSecretsManagerArnString
                      | AwsCfImport
                      | AwsCfRef
                  batchSize?: number
                  maximumBatchingWindow?: number
                  enabled?: boolean
                  queue: string
                  virtualHost?: string
              }
          }
        | {
              msk: {
                  arn: AwsArnString | AwsCfImport | AwsCfRef
                  batchSize?: number
                  maximumBatchingWindow?: number
                  enabled?: boolean
                  startingPosition?: 'LATEST' | 'TRIM_HORIZON'
                  topic: string
                  saslScram512?: AwsArnString
              }
          }
        | {
              alb: {
                  authorizer?: string[]
                  conditions: {
                      header?: {
                          name: string
                          values: string[]
                      }
                      host?: string[]
                      ip?: (string | string)[]
                      method?: string[]
                      path?: string[]
                      query?: {
                          [k: string]: string
                      }
                  }
                  healthCheck?:
                      | boolean
                      | {
                            healthyThresholdCount?: number
                            intervalSeconds?: number
                            matcher?: {
                                httpCode?: string
                            }
                            path?: string
                            timeoutSeconds?: number
                            unhealthyThresholdCount?: number
                        }
                  listenerArn: AwsAlbListenerArn | AwsCfRef
                  multiValueHeaders?: boolean
                  priority: number
                  targetGroupName?: string
              }
          }
        | {
              alexaSkill:
                  | AwsAlexaEventToken
                  | {
                        appId: AwsAlexaEventToken
                        enabled?: boolean
                    }
          }
        | {
              alexaSmartHome:
                  | AwsAlexaEventToken
                  | {
                        appId: AwsAlexaEventToken
                        enabled?: boolean
                    }
          }
        | {
              iot: {
                  sql: string
                  sqlVersion?: '2015-10-08' | '2016-03-23' | 'beta'
                  name?: string
                  enabled?: boolean
                  description?: string
              }
          }
        | {
              iotFleetProvisioning: {
                  enabled?: boolean
                  provisioningRoleArn: AwsArn
                  templateBody: {
                      [k: string]: unknown
                  }
                  templateName?: string
              }
          }
        | {
              cloudwatchEvent: {
                  event?: {
                      [k: string]: unknown
                  }
                  input?:
                      | string
                      | {
                            [k: string]: unknown
                        }
                  inputPath?: string
                  inputTransformer?: {
                      inputPathsMap?: {
                          [k: string]: string
                      }
                      inputTemplate: string
                  }
                  description?: string
                  name?: string
                  enabled?: boolean
              }
          }
        | {
              cloudwatchLog:
                  | AwsLogGroupName
                  | {
                        logGroup: AwsLogGroupName
                        filter?: string
                    }
          }
        | {
              cognitoUserPool: {
                  pool: string
                  trigger:
                      | 'PreSignUp'
                      | 'PostConfirmation'
                      | 'PreAuthentication'
                      | 'PostAuthentication'
                      | 'PreTokenGeneration'
                      | 'CustomMessage'
                      | 'DefineAuthChallenge'
                      | 'CreateAuthChallenge'
                      | 'VerifyAuthChallengeResponse'
                      | 'UserMigration'
                  existing?: boolean
                  forceDeploy?: boolean
              }
          }
        | {
              eventBridge:
                  | {
                        [k: string]: unknown
                    }
                  | {
                        [k: string]: unknown
                    }
          }
        | {
              sqs:
                  | AwsArnString
                  | {
                        arn: AwsArn
                        batchSize?: number
                        enabled?: boolean
                        maximumBatchingWindow?: number
                        functionResponseType?: 'ReportBatchItemFailures'
                        filterPatterns?: FilterPatterns
                    }
          }
        | {
              cloudFront: {
                  behavior?: {
                      AllowedMethods?:
                          | ('GET' | 'HEAD')[]
                          | ('GET' | 'HEAD' | 'OPTIONS')[]
                          | (
                                | 'GET'
                                | 'HEAD'
                                | 'OPTIONS'
                                | 'PUT'
                                | 'PATCH'
                                | 'POST'
                                | 'DELETE'
                            )[]
                      CachedMethods?:
                          | ('GET' | 'HEAD')[]
                          | ('GET' | 'HEAD' | 'OPTIONS')[]
                      CachePolicyId?: string
                      Compress?: boolean
                      FieldLevelEncryptionId?: string
                      OriginRequestPolicyId?: string
                      SmoothStreaming?: boolean
                      TrustedSigners?: string[]
                      ViewerProtocolPolicy?:
                          | 'allow-all'
                          | 'redirect-to-https'
                          | 'https-only'
                      TrustedKeyGroups?: (string | AwsCfRef)[]
                  }
                  cachePolicy?:
                      | {
                            [k: string]: unknown
                        }
                      | {
                            [k: string]: unknown
                        }
                  eventType?:
                      | 'viewer-request'
                      | 'origin-request'
                      | 'origin-response'
                      | 'viewer-response'
                  isDefaultOrigin?: boolean
                  includeBody?: boolean
                  origin?:
                      | string
                      | (
                            | {
                                  [k: string]: unknown
                              }
                            | {
                                  [k: string]: unknown
                              }
                        )
                  pathPattern?: string
              }
          }
        | {
              httpApi:
                  | string
                  | {
                        authorizer?:
                            | string
                            | (
                                  | {
                                        [k: string]: unknown
                                    }
                                  | {
                                        [k: string]: unknown
                                    }
                                  | {
                                        [k: string]: unknown
                                    }
                              )
                        method?: string
                        path: string
                    }
          }
    )[]
    architecture?: AwsLambdaArchitecture
    awsKmsKeyArn?: AwsKmsArn
    condition?: AwsResourceCondition
    dependsOn?: AwsResourceDependsOn
    description?: string
    destinations?: {
        onSuccess?:
            | string
            | {
                  arn: AwsCfFunction
                  type: 'function' | 'sns' | 'sqs' | 'eventBus'
              }
        onFailure?:
            | string
            | {
                  arn: AwsCfFunction
                  type: 'function' | 'sns' | 'sqs' | 'eventBus'
              }
    }
    disableLogs?: boolean
    environment?: AwsLambdaEnvironment
    ephemeralStorageSize?: number
    fileSystemConfig?: {
        arn: string | AwsCfGetAtt | AwsCfJoin | AwsCfImport
        localMountPath: string
    }
    handler?: string
    image?:
        | EcrImageUri
        | {
              name?: string
              uri?: EcrImageUri
              workingDirectory?: string
              command?: string[]
              entryPoint?: string[]
          }
    kmsKeyArn?: AwsKmsArn
    layers?: AwsLambdaLayers
    logRetentionInDays?: AwsLogRetentionInDays
    maximumEventAge?: number
    maximumRetryAttempts?: number
    memorySize?: AwsLambdaMemorySize
    onError?: string | AwsCfFunction
    package?: {
        artifact?: string
        exclude?: string[]
        include?: string[]
        individually?: boolean
        patterns?: string[]
    }
    provisionedConcurrency?: number
    reservedConcurrency?: number | AwsCfFunction | AwsCfIf
    role?: AwsLambdaRole
    runtime?: AwsLambdaRuntime
    tags?: AwsResourceTags
    timeout?: AwsLambdaTimeout
    tracing?: AwsLambdaTracing
    url?:
        | boolean
        | {
              authorizer?: 'aws_iam'
              cors?:
                  | boolean
                  | {
                        allowCredentials?: boolean
                        allowedHeaders?: string[]
                        allowedMethods?: string[]
                        allowedOrigins?: string[]
                        exposedResponseHeaders?: string[]
                        maxAge?: number
                    }
          }
    versionFunction?: AwsLambdaVersioning
    vpc?: AwsLambdaVpcConfig
    httpApi?: {
        payload?: AwsHttpApiPayload
    }
}
