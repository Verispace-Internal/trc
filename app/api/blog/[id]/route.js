import { deleteBlog, getBlog } from "../../../../controllers/blogController";

export async function GET(req, param) { return getBlog(req, param); }
export async function DELETE(req, param) { return deleteBlog(req, param); }