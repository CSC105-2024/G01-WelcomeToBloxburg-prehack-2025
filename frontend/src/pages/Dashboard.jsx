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
  const [locationFilter, setLocationFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

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

  const filteredTrips = trip.filter((value) => {
    const locationMatch =
      !locationFilter ||
      value.locationName.toLowerCase().includes(locationFilter.toLowerCase()) ||
      value.tripName.toLowerCase().includes(locationFilter.toLowerCase());

    const tripStartDate = new Date(value.dateStart);
    const tripEndDate = new Date(value.dateEnd);

    const startDateMatch = !startDateFilter || tripEndDate >= startDateFilter;
    const endDateMatch = !endDateFilter || tripStartDate <= endDateFilter;

    return locationMatch && startDateMatch && endDateMatch;
  });

  return (
    <div className="font-nunito">
      <div className="lg:hidden mt-9">
      <div className="flex justify-center">
        <p className="text-xl p-2 -ml-8 md:text-2xl md:p-2 md:-ml-20">Filter Trips</p>
        <input
          type="text"
          placeholder="Search by location or trip name"
          className="border border-gray-300 rounded-md px-4 py-2 w-65"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />        
        </div>
        </div>
      <div className="hidden lg:inline">
      <div className="bg-blue-400 p-20">
      <div className="flex justify-center items-center ">
        <h1 className="text-4xl font-semibold text-white mr-168">Plan Your Trip</h1>
      </div>
      <div className="flex justify-center items-center mt-4 mr-155">
        <p className="text-xl font-semibold text-white">Find friends along your journey</p>
      </div>
      <div className="bg-white rounded-4xl p-20 mx-100 mt-5">
      <div className="flex justify-center items-center space-x-4 -mt-10">
        <div className="relative mt-10">
        <p className="text-2xl font-semibold -mt-7">Filter Trip</p>
        <input
          type="text"
          placeholder="Location or Trip name"
          className="border border-gray-300 rounded-md px-4 py-2"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        </div>
        <div className="relative mt-10">
          <p className="text-lg font-semibold -mt-7">From</p>
          <input
            type="text"
            placeholder="Start Date"
            className="border border-gray-300 rounded-md px-4 py-2 w-32 cursor-pointer"
            value={startDateFilter ? format(startDateFilter, 'dd/MM/yyyy') : ''}
            readOnly
            onClick={() => setIsStartDateOpen(!isStartDateOpen)}
          />
          {isStartDateOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-md z-10 p-4">
              {/* Implement your own basic calendar UI here using date-fns */}
              <p>Basic Calendar for Start Date (using date-fns)</p>
            </div>
          )}
        </div>
        <div className="relative mt-10">
          <p className="text-lg font-semibold -mt-7">To</p>
          <input
            type="text"
            placeholder="End Date"
            className="border border-gray-300 rounded-md px-4 py-2 w-32 cursor-pointer"
            value={endDateFilter ? format(endDateFilter, 'dd/MM/yyyy') : ''}
            readOnly
            onClick={() => setIsEndDateOpen(!isEndDateOpen)}
          />
          {isEndDateOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-md z-10 p-4">
              {/* Implement your own basic calendar UI here using date-fns */}
              <p>Basic Calendar for End Date (using date-fns)</p>
            </div>
          )}
        </div>
        <button className="bg-myPrimary text-white px-4 py-2 rounded-md mt-10 hover:bg-[#02569E] transition">
          Search
        </button>
        <button className="bg-myPrimary text-white px-4 py-2 rounded-md mt-10 hover:bg-[#02569E] transition">
          Reset Filter
        </button>
      </div>
      </div>
          </div>
          </div>
      <div className="container mx-auto px-4 md:px-8 lg:px-16 mt-8 md:mt-12">
        <h1 className="text-xl md:text-2xl font-semibold mb-4">All Trips</h1>
        <hr className="mb-6 border-gray-300" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {filteredTrips.map((value, index) => (
            <div
              key={index}
              className="border rounded-md shadow-sm bg-white overflow-hidden"
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
                  <span
                    className="group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:scale-x-0 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-gray-400 text-lg md:text-2xl font-bold cursor-pointer"
                    onClick={() => (window.location.href = `/trip/${value.id}`)}
                  >
                    {value.tripName}
                  </span>
                </span>
                <p className="text-sm text-myPrimary flex flex-col space-y-1 md:space-y-3">
                  <span className="w-full h-auto flex items-start">
                    <IoLocationOutline className="mr-2 text-lg" />
                    {value.locationName.length > 30
                      ? value.locationName.substring(0, 30) + "..."
                      : value.locationName}
                    ,
                  </span>
                  <span className="text-black flex items-center">
                    <FaRegCalendarAlt className="mr-2 text-lg" />
                    {format(value.dateStart, "PPP")} - {format(value.dateEnd, "PPP")}
                  </span>
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={value.createdBy.img}
                      alt="creator"
                      className="w-6 h-6 rounded-full border cursor-pointer"
                      onClick={() => (window.location.href = `/profile/${value.createdById}`)}
                    />
                    <p className="text-xs md:text-sm text-gray-600">
                      Created by{" "}
                      <span
                        className="duration-300 hover:text-black cursor-pointer"
                        onClick={() => (window.location.href = `/profile/${value.createdById}`)}
                      >
                        {value.createdBy.name}
                      </span>
                    </p>
                  </div>
                  <button
                    className="bg-myPrimary text-white text-sm px-4 py-2 font-bold rounded hover:bg-[#02569E] transition"
                    onClick={() => (window.location.href = `/trip/${value.id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;