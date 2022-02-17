import {signUp,signIn} from '../controllers/admin'
import express from "express";

const router = express.Router();

router.post("/signup",signUp);
router.post("/signin",signIn);

export default router;