import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiFilter } from "react-icons/fi";

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

  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);

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

  const handleResetFilters = () => {
    setLocationFilter("");
    setStartDateFilter(null);
    setEndDateFilter(null);
  };

  if (!trip) return <>Loading...</>;

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
      {/* Mobile Filter */}
      <div className="lg:hidden mt-9 px-4">
        <div className="flex justify-center w-full">
          <input
            type="text"
            placeholder="Search by location or trip name"
            className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />

          <Dialog open={isMobileDialogOpen} onOpenChange={setIsMobileDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="bg-myPrimary text-white px-4 py-2 rounded-md hover:bg-[#02569E] transition flex justify-center items-center ">
                <FiFilter className="text-lg" />
                <span className="sr-only">More Filter</span>
              </button>

            </DialogTrigger>

            <DialogContent className="sm:max-w-[90%] sm:max-h-[80vh] md:max-w-[50%] lg:max-w-[30%]">
              <DialogHeader>
                <DialogTitle>Filter by Date</DialogTitle>
                <DialogDescription>Select a start and end date</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 justify-center items-center w-full">
                <div>
                  <p className="font-medium mb-1">From</p>
                  <DatePicker
                    selected={startDateFilter}
                    onChange={(date) => setStartDateFilter(date)}
                    selectsStart
                    startDate={startDateFilter}
                    endDate={endDateFilter}
                    placeholderText="Start Date"
                    dateFormat="dd/MM/yyyy"
                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    maxDate={endDateFilter}
                    isClearable
                  />
                </div>

                <div>
                  <p className="font-medium mb-1">To</p>
                  <DatePicker
                    selected={endDateFilter}
                    onChange={(date) => setEndDateFilter(date)}
                    selectsEnd
                    startDate={startDateFilter}
                    endDate={endDateFilter}
                    placeholderText="End Date"
                    dateFormat="dd/MM/yyyy"
                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    minDate={startDateFilter}
                    isClearable
                  />
                </div>
              </div>

              <DialogFooter className="mt-4 flex justify-between">
                <button
                  className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
                  onClick={() => {
                    handleResetFilters();
                    setIsMobileDialogOpen(false);
                  }}
                >
                  Reset
                </button>
                <button
                  className="bg-myPrimary text-white px-4 py-2 rounded hover:bg-[#02569E]"
                  onClick={() => setIsMobileDialogOpen(false)}
                >
                  Apply
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="hidden lg:inline">
        <div className="bg-myPrimary p-20">
          <div className="flex justify-center items-center ">
            <h1 className="text-4xl font-semibold text-white -ml-230">Plan Your Trip</h1>
          </div>
          <div className="flex justify-center items-center mt-4 -ml-215">
            <p className="text-xl font-semibold text-white">Find friends along your journey</p>
          </div>
          <div className="bg-white rounded-4xl p-20 mx-130 mt-5 ">
            <div className="flex justify-center items-center space-x-4 -mt-10">
              <div className="relative mt-10">
                <p className="text-2xl font-semibold -mt-7">Search</p>
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
                <DatePicker
                  selected={startDateFilter}
                  onChange={(date) => setStartDateFilter(date)}
                  selectsStart
                  startDate={startDateFilter}
                  endDate={endDateFilter}
                  placeholderText="Start Date"
                  dateFormat="dd/MM/yyyy"
                  className="border border-gray-300 rounded-md px-4 py-2 w-32 cursor-pointer"
                  maxDate={endDateFilter}
                  isClearable
                />
              </div>

              <div className="relative mt-10">
                <p className="text-lg font-semibold -mt-7">To</p>
                <DatePicker
                  selected={endDateFilter}
                  onChange={(date) => setEndDateFilter(date)}
                  selectsEnd
                  startDate={startDateFilter}
                  endDate={endDateFilter}
                  placeholderText="End Date"
                  dateFormat="dd/MM/yyyy"
                  className="border border-gray-300 rounded-md px-4 py-2 w-32 cursor-pointer"
                  minDate={startDateFilter}
                  isClearable
                />
              </div>
              <button
                className="bg-white border border-blue-500 text-black px-4 py-2 rounded-md mt-10 hover:bg-myPrimary transition"
                onClick={handleResetFilters}
              >
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
                    {format(new Date(value.dateStart), "PPP")} - {format(new Date(value.dateEnd), "PPP")}
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
