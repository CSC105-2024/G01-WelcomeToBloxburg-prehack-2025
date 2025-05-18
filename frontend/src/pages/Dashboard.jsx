import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
function Dashboard() {
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get("http://localhost:4002/trip");
        setTrip(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTrip();
  }, []);
  if (!trip) return <>Loading...</>;
  console.log(trip);

  return (
    <div className="font-nunito">
      <div className="m-4 px-[22vw]  items-center">
        <h1 className="text-2xl font-semibold mb-4">All Trips</h1>
        <hr className="mb-6 border-gray-300" />
      </div>
      <div className="px-6 py-8 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-y-10 gap-x-24 ">
          {trip.map((value, index) => {
            return (
              <div
                key={index}
                className="border rounded-md shadow-sm bg-white overflow-hidden w-sm"
              >
                <div className="h-40 bg-gray-700 flex items-center justify-center">
                  {value.img ? (
                    <img
                      src={value.img}
                      alt={value.tripName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white font-semibold">No Image</div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <span className="relative inline-block group">
                    <span className="group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:scale-x-0 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-gray-400 text-2xl font-bold cursor-pointer" onClick={() => window.location.href = `/trip/${value.id}`}>
                      {value.tripName}
                    </span>
                  </span>
                  <p className="text-sm text-myPrimary flex flex-col space-y-3">
                    <span className="w-full h-auto flex items-start">
                      <IoLocationOutline className="mr-2 text-lg"/>{value.locationName.length > 30
                        ? value.locationName.substring(0, 30) + "..."
                        : value.locationName}
                      ,
                    </span>
                    <span className="text-black flex">
                      <FaRegCalendarAlt className="mr-2 text-lg"/>
                      {" "}
                      {format(value.dateStart, "PPP")} -{" "}
                      {format(value.dateEnd, "PPP")}
                    </span>
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={value.createdBy.img}
                        alt="creator"
                        className="w-6 h-6 rounded-full border cursor-pointer"
                        onClick={() => window.location.href = `/profile/${value.createdById}`}
                      />
                      <p className="text-sm text-gray-600">
                        Created by <span className="duration-300 hover:text-black cursor-pointer" onClick={() => window.location.href = `/profile/${value.createdById}`}>{value.createdBy.name}</span>
                      </p>
                    </div>
                    <button
                      className="bg-myPrimary text-white text-sm px-6 py-2 font-bold rounded hover:bg-[#02569E] transition"
                      onClick={() =>
                        (window.location.href = `/trip/${value.id}`)
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
