"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCoursesBySchool = exports.listSchools = exports.createCourse = exports.createSchool = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createSchool = async (name) => {
    try {
        return await prisma_1.default.school.create({ data: { name } });
    }
    catch (error) {
        throw new Error(error.message || "Failed to create school");
    }
};
exports.createSchool = createSchool;
const createCourse = async (schoolId, name) => {
    try {
        const school = await prisma_1.default.school.findUnique({ where: { id: schoolId } });
        if (!school)
            throw new Error("School not found");
        return await prisma_1.default.course.create({
            data: { name, schoolId },
        });
    }
    catch (error) {
        throw new Error(error.message || "Failed to create course");
    }
};
exports.createCourse = createCourse;
const listSchools = async () => {
    try {
        return await prisma_1.default.school.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
    }
    catch (error) {
        throw new Error(error.message || "Failed to fetch schools");
    }
};
exports.listSchools = listSchools;
const listCoursesBySchool = async (schoolId) => {
    try {
        const school = await prisma_1.default.school.findUnique({
            where: { id: schoolId },
            include: { courses: { select: { id: true, name: true } } },
        });
        if (!school)
            throw new Error("School not found");
        return school.courses;
    }
    catch (error) {
        throw new Error(error.message || "Failed to fetch courses for school");
    }
};
exports.listCoursesBySchool = listCoursesBySchool;
