import { currentUser } from "../../../../middleware/authMiddleware";

export async function GET(req) {
  return currentUser(req);
};