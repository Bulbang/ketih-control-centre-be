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
        verify_email: {
            type: 'boolean',
        },
    },
    additionalProperties: false,
    required: [
        'first_name',
        'last_name',
        'email',

        'country',
        'password',
        'business_unit',
    ],
} as const
