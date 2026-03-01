import { Request, Response } from "express"
import { AuthService } from "../services/auth.service"

export class AuthController {

  // 🔐 REGISTER API
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        })
      }

      const result = await AuthService.register(name, email, password)

      return res.status(201).json({
        message: "User registered successfully",
        ...result,
      })

    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Registration failed",
      })
    }
  }

  // 🔑 LOGIN API
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        })
      }

      const result = await AuthService.login(email, password)

      return res.status(200).json({
        message: "Login successful",
        ...result,
      })

    } catch (error: any) {
      return res.status(401).json({
        message: error.message || "Login failed",
      })
    }
  }
}