import express from "express";
import {
  createDocRequest,
  createDocument,
  fetchDocuments,
  fetchDocRequestDetails,
  fetchDocRequestFields,
  fetchDocRequests,
  login,
  downloadDocument,
  getOfficers,
  assignOfficer,
} from "../controllers/reader.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

//unprotected
router.post("/login", login);

//protected
// router.use(verifyReader);

//GET

router.get("/:id/docRequests", fetchDocRequests);

router.get("/:id/docRequests/:reqId", fetchDocRequestDetails);

router.get("/:id/docRequests/:reqId/fields", fetchDocRequestFields);

router.get("/:id/docRequests/:reqId/documents", fetchDocuments);

router.get(
  "/:id/docRequests/:reqId/documents/:docId/download",
  downloadDocument
);

router.get("/:id/assignableOfficers", getOfficers);

//POST
router.post("/createDocRequest", upload.single("template"), createDocRequest);
router.post("/:id/docRequests/:reqId/documents", createDocument);

//PUT
router.put(
  "/:id/docRequests/:reqId/documents/:docId/assignOfficer",
  assignOfficer
);

export default router;
