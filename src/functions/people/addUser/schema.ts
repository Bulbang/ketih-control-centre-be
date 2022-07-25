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
        phone_number_mobile: {
            type: 'string',
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
        'phone_number_mobile',
        'country',
        'status',
        'password',
        'business_unit',
    ],
} as const
