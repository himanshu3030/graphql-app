import { createHmac, randomBytes } from 'node:crypto'
import {prisma} from '../lib/prisma.js'
// import jwt from 'jsonwebtoken'
import jwt from "jsonwebtoken"

const secret = "superman"

export interface CreateUserPayload{
    firstName: string
    lastName?: string
    email: string
    password: string

}
export interface GetUserTokenPayload{
    email: string;
    password: string;
}

class UserService {

    private static generateHash(salt: string, password: string  ){
        
        const hashedPassword = createHmac('sha256', salt).update(password).digest("hex")
        return hashedPassword
    }

    public static createUser(payload: CreateUserPayload){
        
        const {firstName, lastName, email, password} = payload
        const salt = randomBytes(32).toString('hex')
        const hashedPassword = UserService.generateHash(email, password)

        return prisma.user.create({
            data:{
                firstName,
                lastName,
                email,
                salt,
                password: hashedPassword
            },
        })
    }

    public static getUserbyEmail(email: string){
        return prisma.user.findUnique({ where: {email}})

    }

    public static async getUserToken(payload: GetUserTokenPayload){
        const { email, password} = payload;
        const user = await UserService.getUserbyEmail(email)
        if(!user) throw new Error("user not found");

        const usersalt = user.salt
        const userHashedPassword = UserService.generateHash(usersalt, password)

        if(userHashedPassword !== user.password){
            throw new Error("Incorrect Password")
        }
        
        const token = jwt.sign({ id: user.id, email: user.email}, secret)
        return token;

    }
}

export default UserService;