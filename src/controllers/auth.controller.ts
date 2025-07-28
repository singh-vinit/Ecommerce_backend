import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { registerSchema, loginSchema } from "../schema/user";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";

export const register = async function (req: Request, res: Response) {
  try {
    const validatedData = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await hashPassword(validatedData.password);
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    const token = generateToken(user.id, user.role);
    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    res.json(500).json({ error: "Internal server error" });
  }
};

export const login = async function (req: Request, res: Response) {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (
      !user ||
      !(await comparePassword(validatedData.password, user.password))
    ) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const token = generateToken(user.id, user.role);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
