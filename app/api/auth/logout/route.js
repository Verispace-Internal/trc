import { logoutUser } from "../../../../controllers/authController"

// POST /api/auth/logout
export async function POST() {
  return logoutUser()
}