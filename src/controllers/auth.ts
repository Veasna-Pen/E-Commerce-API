import { Request, Response } from "express"
import { prismaClient } from "..";
import { hashSync } from 'bcrypt'

export const Login = (req: Request, res: Response) => {
    res.send("Login successful")
}

export const Signup = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
        let user = await prismaClient.user.findFirst({ where: { email } });

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10),
            },
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};