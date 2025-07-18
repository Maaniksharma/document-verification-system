import express from "express";
import {
  Login,
  createCourt,
  createMember,
  fetchAdminStats,
  fetchCourtDetails,
  fetchCourtsPages,
  fetchOfficerPages,
  fetchReaderPages,
} from "../controllers/admin.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

//unprotected
router.post("/login", Login);

//protected
router.use(verifyAdmin);

//GET
router.get("/stats", fetchAdminStats);

router.get("/courts", fetchCourtsPages);

router.get("/:id/members/readers", fetchReaderPages);

router.get("/:id/members/officers", fetchOfficerPages);

router.get("/courts/:id", fetchCourtDetails);

//POST

router.post("/createCourt", createCourt);

router.post("/createmember", createMember);

export default router;
