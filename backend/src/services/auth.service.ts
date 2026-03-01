import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "../config/db"
import { users } from "../db/schema"
import { eq } from "drizzle-orm"

export class AuthService {

  // 🔐 REGISTER
  static async register(name: string, email: string, password: string) {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (existingUser.length > 0) {
      throw new Error("User already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "user",
      })
      .returning()

    const user = newUser[0]

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    )

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }

  // 🔑 LOGIN
  static async login(email: string, password: string) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (existingUser.length === 0) {
      throw new Error("Invalid email or password")
    }

    const user = existingUser[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error("Invalid email or password")
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    )

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }
}