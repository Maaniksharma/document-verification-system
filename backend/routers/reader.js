import express from "express";
import {
  createDocRequest,
  createDocument,
  fetchDocRequestDetails,
  fetchDocRequestFields,
  fetchDocRequests,
  login,
} from "../controllers/reader.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

//unprotected
router.post("/login", login);

router.post("/createDocRequest", upload.single("template"), createDocRequest);

router.get("/:id/docRequests", fetchDocRequests);

router.get("/:id/docRequests/:reqId", fetchDocRequestDetails);

router.get("/:id/docRequests/:reqId/fields", fetchDocRequestFields);
router.post("/:id/docRequests/:reqId/documents", createDocument);

//protected
// router.use(verifyAdmin);

//GET

//POST

export default router;
