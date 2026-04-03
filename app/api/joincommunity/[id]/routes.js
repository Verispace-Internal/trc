import { deleteJoinRequest, updateJoinRequestStatus } from "../../../../controllers/joincommunityController"

// DELETE /api/join/[id] — admin only
export async function DELETE(req, params) {
  return deleteJoinRequest(req, params)
}

// PATCH /api/join/[id] — admin only (update status)
export async function PATCH(req, params) {
  return updateJoinRequestStatus(req, params)
}