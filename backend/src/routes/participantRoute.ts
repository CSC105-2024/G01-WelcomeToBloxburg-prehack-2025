import { Hono } from "hono";
import { requestTrip,getAllTripParticipants,updateTripParticipant } from "../controllers/participantController.ts";
import { authUser } from "../middlewares/authUser.ts";
const router = new Hono();

router.get("/",getAllTripParticipants);
router.post("/",authUser,requestTrip);
router.patch("/:userId",updateTripParticipant)

export default router