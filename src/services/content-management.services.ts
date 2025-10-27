import prisma from "../config/prisma";

export const createContent = async (data: {
  title: string;
  type: "GUIDE" | "COURSE" | "RESOURCE";
  description?: string;
  category?: string;
  targetAudience: "GENERAL" | "ADULTS" | "TEENS" | "CHILDREN";
  content?: string;
  videoUrl?: string;
  uploadedById: number;
}) => {
 try {
     const content = await prisma.content.create({
       data,
       include: {
         uploadedBy: {
           select: { id: true, firstName: true, lastName: true, email: true },
         },
       },
     });
     return content;
 } catch (error:any) {
    throw new Error(error)
 }
};

export const listContents = async (userId?: number) => {
  try {
    const where = userId ? { uploadedById: userId } : {};
    const contents = await prisma.content.findMany({
      where,
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profilePic: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return contents;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const viewContentById = async (id: number) => {
  try {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            profilePic: true,
          },
        },
        ratings: {
          select: {
            id: true,
            rating: true,
            description: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });

    if (!content) throw new Error("Content not found");

    return content;
  } catch (error: any) {
    throw new Error(String(error));
  }
};

export const updateContent = async (
  id: number,
  data: {
    title?: string;
    type?: "GUIDE" | "COURSE" | "RESOURCE";
    description?: string;
    category?: string;
    targetAudience?: "GENERAL" | "ADULTS" | "TEENS" | "CHILDREN";
    status?: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
    content?: string;
    imageUrl?: string;
    isAnonymous?: boolean;
    isPostApproved?: boolean;
  }
) => {
  console.log("Service data received:", data); // ✅ should now log true

  try {
    const updated = await prisma.content.update({
      where: { id },
      data,
    });

    return updated;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update content");
  }
};

export const deleteContent = async (id: number) => {
  try {
    await prisma.content.delete({ where: { id } });
    return { message: "Content deleted successfully" };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addOrUpdateRating = async (
  userId: number,
  contentId: number,
  rating: number,
  description?: string
) => {
  try {
    const existing = await prisma.contentRating.findUnique({
      where: { contentId_userId: { contentId, userId } },
    });

    if (existing) {
      const updated = await prisma.contentRating.update({
        where: { id: existing.id },
        data: { rating, description, updatedAt: new Date() },
      });
      return updated;
    }

    const newRating = await prisma.contentRating.create({
      data: { userId, contentId, rating, description },
    });
    return newRating;
  } catch (error) {
    throw new Error(`Error in addOrUpdateRating: ${error}`);
  }
};
