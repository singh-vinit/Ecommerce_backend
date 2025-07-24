import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//interfaces
import { Request, Response, NextFunction } from "express";

//inheritance
export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  try {
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ error: "admin access required" });
  }
  next(); //call to next function in middleware
};
