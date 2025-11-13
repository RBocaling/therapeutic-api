import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import * as schoolController from "../controllers/school.controllers";
import * as officeController from "../controllers/office.controllers";

const router = Router();
// school
router.post("/add-school", schoolController.addSchool);
router.post("/add-course", schoolController.addCourse);
router.get("/schools", schoolController.getSchools);
router.get(
  "/courses/:schoolId",
  authenticateUser,
  schoolController.getCoursesBySchool
);
router.put("/course/:id", schoolController.updateCourse);
router.put("/school/:id", schoolController.updateSchool);

// office/unit
router.post("/add-office", officeController.addOffice);
router.post("/add-unit", officeController.addUnit);
router.get("/office", officeController.getOffice);
router.get(
  "/units/:officeId",
  authenticateUser,
  officeController.getUnitByOffice
);
router.put("/office/:id", officeController.updateOffice);
router.put("/unit/:id", officeController.updateUnit);

export default router;
