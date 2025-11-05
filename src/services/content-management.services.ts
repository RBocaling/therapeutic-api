import prisma from "../config/prisma";


export const createCourse = async (data: {
  title: string;
  category: string;
  description?: string;
  type: "MODULES" | "IMAGES" | "VIDEOS" | "AUDIO";
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
        content?: string;
        videoUrls?: string[];
        imageUrls?: string[];
        audioUrls?: string[];
      }[];
    }[];
  }[];
  images?: string[];
  videoUrl?: string;
  audioUrl?: string;
}) => {
  try {
    const course = await prisma.$transaction(async (tx) => {
      const newCourse = await tx.contentCourse.create({
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
            data: {
              courseId: newCourse.id,
              title: mod.title,
              order: mod.order,
            },
          });

          for (const les of mod.lessons) {
            const lesson = await tx.lesson.create({
              data: {
                moduleId: module.id,
                title: les.title,
                description: les.description,
                duration: les.duration,
                order: les.order,
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
                  content: cont.content,
                  videoUrls: cont.videoUrls ?? [],
                  audioUrls: cont.audioUrls ?? [],
                  imageUrls: cont.imageUrls ?? [],
                  uploadedById: data.uploadedById,
                },
              });
            }
          }
        }
      }

      if (data.type === "IMAGES" && data.images) {
        for (const imageUrl of data.images) {
          await tx.courseImage.create({
            data: { courseId: newCourse.id, imageUrl },
          });
        }
      }

      if (data.type === "VIDEOS" && data.videoUrl) {
        await tx.courseVideo.create({
          data: {
            courseId: newCourse.id,
            title: data.title,
            description: data.description,
            videoUrl: data.videoUrl,
          },
        });
      }

      if (data.type === "AUDIO" && data.audioUrl) {
        await tx.courseAudio.create({
          data: {
            courseId: newCourse.id,
            title: data.title,
            description: data.description,
            audioUrl: data.audioUrl,
          },
        });
      }

      // ✅ MUST RETURN COURSE WITH RELATIONS
      return tx.contentCourse.findUnique({
        where: { id: newCourse.id },
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
          audios: true, // ✅ this returns audio
        },
      });
    });

    return course;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create course");
  }
};

export const listCourses = async () => {
  try {
    return await prisma.contentCourse.findMany({
      where: { isDeleted: false },
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
        audios: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to list courses");
  }
};

export const getMylistCourses = async (id: number) => {
  try {
    return await prisma.contentCourse.findMany({
      where: { isDeleted: false, uploadedById: id },
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
        audios: true,
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
      where: { id, isDeleted: false },
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
        audios: true,
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

export const updateCourseWithStructure = async (
  id: number,
  data: {
    title: string;
    description?: string;
    type: "MODULES" | "IMAGES" | "VIDEOS" | "AUDIO";
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
          content?: string;
          videoUrls?: string[];
          imageUrls?: string[];
          audioUrls?: string[];
        }[];
      }[];
    }[];
    images?: string[];
    videoUrl?: string;
    audioUrl?: string;
  }
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const course = await tx.contentCourse.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
        },
      });

      // DELETE CONTENT first (because it depends on lessons)
      const lessons = await tx.lesson.findMany({
        where: { module: { courseId: id } },
      });
      const lessonIds = lessons.map((l) => l.id);

      if (lessonIds.length > 0) {
        await tx.content.deleteMany({
          where: { lessonId: { in: lessonIds } },
        });
      }

      // DELETE LESSONS and MODULES
      await tx.lesson.deleteMany({ where: { module: { courseId: id } } });
      await tx.module.deleteMany({ where: { courseId: id } });

      // DELETE IMAGES, VIDEOS, AUDIO (not dependent on modules)
      await tx.courseImage.deleteMany({ where: { courseId: id } });
      await tx.courseVideo.deleteMany({ where: { courseId: id } });
      await tx.courseAudio.deleteMany({ where: { courseId: id } });

      // RECREATE STRUCTURE
      if (data.type === "MODULES" && data.modules) {
        for (const mod of data.modules) {
          const module = await tx.module.create({
            data: { title: mod.title, order: mod.order, courseId: id },
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
                  content: cont.content,
                  videoUrls: cont.videoUrls ?? [],
                  imageUrls: cont.imageUrls ?? [],
                  audioUrls: cont.audioUrls ?? [],
                  uploadedById: course.uploadedById,
                },
              });
            }
          }
        }
      }

      if (data.type === "IMAGES" && data.images) {
        for (const img of data.images) {
          await tx.courseImage.create({
            data: { courseId: id, imageUrl: img },
          });
        }
      }

      if (data.type === "VIDEOS" && data.videoUrl) {
        await tx.courseVideo.create({
          data: {
            courseId: id,
            title: data.title,
            description: data.description,
            videoUrl: data.videoUrl,
          },
        });
      }

      if (data.type === "AUDIO" && data.audioUrl) {
        await tx.courseAudio.create({
          data: {
            courseId: id,
            title: data.title,
            description: data.description,
            audioUrl: data.audioUrl,
          },
        });
      }

      return course;
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update course");
  }
};

export const deleteCourse = async (id?: number) => {
  try {
    const campaign = await prisma.contentCourse.findUnique({
      where: { id },
    });
    if (!campaign) throw new Error("Campaign not found");

    return await prisma.contentCourse.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch feedbacks: ${error}`);
  }
};