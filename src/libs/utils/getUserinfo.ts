import { UserInfo } from '@declarations/db/userinfo'
import axios from 'axios'

export const getUserInfo = async (token: string) => {
    const { data } = await axios.get<UserInfo>(
        'https://dev-h6pakmge.us.auth0.com/userinfo',
        {
            headers: { authorization: `Bearer ${token}` },
        },
    )
    return data
}
