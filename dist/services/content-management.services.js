"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourseWithStructure = exports.getRatingsByContent = exports.addOrUpdateRating = exports.updateCourse = exports.getCourseById = exports.getMylistCourses = exports.listCourses = exports.createCourse = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createCourse = async (data) => {
    try {
        const course = await prisma_1.default.$transaction(async (tx) => {
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
    }
    catch (error) {
        throw new Error(error.message || "Failed to create course");
    }
};
exports.createCourse = createCourse;
const listCourses = async () => {
    try {
        return await prisma_1.default.contentCourse.findMany({
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
    }
    catch (error) {
        throw new Error(error.message || "Failed to list courses");
    }
};
exports.listCourses = listCourses;
const getMylistCourses = async (id) => {
    try {
        return await prisma_1.default.contentCourse.findMany({
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
    }
    catch (error) {
        throw new Error(error.message || "Failed to list courses");
    }
};
exports.getMylistCourses = getMylistCourses;
const getCourseById = async (id) => {
    try {
        return await prisma_1.default.contentCourse.findUnique({
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
    }
    catch (error) {
        throw new Error(error.message || "Failed to fetch course");
    }
};
exports.getCourseById = getCourseById;
const updateCourse = async (id, data) => {
    try {
        return await prisma_1.default.contentCourse.update({ where: { id }, data });
    }
    catch (error) {
        throw new Error(error.message || "Failed to update course");
    }
};
exports.updateCourse = updateCourse;
const addOrUpdateRating = async (userId, contentId, rating, description) => {
    try {
        const existing = await prisma_1.default.contentRating.findUnique({
            where: { contentId_userId: { contentId, userId } },
        });
        if (existing) {
            return await prisma_1.default.contentRating.update({
                where: { id: existing.id },
                data: { rating, description, updatedAt: new Date() },
            });
        }
        return await prisma_1.default.contentRating.create({
            data: { userId, contentId, rating, description },
        });
    }
    catch (error) {
        throw new Error(error.message || "Failed to add/update rating");
    }
};
exports.addOrUpdateRating = addOrUpdateRating;
const getRatingsByContent = async (contentId) => {
    try {
        return await prisma_1.default.contentRating.findMany({
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
    }
    catch (error) {
        throw new Error(error.message || "Failed to fetch ratings");
    }
};
exports.getRatingsByContent = getRatingsByContent;
const updateCourseWithStructure = async (id, data) => {
    try {
        return await prisma_1.default.$transaction(async (tx) => {
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
    }
    catch (error) {
        throw new Error(error.message || "Failed to update course");
    }
};
exports.updateCourseWithStructure = updateCourseWithStructure;
const deleteCourse = async (id) => {
    try {
        const campaign = await prisma_1.default.contentCourse.findUnique({
            where: { id },
        });
        if (!campaign)
            throw new Error("Campaign not found");
        return await prisma_1.default.contentCourse.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });
    }
    catch (error) {
        throw new Error(`Failed to fetch feedbacks: ${error}`);
    }
};
exports.deleteCourse = deleteCourse;
