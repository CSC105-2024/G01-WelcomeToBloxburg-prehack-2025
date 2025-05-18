import { db } from "../index.ts";
import {
  TripStatus,
  ParticipantRole,
  ParticipantStatus,
} from "../generated/prisma/index.js";

export const getAllTripParticipants = async () => {
  const tripParticipants = await db.tripParticipant.findMany();
  return tripParticipants;
};

export const requestTrip = async (userId: string, tripId: string) => {
  const participant = db.tripParticipant.create({
    data: {
      user: { connect: { id: userId } },
      trip: { connect: { id: tripId } },
      role: "REQUESTING",
      status: "PENDING",
    },
  });
  return participant;
};

export const updateParticipant = async (
  userId: string,
  tripId: string,
  data: {
    role?: ParticipantRole;
    status?: ParticipantStatus;
    creatorApproved?: boolean;
    userConfirmed?: boolean;
  }
) => {
  console.log(data);

  try {
    const exist = await db.tripParticipant.findUnique({
      where: {
        userId_tripId: {
          userId,
          tripId,
        },
      },
    });
    if (!exist) {
      console.log("❌ No participant found with this userId and tripId.");
    } else {
      console.log("✅ Participant found:", exist);
    }
    const participant = await db.tripParticipant.update({
      where: {
        userId_tripId: {
          userId,
          tripId,
        },
      },
      data,
    });

    const updated = await db.tripParticipant.findUnique({
      where: {
        userId_tripId: {
          userId,
          tripId,
        },
      },
    });

    if (updated?.creatorApproved && participant?.userConfirmed) {
      await db.tripParticipant.update({
        where: {
          userId_tripId: {
            userId,
            tripId,
          },
        },
        data: {
          role: "PARTICIPANT",
          status: "APPROVED",
        },
      });
    }
    return participant;
  } catch (err) {
    console.log(err);
    return;
  }
};
