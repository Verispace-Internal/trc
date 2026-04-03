import { registerUser } from "../../../../controllers/authController";


export async function POST(req) {
  return registerUser(req);
}
