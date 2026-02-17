import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUser,
  getBookingsByMovie,
  getBookingsByHallSlot,
  cancelBooking,
  updatePaymentStatus,
  getBookingHistory,
  getRevenueSummary,
  checkSeatAvailability
} from "../controllers/booking_controller";
import { verifyToken } from "../middleware/verify_token";

const bookingRouter = Router();

bookingRouter.post("/", verifyToken, createBooking);
bookingRouter.get("/", verifyToken, getAllBookings);
bookingRouter.get(
  "/history/:user_id",
   verifyToken,
  getBookingHistory
);
bookingRouter.get(
  "/user/:user_id",
   verifyToken,
  getBookingsByUser
);
bookingRouter.get(
  "/movie/:movie_id",
  getBookingsByMovie
);
bookingRouter.get(
  "/hall/:hall_id",
  getBookingsByHallSlot
);
bookingRouter.get(
  "/check-seats",
  checkSeatAvailability
);
bookingRouter.put(
  "/payment/:id",
  updatePaymentStatus
);
bookingRouter.put(
  "/cancel/:id",
   verifyToken,
  cancelBooking
);
bookingRouter.get(
  "/revenue",
  getRevenueSummary
);
bookingRouter.get("/:id", getBookingById);

export default bookingRouter;
