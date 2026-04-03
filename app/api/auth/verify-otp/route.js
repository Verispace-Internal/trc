import { verifyOtpAndRegister } from "../../../../controllers/authController";


export async function POST(req) {
  return verifyOtpAndRegister(req);
}
