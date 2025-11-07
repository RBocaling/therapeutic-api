import prisma from "../config/prisma";

export const createSchool = async (name: string) => {
  try {
    const school = await prisma.school?.findFirst({
      where: {
        name,
      },
    });
    if (school) throw new Error("School is already Exist");
    return await prisma.school.create({ data: { name } });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create school");
  }
};

export const createCourse = async (schoolId: number, name: string) => {
  try {
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) throw new Error("School not found");

    return await prisma.course.create({
      data: { name, schoolId },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create course");
  }
};
export const updateSchool = async (
  id: number,
  name: string,
  isDeleted?: boolean
) => {
  try {
    return await prisma.school.update({
      where: { id },
      data: { name, isDeleted },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create course");
  }
};
export const updateCourse = async (
  id: number,
  name: string,
  isDeleted?: boolean
) => {
  try {
    return await prisma.course.update({
      where: { id },
      data: { name, isDeleted },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create course");
  }
};

export const listSchools = async () => {
  try {
    return await prisma.school.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch schools");
  }
};

export const listCoursesBySchool = async (schoolId: number) => {
  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: { courses: { select: { id: true, name: true } } },
    });
    if (!school) throw new Error("School not found");

    return school.courses;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch courses for school");
  }
};
