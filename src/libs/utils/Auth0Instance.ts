import { Users } from '@declarations/db/userinfo'
import { badRequest } from '@hapi/boom'
import axios, { AxiosInstance } from 'axios'
const baseURL = process.env.AUTH0_URL
const { DEFAULT_PAGE_OFFSET, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } =
    process.env
const roles = ['superadmin', 'manager', 'user']

class Auth0Instance {
    private _instance: AxiosInstance = axios.create({ baseURL })
    private _token: string
    updateToken = async () => {
        const { data } = await this._instance.post<{
            access_token: string
            type: string
        }>('/oauth/token', {
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            audience: `${baseURL}/api/v2/`,
            grant_type: 'client_credentials',
        })
        this._token = data.access_token
    }
    createUser = async ({
        first_name,
        last_name,
        email,
        phone_number_mobile,
        role,
        country,
        status,
        business_unit,
        password,
        verify_email = true,
    }: {
        first_name: string
        last_name: string
        email: string
        phone_number_mobile: string
        role?: string
        country: string
        status: string
        business_unit: string
        password: string
        verify_email?: boolean
    }) => {
        if (role && !roles.includes(role.toLowerCase()))
            throw badRequest(`Unknown role ${role}`)

        return this._instance.post(
            '/api/v2/users',
            {
                email,
                user_metadata: {
                    country,
                    status,
                    business_unit,
                    phone_number_mobile,
                },
                app_metadata: { roles: [role || 'user'] },
                given_name: first_name,
                family_name: last_name,
                name: `${first_name} ${last_name}`,
                // picture:
                // 'https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl.gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png',
                connection: 'Username-Password-Authentication',
                password,
                verify_email,
            },
            {
                headers: {
                    Authorization: `Bearer ${this._token}`,
                },
            },
        )
    }
    updateUser = async (
        id: string,
        {
            first_name,
            last_name,
            email,
            phone_number_mobile,
            role,
            country,
            status,
            business_unit,
            password,
        }: {
            first_name?: string
            last_name?: string
            email?: string
            phone_number_mobile?: string
            role?: string
            country?: string
            status?: string
            business_unit?: string
            password?: string
        },
    ) => {
        if (role && !roles.includes(role.toLowerCase()))
            throw badRequest(`Unknown role ${role}`)

        return this._instance.patch(
            `/api/v2/users/${id}`,
            {
                email,
                // phone_number: phone_number_mobile,
                user_metadata: {
                    country,
                    status,
                    business_unit,
                    phone_number_mobile,
                },
                app_metadata: role ? { roles: [role] } : undefined,
                given_name: first_name,
                family_name: last_name,
                name:
                    first_name && last_name
                        ? `${first_name} ${last_name}`
                        : undefined,
                // picture:
                // 'https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl.gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png',
                connection: 'Username-Password-Authentication',
                password,
            },
            {
                headers: {
                    Authorization: `Bearer ${this._token}`,
                },
            },
        )
    }

    getUsers = async ({
        page = 1,
        perPage = +DEFAULT_PAGE_OFFSET,
    }: {
        page: number
        perPage: number
    }) => {
        const { data } = await this._instance.get<Users>('/api/v2/users', {
            params: {
                page: --page,
                perPage,
            },
            headers: {
                Authorization: `Bearer ${this._token}`,
            },
        })
        return data
    }

    getStats = async () => {
        const { data } = await this._instance.get<Users>('/api/v2/users', {
            headers: {
                Authorization: `Bearer ${this._token}`,
            },
        })

        return {
            total: data.length,
            active: data.reduce(
                (counter, user) =>
                    user.user_metadata.status.toLowerCase() == 'active'
                        ? ++counter
                        : counter,
                0,
            ),
        }
    }
}

export default new Auth0Instance()
