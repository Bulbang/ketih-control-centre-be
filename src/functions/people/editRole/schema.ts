export default {
    type: 'object',
    properties: {
        role: {
            type: 'string',
        },
    },
    required: ['role'],
    additionalProperties: false,
} as const
