export default {
    type: 'object',
    properties: {
        first_name: {
            type: 'string',
        },
        last_name: {
            type: 'string',
        },
        phone_number_mobile: {
            type: 'string',
        },
        country_code: {
            type: 'string',
        },
        status: {
            type: 'string',
        },
        business_unit: {
            type: 'string',
        },
        position_title: {
            type: 'string',
        },
    },
    additionalProperties: false,
} as const
