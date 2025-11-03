// src/services/contentCourse.service.ts
import prisma from "../config/prisma";

export const createFullCourse = async (data: {
  title: string;
  description?: string;
  uploadedById: number;
  modules: {
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
}) => {
  return prisma.$transaction(async (tx) => {
    const course = await tx.contentCourse.create({
      data: {
        title: data.title,
        description: data.description,
        uploadedById: data.uploadedById,
      },
    });
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
    return course;
  });
};

export const listCourses = async () => {
  return prisma.contentCourse.findMany({
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              contents: {
                include: { ratings: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getCourseById = async (id: number) => {
  return prisma.contentCourse.findUnique({
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
    },
  });
};

export const updateCourse = async (
  id: number,
  data: { title?: string; description?: string }
) => {
  return prisma.contentCourse.update({ where: { id }, data });
};

export const updateModule = async (
  id: number,
  data: { title?: string; order?: number }
) => {
  return prisma.module.update({ where: { id }, data });
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
  return prisma.lesson.update({ where: { id }, data });
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
  return prisma.content.update({ where: { id }, data });
};

export const addOrUpdateRating = async (
  userId: number,
  contentId: number,
  rating: number,
  description?: string
) => {
  const existing = await prisma.contentRating.findUnique({
    where: { contentId_userId: { contentId, userId } },
  });
  if (existing) {
    return prisma.contentRating.update({
      where: { id: existing.id },
      data: { rating, description, updatedAt: new Date() },
    });
  }
  return prisma.contentRating.create({
    data: { userId, contentId, rating, description },
  });
};

export const getRatingsByContent = async (contentId: number) => {
  return prisma.contentRating.findMany({
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
};
