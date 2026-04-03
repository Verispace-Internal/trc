import imagekit from "./imagekit";

export const deleteMedia = async (fileId) => {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.warn("[deleteMedia] ImageKit delete skipped:", error.message);
  }
};