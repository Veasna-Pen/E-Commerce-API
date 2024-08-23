import { Request, Response } from "express"
import { prismaClient } from "..";
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";

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

export const Login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prismaClient.user.findFirst({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: "User doesn't exist" });
        }

        const isPasswordValid = compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Incorrect password!" });
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};