export type UserInfo = {
    sub: string
    given_name: string
    family_name: string
    nickname: string
    name: string
    picture: string
    locale: string
    updated_at: string
    email: string
    email_verified: boolean
    [key: `${string}/roles`]: string[]
    [key: `${string}/user_metadata`]: {
        business_unit: string
        phone_number_mobile: string
        country: string
        status: string
    }
}

export type Users = {
    user_id: string
    email: string
    email_verified: boolean
    username: string
    phone_number: string
    phone_verified: boolean
    created_at: string
    updated_at: string
    identities: Identity[]
    app_metadata: { roles: string[] }
    user_metadata: {
        business_unit: string
        phone_number_mobile: string
        country: string
        status: string
    }
    picture: string
    name: string
    nickname: string
    multifactor: string[]
    last_ip: string
    last_login: string
    logins_count: number
    blocked: boolean
    given_name: string
    family_name: string
}[]

export type Metadata = { [key: string]: any }

export type Identity = {
    connection: string
    user_id: string
    provider: string
    isSocial: boolean
}

export type UserRoles = 'superAdmin' | 'manager' | 'user'
