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
        sms_allowed: {
            type: 'number',
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
        phone_number_home: {
            type: 'string',
        },
    },
    additionalProperties: false,
    required: [
        'first_name',
        'last_name',
        'phone_number_mobile',
        'country_code',
        'status',
        'business_unit',
        'position_title',
    ],
} as const
