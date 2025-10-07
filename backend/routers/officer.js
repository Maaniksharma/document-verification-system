import express from "express";
import upload from "../middlewares/multer.js";
import {
  createSignature,
  fetchAssignedDocRequestDetails,
  fetchAssignedDocuments,
  getAssignedDocRequests,
  getSignatures,
  login,
} from "../controllers/officers.js";

const router = express.Router();

//unprotected
router.post("/login", login);

//protected
// router.use(verifyReader);

//GET
router.get("/:id/signatures", getSignatures);
router.get("/:id/assignedDocRequests", getAssignedDocRequests);
router.get("/:id/assignedDocRequests/:reqId", fetchAssignedDocRequestDetails);
router.get("/:id/assignedDocRequests/:reqId/documents", fetchAssignedDocuments);
//POST
router.post(
  "/:id/createSignature",
  upload.single("signature"),
  createSignature
);

export default router;
