import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MapComponent from "../assets/components/MapComponent.jsx";
import { IoLocationOutline } from "react-icons/io5";
import { format } from "date-fns";
import axios from "axios";
import StaticMap from "../assets/components/StaticMap.jsx";
import { RxCross1 } from "react-icons/rx";
import { FcCheckmark } from "react-icons/fc";
function TripDetails() {
  const tripId = useParams();
  const [trip, setTrip] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  let participate = false;
  let creator = false;

  const updateParticipant = async (userId, code) => {
    try {
      let data = null;
      if (code === 0) {
         data = {
          tripId: tripId.tripId,
          status : "REJECTED"
        };
      }
      else {
        data = {
          tripId: tripId.tripId,
          creatorApproved : true,
          userConfirmed : true
        };
      }

      const res = await axios.patch(
        `http://localhost:4002/participant/${userId}`,
        data
      );
    } catch (err) {
      console.error(err);
    }
  };
  const requestTrip = async () => {
    try {
      const data = {
        tripId: tripId.tripId,
      };
      const res = await axios.post(`http://localhost:4002/participant`, data, {
        withCredentials: true,
      });
      console.log(res.data);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4002/user/api/profile`, {
          withCredentials: true,
        });

        setCurrentUser(res.data.user.user);
      } catch (err) {
        console.log("Error", err);
        throw Error;
      }
    };
    const fetchTripDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4002/trip/${tripId.tripId}`
        );
        console.log(res.data.data);
        setTrip(res.data.data);
        setParticipant(res.data.data.participants);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTripDetails();
    fetchCurrentUser();
  }, [tripId]);
  if (!trip || !participant || !currentUser) return <p>Loading....</p>;
  const userIds = participant?.map((p) => p.userId);
  if (userIds.includes(currentUser.id)) participate = true;
  if (trip.createdById === currentUser.id) creator = true;
  return (
    <div className="mx-100">
      <div className="flex justify-center mt-20">
        <div className="flex space-x-6 font-nunito ">
          <div>
            {/* Image Lucaton */}
            <div
              className="relative  w-full h-[40vh] rounded-xl text-white font-semibold"
              style={{
                background: `linear-gradient(rgba(0,0,0,0.4) , rgba(0,0,0,0.7)) , url(${trip.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="absolute top-0 right-2 text-xl p-4">
                {format(trip.dateStart, "PPP")} - {format(trip.dateEnd, "PPP")}
              </h3>
              <div className="absolute bottom-0 p-6 space-y-3">
                <h2 className="text-2xl font-bold">{trip.tripName}</h2>
                <h3 className="flex ">
                  <IoLocationOutline className="mr-2 text-xl" />{" "}
                  {trip.locationName}
                </h3>
              </div>
            </div>
            {/* Descirptpion */}
            <div className="min-w-[670px] mt-4 min-h-[150px]">
              <h3 className="font-bold">Description</h3>
              <p>{trip.tripDetail}</p>
            </div>

            {/* Creator */}
            <div className="flex items-end space-x-4">
              <div
                className="w-10 h-10 rounded-full border-1 cursor-pointer"
                onClick={() =>
                  (window.location.href = `/profile/${trip.createdById}`)
                }
                style={{
                  backgroundImage: `url(${trip.createdBy.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <p className="text-gray-500  font-light">
                Created by{" "}
                <span
                  className="cursor-pointer duration-300 hover:text-black"
                  onClick={() =>
                    (window.location.href = `/profile/${trip.createdById}`)
                  }
                >
                  {trip.createdBy.name}
                </span>
              </p>
            </div>
          </div>
          <StaticMap lat={trip.latitude} lng={trip.longtitude} />
        </div>
      </div>
      <hr className="my-10" />
      <div className="flex justify-center items-center my-10 space-x-30">
        {participate && (
          <button
            className="px-20 py-3 w-3xs text-2xl border-2 border-myPrimary rounded-2xl duration-300 hover:bg-myPrimary hover:text-white hover:border-white active:bg-[#02569E] shadow-lg"
            onClick={() => (window.location.href = `/chat/${tripId.tripId}`)}
          >
            Discuss
          </button>
        )}

        {!participate && (
          <button
            className="px-20 py-3 w-3xs text-2xl border-2    text-white bg-myPrimary rounded-2xl duration-300 hover:bg-[#02569E] active:bg-myPrimary shadow-lg"
            onClick={requestTrip}
          >
            Join
          </button>
        )}
      </div>
      <h2 className="mx-5 text-2xl font-semibold my-2">
        Participants <span>({trip.participants.length})</span>
      </h2>
      <hr />
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {trip.participants.map((user, index) => (
          <div key={index}>
            <div className="mx-5 shadow-lg flex items-center p-4 rounded-xl justify-between px-20">
              <div className="flex items-center space-x-8">
                <div
                  className="w-10 h-10 rounded-full border-1"
                  style={{
                    backgroundImage: `url(${user.user.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p>
                  {user.user.name} <span>({user.role})</span>
                </p>
              </div>
              <div className="relative flex items-center space-x-2 ">
                <h3>{user.status}</h3>

                {(user.role !== "CREATOR" || user.role === "DENIED" ) &&
                  creator && (user.status !== "APPROVED") &&(

                    
                    <FcCheckmark
                      className="text-3xl rounded-lg p-1 hover:bg-gray-200 cursor-pointer duration-300 absolute -right-9 -top-1"
                      onClick={() =>
                        updateParticipant(user.userId, {
                          data: {
                            creatorApproved: true,
                            userConfirmed: true,
                          },
                        })
                      }
                    />
                  )}
                {(user.role !== "CREATOR" || user.role === "DENIED") &&
                  creator && (
                    <RxCross1
                      className="text-red-500 text-3xl rounded-lg p-1 hover:bg-gray-200 cursor-pointer duration-300 absolute -right-14 -top-1"
                      onClick={() => updateParticipant(user.userId, 0)}
                    />
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripDetails;
