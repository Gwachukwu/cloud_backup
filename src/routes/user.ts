import {signUp} from '../controllers/user'
import express from "express";

const router = express.Router();

router.post("/",signUp);
