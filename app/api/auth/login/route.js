import { loginUser } from "../../../../controllers/authController";


export async function POST(req) {
  return loginUser(req);
}