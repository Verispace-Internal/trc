import { createJoinRequest, getAllJoinRequests } from "../../../controllers/joincommunityController"

// POST /api/join — public (user submits form)
export async function POST(req) {
  return createJoinRequest(req)
}

// GET /api/join — admin only
export async function GET(req) {
  return getAllJoinRequests(req)
}