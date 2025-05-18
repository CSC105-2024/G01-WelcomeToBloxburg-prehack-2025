import { type Context } from "hono";
import * as tripModel from "../models/tripModel.ts";

export const getAllTrips = async (c: Context) => {
  try {
    const trips = await tripModel.getAllTrips();
    return c.json({ data: trips });
  } catch (err) {
    return c.json({ error: err }, 500);
  }
};
export const getOneTrip = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const trip = await tripModel.getOneTrip(id);
    if (!trip) return c.json({ err: "Trip not found" }, 404);
    return c.json({ data: trip });
  } catch (err) {
    return c.json({ error: err }, 500);
  }
};

export const createTrip = async (c: Context) => {
  try {
    const body = await c.req.json();
    const user = c.get("user");
    

    const trip = await tripModel.createTrip(body, user.user.id);
    return c.json({ data: trip });
  } catch (err) {
    return c.json({ error: err }, 500);
  }
};

export const updateTrip = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const trip = await tripModel.updateTrip(id, body);
    return c.json({ data: trip });
  } catch (err) {
    return c.json({ error: err }, 500);
  }
};

export const deleteTrip = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const trip = await tripModel.deleteTrip(id);
    return c.json({ data: trip });
  } catch (err) {
    return c.json({ error: err }, 500);
  }
};
