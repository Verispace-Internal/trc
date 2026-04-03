import { createBlog, getBlogs } from "../../../controllers/blogController";

export async function GET(req) { return getBlogs(req); }
export async function POST(req) { return createBlog(req); }