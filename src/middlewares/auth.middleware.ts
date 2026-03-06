import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
  userId: string
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" })
  }

  const token = authHeader.split(" ")[1]

  console.log("TOKEN:", token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    console.log("decoded", decoded)
    req.userId = decoded.userId

    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}
