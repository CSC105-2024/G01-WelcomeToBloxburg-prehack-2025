import { Hono } from "hono";
import { getAllUsers,updateUser,createUser,getOneUser,loginUser,logoutUser ,getProfile} from "../controllers/userController.ts";
import { authUser } from "../middlewares/authUser.ts";
const router = new Hono();
router.get("/",getAllUsers);
router.get("/:id",getOneUser);
router.patch("/:id",updateUser);
router.post("/",createUser);
router.post("/api/login",loginUser);
router.post("/api/logout",logoutUser);
router.get("/api/profile",authUser,getProfile)


export default router