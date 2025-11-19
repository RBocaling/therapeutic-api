"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUnitByOffice = exports.listOffice = exports.updateUnit = exports.updateOffice = exports.createUnit = exports.createOffice = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createOffice = async (name) => {
    try {
        const office = await prisma_1.default.office?.findFirst({
            where: {
                name,
            },
        });
        if (office)
            throw new Error("office is already Exist");
        return await prisma_1.default.office.create({ data: { name } });
    }
    catch (error) {
        throw new Error(error.message || "Failed to create office");
    }
};
exports.createOffice = createOffice;
const createUnit = async (officeId, name) => {
    try {
        const office = await prisma_1.default.office.findUnique({ where: { id: officeId } });
        if (!office)
            throw new Error("Office not found");
        return await prisma_1.default.unit.create({
            data: { name, officeId },
        });
    }
    catch (error) {
        throw new Error(error.message || "Failed to create office");
    }
};
exports.createUnit = createUnit;
const updateOffice = async (id, name, isDeleted) => {
    try {
        return await prisma_1.default.office.update({
            where: { id },
            data: { name, isDeleted },
        });
    }
    catch (error) {
        throw new Error(error.message || "Failed to create Office");
    }
};
exports.updateOffice = updateOffice;
const updateUnit = async (id, name, isDeleted) => {
    try {
        return await prisma_1.default.unit.update({
            where: { id },
            data: { name, isDeleted },
        });
    }
    catch (error) {
        throw new Error(error.message || "Failed to create Unit");
    }
};
exports.updateUnit = updateUnit;
const listOffice = async () => {
    try {
        return await prisma_1.default.office.findMany({
            where: { isDeleted: false },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
    }
    catch (error) {
        throw new Error(error.message || "Failed to fetch office");
    }
};
exports.listOffice = listOffice;
const listUnitByOffice = async (officeId) => {
    try {
        const office = await prisma_1.default.office.findUnique({
            where: { id: officeId, isDeleted: false },
            include: {
                unit: {
                    where: { isDeleted: false },
                    select: { id: true, name: true },
                },
            },
        });
        if (!office)
            throw new Error("office not found");
        return office.unit;
    }
    catch (error) {
        throw new Error(error.message || "Failed to fetch units for Office");
    }
};
exports.listUnitByOffice = listUnitByOffice;
