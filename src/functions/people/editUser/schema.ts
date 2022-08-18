export default {
    type: 'object',
    properties: {
        first_name: {
            type: 'string',
        },
        last_name: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        phone_numbers: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    phone: {
                        type: 'string',
                    },
                    type: {
                        type: 'string',
                    },
                },
                additionalProperties: false,
                required: ['phone', 'type'],
            },
        },
        // role: {
        //     type: 'string',
        // },
        country: {
            type: 'string',
        },
        status: {
            type: 'string',
        },
        business_unit: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
    },
    additionalProperties: false,
} as const
