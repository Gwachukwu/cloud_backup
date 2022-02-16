import {signUp} from '../controllers/admin'
import express from "express";

const router = express.Router();

router.post("/",signUp);
