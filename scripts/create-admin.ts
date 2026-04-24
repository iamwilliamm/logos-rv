import "dotenv/config"
import path from "path"
import fs from "fs"
import bcrypt from "bcryptjs"

// Load .env.local explicitly
const envPath = path.join(__dirname, "../.env.local")
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath })
}

import { prisma } from "../src/lib/prisma"

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || "Admin"

  if (!email || !password) {
    console.error("Usage: npm run create-admin <email> <password> [name]")
    console.error("Example: npm run create-admin admin@example.com MyPassword123 'Admin User'")
    process.exit(1)
  }

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log(`⚠️  User already exists: ${email}`)
      console.log("Updating password and role...")

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Update user
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: "ADMIN",
        },
      })

      console.log(`✅ User updated: ${email}`)
      console.log(`   Role: ADMIN`)
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create new admin user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "ADMIN",
        },
      })

      console.log(`✅ Admin user created: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
    }
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
