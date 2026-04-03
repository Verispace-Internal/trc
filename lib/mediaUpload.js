import imagekit from "./imagekit";

export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const uploadMedia = async (file, folder = "general") => {

  if (!file || file.size === 0) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error("File size exceeds 5MB limit");
  }

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const upload = await imagekit.upload({
    file:     buffer,
    fileName: `${Date.now()}-${file.name}`,
    folder,
  });

  return {
    url:    upload.url,
    fileId: upload.fileId,
  };
};