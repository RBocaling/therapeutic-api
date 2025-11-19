"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleIntervention = exports.getCaseIntervention = exports.createCaseIntervention = exports.updateCaseStatus = exports.getCaseById = exports.getAllCases = exports.createCase = void 0;
// src/services/case.services.ts
const prisma_1 = __importDefault(require("../config/prisma"));
const createCase = async (userId, data) => {
    return await prisma_1.default.$transaction(async (tx) => {
        const created = await tx.caseManagement.create({
            data: {
                userId,
                counselorId: data.counselorId,
                category: data.category,
                title: data.title,
                description: data.description,
                intervention: data?.intervention,
            },
        });
        if (data.evidenceUrls?.length) {
            await tx.caseEvidence.createMany({
                data: data.evidenceUrls.map((url) => ({
                    caseId: created.id,
                    imageUrl: url,
                })),
            });
        }
        return created;
    });
};
exports.createCase = createCase;
const getAllCases = async () => {
    return prisma_1.default.caseManagement.findMany({
        include: {
            evidences: true,
            user: { select: { id: true, firstName: true, lastName: true } },
            counselor: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllCases = getAllCases;
const getCaseById = async (caseId) => {
    return prisma_1.default.caseManagement.findUnique({
        where: { id: caseId },
        include: { evidences: true, user: true, counselor: true },
    });
};
exports.getCaseById = getCaseById;
const updateCaseStatus = async (caseId, status) => {
    return prisma_1.default.caseManagement.update({
        where: { id: caseId },
        data: { status },
    });
};
exports.updateCaseStatus = updateCaseStatus;
const createCaseIntervention = async (item) => {
    const result = await prisma_1.default.caseIntervention.upsert({
        where: { intervention: item.intervention },
        update: {
            intervention: item.intervention,
        },
        create: {
            intervention: item.intervention,
        },
    });
    return result;
};
exports.createCaseIntervention = createCaseIntervention;
const getCaseIntervention = async () => {
    return await prisma_1.default.caseIntervention.findMany();
};
exports.getCaseIntervention = getCaseIntervention;
const deleteSingleIntervention = async (id) => {
    return prisma_1.default.caseIntervention.delete({
        where: { id },
    });
};
exports.deleteSingleIntervention = deleteSingleIntervention;
