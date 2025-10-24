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
        uploadedBy: { select: { id: true, firstName: true, lastName: true, role:true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return contents;
  } catch (error:any) {
    throw new Error(error);
  }
};

export const updateContent = async (
  id: number,
  data: Partial<{
    title: string;
    type: "GUIDE" | "COURSE" | "RESOURCE";
    description?: string;
    category?: string;
    targetAudience?: "GENERAL" | "ADULTS" | "TEENS" | "CHILDREN";
    content?: string;
    videoUrl?: string;
  }>
) => {
  try {
    const content = await prisma.content.update({
      where: { id },
      data,
    });
    return content;
  } catch (error:any) {
    throw new Error(error);
  }
};

export const deleteContent = async (id: number) => {
 try {
     await prisma.content.delete({ where: { id } });
     return { message: "Content deleted successfully" };
 } catch (error:any) {
    throw new Error(error);
 }
};
