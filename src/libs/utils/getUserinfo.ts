import { UserInfo } from '@declarations/db/userinfo'
import axios from 'axios'

export const getUserInfo = async (token: string, auth0Url: string) => {
    const { data } = await axios.get<UserInfo>(`${auth0Url}/userinfo`, {
        headers: { authorization: `Bearer ${token}` },
    })
    return data
}
