import { Router } from "express";

const router = Router();

router.get("/example", (req, res) => {
  res.json({
    message: "Example API route",
  });
});

export default router;
