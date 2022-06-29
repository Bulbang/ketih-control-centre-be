export type AwsResources = {
    AWSTemplateFormatVersion?: string
    Conditions?: {
        [k: string]: unknown
    }
    Description?: string
    Mappings?: {
        [k: string]: unknown
    }
    Metadata?: {
        [k: string]: unknown
    }
    Outputs?: {
        [k: string]: unknown
    }
    Parameters?: {
        [k: string]: unknown
    }
    Resources?: {
        'Fn::Transform'?: {
            Name: string
            Parameters?: {
                [k: string]: unknown
            }
        }
        /**
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^[a-zA-Z0-9]{1,255}$".
         */
    [k: string]: {
            Type: string
            Properties?: {
                [k: string]: unknown
            }
            CreationPolicy?: {
                [k: string]: unknown
            }
            DeletionPolicy?: string
            DependsOn?: AwsResourceDependsOn
            Metadata?: {
                [k: string]: unknown
            }
            UpdatePolicy?: {
                [k: string]: unknown
            }
            UpdateReplacePolicy?: string
            Condition?: AwsResourceCondition
        }
    }
    Transform?: string[]
    extensions?: {
        /**
         * This interface was referenced by `undefined`'s JSON-Schema definition
         * via the `patternProperty` "^[a-zA-Z0-9]{1,255}$".
         */
        [k: string]: {
            Properties?: {
                [k: string]: unknown
            }
            CreationPolicy?: {
                [k: string]: unknown
            }
            DeletionPolicy?: string
            DependsOn?: AwsResourceDependsOn
            Metadata?: {
                [k: string]: unknown
            }
            UpdatePolicy?: {
                [k: string]: unknown
            }
            UpdateReplacePolicy?: string
            Condition?: AwsResourceCondition
        }
    }
}
