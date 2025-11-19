"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = void 0;
const report_services_1 = require("../services/report.services");
const getReports = async (req, res) => {
    try {
        const couselorId = Number(req?.user?.id);
        const response = await (0, report_services_1.getReportOverview)(couselorId);
        res.status(201).json(response);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getReports = getReports;
