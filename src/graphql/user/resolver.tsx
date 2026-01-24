import UserService, { CreateUserPayload } from "../../services/user.js"

const queries = {
    getUserToken: async(_: any, payload: {email: string, password: string})=>{
      const token = await UserService.getUserToken({
        email: payload.email,
        password: payload.password
      })
      return token
    }
}
const mutation = {
    createuser: async(_: any, payload: CreateUserPayload )=>{
        const res = await UserService.createUser(payload);
        return res.id
    }
}

export const resolver = {queries, mutation}