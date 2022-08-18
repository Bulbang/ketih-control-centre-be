import getAuth0Instance from '@libs/utils/Auth0Instance'

const main = async () => {
    const a0 = await getAuth0Instance()

    const users = await a0.listUserOrgs('auth0|62d80b621476d8a7345e4df3')
    console.log(users)
}

main()
