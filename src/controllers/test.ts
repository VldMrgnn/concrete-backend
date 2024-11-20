
import express from "express";
const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).send({ status: "OK" });
});

router.post("/sync", (req, res) => {
    console.log("Received data for sync:", req.body);
    const { data } = req.body;
    console.log("Received data for sync:", data);
    res.status(200).send({ message: "Data received" });
    }
);

export default router;