import prisma from "../config/prisma";

export const createOffice = async (name: string) => {
  try {
    const office = await prisma.office?.findFirst({
      where: {
        name,
      },
    });
    if (office) throw new Error("office is already Exist");
    return await prisma.office.create({ data: { name } });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create office");
  }
};

export const createUnit = async (officeId: number, name: string) => {
  try {
    const office = await prisma.office.findUnique({ where: { id: officeId } });
    if (!office) throw new Error("Office not found");

    return await prisma.unit.create({
      data: { name, officeId },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create office");
  }
};
export const updateOffice = async (
  id: number,
  name: string,
  isDeleted?: boolean
) => {
  try {
    return await prisma.office.update({
      where: { id },
      data: { name, isDeleted },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create Office");
  }
};
export const updateUnit = async (
  id: number,
  name: string,
  isDeleted?: boolean
) => {
  try {
    return await prisma.unit.update({
      where: { id },
      data: { name, isDeleted },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to create Unit");
  }
};

export const listSchools = async () => {
  try {
    return await prisma.office.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch office");
  }
};

export const listCoursesBySchool = async (officeId: number) => {
  try {
    const office = await prisma.office.findUnique({
      where: { id: officeId },
      include: { unit: { select: { id: true, name: true } } },
    });
    if (!office) throw new Error("office not found");

    return office.unit;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch units for Office");
  }
};
