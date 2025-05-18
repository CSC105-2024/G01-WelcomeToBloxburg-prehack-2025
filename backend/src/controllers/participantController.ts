import { type Context } from "hono";
import * as participantModel from "../models/participantModel.ts"


export const requestTrip = async ( c: Context ) => {
    try{
        const {tripId} = await c.req.json();
        const user = c.get('user');
        const userId = user.user.id;
        
        
        const tripParticipant = await participantModel.requestTrip(userId,tripId)
        return c.json({data : tripParticipant})
    }
    catch(err){
        return c.json({error : err},500)
    }
}

export const getAllTripParticipants = async ( c: Context ) => {
    try{
        
        const tripParticipant = await participantModel.getAllTripParticipants()
        return c.json({data : tripParticipant})
    }
    catch(err){
        return c.json({error : err},500)
    }
}

export const updateTripParticipant = async ( c: Context ) => {
    try{
        const body = await c.req.json();
        
        const userId = c.req.param("userId");
        const { tripId , ...data} = body
       
        
        
        const tripParticipant = await participantModel.updateParticipant(userId,tripId,data)
        return c.json({data : tripParticipant})
    }
    catch(err){
        return c.json({error : err},500)
    }
}

