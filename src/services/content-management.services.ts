import prisma from "../config/prisma";

export const createCourse = async (data: {
  title: string;
  description?: string;
  type: "MODULES" | "IMAGES" | "VIDEOS";
  uploadedById: number;
  modules?: {
    title: string;
    order: number;
    lessons: {
      title: string;
      description?: string;
      duration?: string;
      order: number;
      contents: {
        title: string;
        type: "TEXT" | "IMAGE" | "VIDEO" | "RESOURCE";
        description?: string;
        category?: string;
        targetAudience?: "GENERAL" | "ADULTS" | "TEENS" | "CHILDREN";
        content?: string;
        videoUrls?: string[];
        imageUrls?: string[];
      }[];
    }[];
  }[];
  images?: { title: string; description?: string; imageUrl: string }[];
  videos?: { title: string; description?: string; videoUrl: string }[];
}) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const course = await tx.contentCourse.create({
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
          uploadedById: data.uploadedById,
        },
      });

      if (data.type === "MODULES" && data.modules) {
        for (const mod of data.modules) {
          const module = await tx.module.create({
            data: { title: mod.title, order: mod.order, courseId: course.id },
          });
          for (const les of mod.lessons) {
            const lesson = await tx.lesson.create({
              data: {
                title: les.title,
                description: les.description,
                duration: les.duration,
                order: les.order,
                moduleId: module.id,
              },
            });
            for (const cont of les.contents) {
              await tx.content.create({
                data: {
                  lessonId: lesson.id,
                  title: cont.title,
                  type: cont.type,
                  description: cont.description,
                  category: cont.category,
                  targetAudience: cont.targetAudience ?? "GENERAL",
                  content: cont.content,
                  videoUrls: cont.videoUrls ?? [],
                  imageUrls: cont.imageUrls ?? [],
                  uploadedById: data.uploadedById,
                },
              });
            }
          }
        }
      }

      if (data.type === "IMAGES" && data.images) {
        for (const img of data.images) {
          await tx.courseImage.create({
            data: {
              courseId: course.id,
              title: img.title,
              description: img.description,
              imageUrl: img.imageUrl,
            },
          });
        }
      }

      if (data.type === "VIDEOS" && data.videos) {
        for (const vid of data.videos) {
          await tx.courseVideo.create({
            data: {
              courseId: course.id,
              title: vid.title,
              description: vid.description,
              videoUrl: vid.videoUrl,
            },
          });
        }
      }

      return course;
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create course");
  }
};

export const listCourses = async () => {
  try {
    return await prisma.contentCourse.findMany({
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                contents: { include: { ratings: true } },
              },
            },
          },
        },
        images: true,
        videos: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to list courses");
  }
};

export const getCourseById = async (id: number) => {
  try {
    return await prisma.contentCourse.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                contents: {
                  include: {
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
                },
              },
            },
          },
        },
        images: true,
        videos: true,
      },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch course");
  }
};

export const updateCourse = async (
  id: number,
  data: { title?: string; description?: string }
) => {
  try {
    return await prisma.contentCourse.update({ where: { id }, data });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update course");
  }
};

export const updateModule = async (
  id: number,
  data: { title?: string; order?: number }
) => {
  try {
    return await prisma.module.update({ where: { id }, data });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update module");
  }
};

export const updateLesson = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    duration?: string;
    order?: number;
  }
) => {
  try {
    return await prisma.lesson.update({ where: { id }, data });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update lesson");
  }
};

export const updateContent = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    category?: string;
    targetAudience?: "GENERAL" | "ADULTS" | "TEENS" | "CHILDREN";
    content?: string;
    videoUrls?: string[];
    imageUrls?: string[];
  }
) => {
  try {
    return await prisma.content.update({ where: { id }, data });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update content");
  }
};

export const updateCourseImage = async (
  id: number,
  data: { title?: string; description?: string; imageUrl?: string }
) => {
  try {
    return await prisma.courseImage.update({ where: { id }, data });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update course image");
  }
};

export const updateCourseVideo = async (
  id: number,
  data: { title?: string; description?: string; videoUrl?: string }
) => {
  try {
    return await prisma.courseVideo.update({ where: { id }, data });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update course video");
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
      return await prisma.contentRating.update({
        where: { id: existing.id },
        data: { rating, description, updatedAt: new Date() },
      });
    }
    return await prisma.contentRating.create({
      data: { userId, contentId, rating, description },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to add/update rating");
  }
};

export const getRatingsByContent = async (contentId: number) => {
  try {
    return await prisma.contentRating.findMany({
      where: { contentId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch ratings");
  }
};
