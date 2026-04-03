import { updateBlog, deleteBlog } from "../../../../../controllers/blogController";

export async function PUT(req, param)    { return updateBlog(req, param); }
export async function DELETE(req, param) { return deleteBlog(req, param); }