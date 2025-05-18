import { db } from "../index.ts";
import {
  TripStatus,
  ParticipantRole,
  ParticipantStatus,
} from "../generated/prisma/index.js";

export const getAllTrips = async () => {
  const trips = await db.trip.findMany({

    include: {
      participants: true,
      createdBy : true,
    },
  });
  return trips;
};

export const createTrip = async (
  data: {
    tripName: string;
    locationName: string;
    img?: string;
    tripDetail: string;
    dateStart: string | Date;
    dateEnd: string | Date;
    latitude: number;
    longtitude: number;
  },
  userId: string
) => {
  try {
    console.log(userId);
    
    const trip = await db.trip.create({
      data: {
        tripName: data.tripName,
        locationName: data.locationName,
        img: data.img,
        tripDetail: data.tripDetail,
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
        latitude: data.latitude,
        longtitude: data.longtitude,
        createdBy: { connect: { id: userId } },
        participants: {
          create: {
            user: { connect: { id: userId } },
            role: "CREATOR",
            status: "APPROVED",
          },
        },
      },
    });
    return trip;
  } catch (err) {
    console.log(err);
    return;
  }
};

export const updateTrip = async (
  id: string,
  data: {
    tripName?: string;
    locationName?: string;
    img?: string;
    tripDetail?: string;
    dateStart?: Date;
    dateEnd?: Date;
    status?: TripStatus;
    latitude?: number;
    longtitude?: number;
  }
) => {
  const trip = await db.trip.update({
    where: {
      id: id,
    },
    data: {
      tripName: data.tripName,
      locationName: data.locationName,
      img: data.img,
      tripDetail: data.tripDetail,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      status: data.status,
      latitude: data.latitude,
      longtitude: data.longtitude,
    },
  });
  return trip;
};

export const deleteTrip = async (tripId: string) => {
  const deletedTrip = await db.trip.delete({
    where: {
      id: tripId,
    },
  });
  return deletedTrip;
};

export const getOneTrip = async (tripId: string) => {
  const deletedTrip = await db.trip.findUnique({
    where: {
      id: tripId,
    },
    include: {
      participants: {
        include : {user : true}
      },
      createdBy : true,
    },
  });
  return deletedTrip;
};
