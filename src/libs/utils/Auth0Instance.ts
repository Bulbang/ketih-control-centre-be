import { OrgsList, Users } from '@declarations/db/userinfo'
import { badRequest } from '@hapi/boom'
import axios, { AxiosInstance } from 'axios'
const baseURL = process.env.AUTH0_URL
const { DEFAULT_PAGE_OFFSET, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } =
    process.env
const roles = ['superadmin', 'manager', 'user']

// Required AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_URL(application domain) in .env
// DEFAULT_PAGE_OFFSET could be any number more than 0
const undefinedIfAllValuesUndefined = (obj: Object) => {
    return Object.values(obj).every((item) => item == undefined)
        ? undefined
        : obj
}

const validateEmail = (email: string) => {
    return !!email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
}

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
        phone_numbers,
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
        phone_numbers?: { type?: string; phone?: string }[]
        role?: string
        country: string
        status: string
        business_unit: string
        password: string
        verify_email?: boolean
    }) => {
        if (!validateEmail(email)) {
            throw badRequest('Invalid email')
        }

        if (role && !roles.includes(role.toLowerCase()))
            throw badRequest(`Unknown role ${role}`)

        const userMetadata = {
            country,
            status,
            business_unit,
            phone_numbers,
            tos_signed: false,
        }

        console.log('user metadata: ', JSON.stringify(userMetadata, null, 2))

        const name =
            first_name && last_name ? `${first_name} ${last_name}` : undefined

        return this._instance.post(
            '/api/v2/users',
            {
                email,
                user_metadata: userMetadata,
                app_metadata: { roles: [role || 'user'] },
                given_name: first_name,
                family_name: last_name,
                name,
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
            phone_numbers,
            role,
            country,
            status,
            business_unit,
            password,
            tos_signed,
        }: {
            first_name?: string
            last_name?: string
            email?: string
            phone_numbers?: { type: string; phone: string }[]
            role?: string
            country?: string
            status?: string
            business_unit?: string
            password?: string
            tos_signed?: boolean
        },
    ) => {
        if (email && !validateEmail(email)) {
            throw badRequest('Invalid email')
        }

        if (role && !roles.includes(role?.toLowerCase()))
            throw badRequest(`Unknown role ${role}`)

        const userMetadata = undefinedIfAllValuesUndefined({
            country,
            status,
            business_unit,
            phone_numbers,
            tos_signed,
        })

        const name =
            first_name && last_name ? `${first_name} ${last_name}` : undefined

        return this._instance.patch(
            `/api/v2/users/${id}`,
            {
                email,
                // phone_number: phone_number_mobile,
                user_metadata: { ...userMetadata },
                app_metadata: role ? { roles: [role] } : undefined,
                given_name: first_name,
                family_name: last_name,
                name,
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
                    user.user_metadata?.status?.toLowerCase() == 'active'
                        ? ++counter
                        : counter,
                0,
            ),
        }
    }

    listUserOrgs = async (userId: string) => {
        const { data } = await this._instance.get<OrgsList[]>(
            `/api/v2/users/${userId}/organizations`,
            {
                headers: {
                    Authorization: `Bearer ${this._token}`,
                },
            },
        )
        return data.map((org) => +org.metadata.org_id)
    }
}

const auth0Instance = new Auth0Instance()
const getAuth0Instance = async () => {
    await auth0Instance.updateToken()
    return auth0Instance
}

export default getAuth0Instance
