import { Hono } from "hono";
import { createTrip,getOneTrip,getAllTrips,updateTrip,deleteTrip } from "../controllers/tripController.ts";
import { authUser } from "../middlewares/authUser.ts";
const router = new Hono();

router.get("/",getAllTrips)
router.get("/:id",getOneTrip)
router.post("/",authUser,createTrip)
router.patch("/:id",updateTrip)
router.delete("/:id",deleteTrip)

export default router