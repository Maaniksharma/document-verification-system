import express from "express";

const router = express.Router();

router.use("/admin", (await import("./admin.js")).default);
router.use("/reader", (await import("./reader.js")).default);
router.use("/officer", (await import("./officer.js")).default);

export default router;
