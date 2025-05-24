// components/Map.js
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import axios from "axios";
import {
  IoSettingsOutline,
  IoLocationOutline,
  IoImageOutline,
  IoSaveOutline,
} from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useParams } from "react-router-dom";
import { format, set } from "date-fns";
import { FcCheckmark } from "react-icons/fc";
import { RxCross1 } from "react-icons/rx";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VtbWllciIsImEiOiJjbWFpMWVmZDUwZ25pMm1zN2phd3NoOGx6In0.kPnfIx6921tXR28r5K-GSQ";
export default function MapComponentEdit() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [place, setPlace] = useState(
    "https://thailandawaits.com/wp-content/uploads/2022/12/Pattaya-Guide-City-Sign-1125x695.jpg"
  );
  const fileInputRef = useRef(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSave,setOpenSave] = useState(false);
  const markerRef = useRef(null);
  let creator;

  // Data Set
  const [tripName, setTripName] = useState("");
  const [location, setLocation] = useState("");
  const [img, setImg] = useState("");
  const [tripDetail, setTripDetail] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [previewImg, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState("Set Trip Image");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [participant, setParticipant] = useState(null);
  const tripId = useParams();
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trip_image");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/ddsmewouf/image/upload",
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Upload failed", err);
      throw err;
    }
  };
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    try {
      let cloudinaryImgUrl = "";
      if (file) {
        cloudinaryImgUrl = await uploadImageToCloudinary(file);
        setImageUrl(cloudinaryImgUrl);
      }

      const data = {
        tripName: tripName,
        locationName: location,
        img: imageUrl,
        tripDetail: tripDetail,
        dateStart: startDate,
        dateEnd: endDate,
        latitude: lat,
        longtitude: lng,
      };

      const res = await axios.patch(
        `http://localhost:4002/trip/${tripId.tripId}`,
        data,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (map.current) return; // initialize only once

    const fetchTrip = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4002/trip/${tripId.tripId}`
        );
        const trip = res.data.data;

        setTripName(trip.tripName);
        setLocation(trip.locationName);
        setImageUrl(trip.img);
        setPreviewImage(trip.img);
        setTripDetail(trip.tripDetail);
        setStartDate(trip.dateStart);
        setEndDate(trip.dateEnd);
        setLat(trip.latitude);
        setLng(trip.longtitude);
        setParticipant(trip.participants);

        const tripLat = trip.latitude;
        const tripLng = trip.longtitude;

        if (tripLat && tripLng && map.current) {
          map.current.setCenter([tripLng, tripLat]); // Center to trip location
          markerRef.current = new mapboxgl.Marker({ color: "red" })
            .setLngLat([tripLng, tripLat])
            .addTo(map.current);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrip();
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [100.5018, 13.7563], // Bangkok as example
      zoom: 10,
    });

    // Add geocoder search control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    });
    map.current.addControl(geocoder);

    // Add click handler to get lat/lng
    map.current.on("click", async (e) => {
      const lng = lng || e.lngLat.lng;
      const lat = lat || e.lngLat.lat;
      console.log("Clicked location:", lat, lng);
      setLat(lat);
      setLng(lng);

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker({ color: "red" })
          .setLngLat([lng, lat])
          .addTo(map.current);
      }

      const location = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      if (!location) throw new Error("Failed to fetch location");
      console.log(location.data.display_name);
      setLocation(location.data.display_name);
      const realPlace =
        location.data.address.province || location.data.address.city;

      const url = await axios.get(
        `https://api.unsplash.com/search/photos?query=${realPlace}&client_id=53-fPAip-7SLjWcDKcAKet2MyDSO8ZVXwX5Ud_9nKMg`
      );
      setPlace(url.data.results[0]);
      const realImg = url.data.results[0];
      if (realImg) {
        setPlace(realImg.urls.small);
        setPreviewImage(realImg.urls.small);
      }

      // You can now send lat/lng to your reverse geocode API

      return () => map.remove();
    });
  }, [tripId.tripId]);
  console.log(participant);

  return (
    <div>
      <div className="flex h-full ">
        <div className="space-x-4">
          <div
            className="relative w-[750px] h-[40vh] rounded-xl text-white font-semibold"
            style={{
              background: `linear-gradient(rgba(0,0,0,0.4) , rgba(0,0,0,0.5)) , url(${previewImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="absolute top-0 right-2 text-xl p-4 flex items-end space-x-4">
              <h2>
                {format(startDate, "PPP")} - {format(endDate, "PPP")}
              </h2>
              <IoSettingsOutline
                className="text-black p-2 text-4xl rounded-full bg-white duration-300 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpenEdit(!openEdit)}
              />
            </h3>
            <div className="absolute bottom-0 p-6 space-y-3">
              <h2
                className="text-3xl font-bold cursor-pointer"
                onClick={() => setOpenEdit(!openEdit)}
              >
                {tripName ? tripName : "Go to something"}
              </h2>

              <h3
                className="flex cursor-pointer "
                onClick={() => setOpenEdit(!openEdit)}
              >
                <IoLocationOutline className="mr-2 text-xl " />{" "}
                {location ? location : "Select location"}
              </h3>
            </div>
          </div>
          <textarea
            type="text"
            placeholder="What's this trip about?"
            className="w-full min-h-[100px]  rounded-xl cursor-pointer text-lg p-2"
            onClick={() => setOpenEdit(!openEdit)}
            value={tripDetail}
          />
          <hr />
          <div className="h-fit mr-4">
            <h1 className="text-2xl my-4">
              Participants <span>({participant?.length || 0})</span>
            </h1>
            <div className="border-1 w-full  min-h-20 h-auto max-h-[250px] overflow-y-auto rounded-lg space-y-2">
              {participant?.map((user) => (
                <div key={user.id}>
                  <div className=" shadow-md flex items-center p-4 rounded-xl justify-between px-20">
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

                      {(user.role !== "CREATOR" || user.role === "DENIED") &&
                        creator &&
                        user.status !== "APPROVED" && (
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

          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-[425px] font-nunito ">
              <DialogHeader>
                <DialogTitle className={"text-3xl font-bold"}>
                  Edit trip details
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-5">
                <div className="overflow-auto space-y-4">
                  <div>
                    <p className="font-semibold">Trip name</p>
                    <input
                      type="text"
                      className="p-3 w-full rounded-sm"
                      onChange={(e) => setTripName(e.target.value)}
                      value={tripName}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Destination</p>
                    <input
                      type="text"
                      className="p-3 w-full rounded-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Date</p>
                    <div className="flex justify-between">
                      <div>
                        From :{" "}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={
                                ("w-[240px] justify-start text-left font-normal",
                                !startDate && "text-muted-foreground")
                              }
                            >
                              {startDate ? (
                                format(startDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        To :{" "}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={
                                ("w-[240px] justify-start text-left font-normal",
                                !endDate && "text-muted-foreground")
                              }
                            >
                              {endDate ? (
                                format(endDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    <p className="font-semibold">Trip Image</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <IoImageOutline onClick={handleIconClick} />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <img src={previewImg} alt="" width={300} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <hr />
                </div>
                <div>
                  <p className="font-semibold">Description</p>
                  <textarea
                    className="p-3 w-full border-1 border-black rounded-sm"
                    value={tripDetail}
                    onChange={(e) => setTripDetail(e.target.value)}
                  />
                </div>
                <hr />
                <div className="flex justify-between">
                  <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                    <button
                      className="flex items-center text-red-500 duration-300 hover:bg-gray-200 p-2 rounded-xl"
                      onClick={() => setOpenDelete(!openDelete)}
                    >
                      <MdDeleteOutline className="text-xl mr-2" />
                      Delete
                    </button>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Delete trip?</DialogTitle>
                        <DialogDescription>
                          Are you sure? Deleting a trip will delete all items
                          and notes saved to it. Your trip cannot be retrieved
                          once it’s deleted.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className={"mt-10"}>
                        <button
                          className="border-gray-600 border-1 text-black px-6 py-2 rounded-full duration-300 hover:bg-gray-200 font-semibold "
                          onClick={() => setOpenDelete(!openDelete)}
                        >
                          Cancel
                        </button>
                        <button className="bg-red-500 border-1 text-white px-6 py-2 rounded-full duration-300 hover:bg-red-600 font-bold">
                          Delete
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={openSave} onOpenChange={setOpenSave}>
                    <button
                      className="flex items-center text-myPrimary duration-300 hover:bg-gray-200 p-2 rounded-xl"
                      onClick={() => setOpenSave(!openSave)}
                    >
                      <IoSaveOutline className="text-lg mr-2" />
                      Save Changes
                    </button>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Confirm Change?</DialogTitle>
                        <DialogDescription>
                          Doing so will save your changes and you cannot revert
                          back to previous version again. Click "Confirm" to
                          Save
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className={"mt-10"}>
                        <button
                          className="border-gray-600 border-1 text-black px-6 py-2 rounded-full duration-300 hover:bg-gray-200 font-semibold "
                          onClick={() => setOpenSave(!openSave)}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-green-500 border-1 text-white px-6 py-2 rounded-full duration-300 hover:bg-green-600 font-bold"
                          onClick={handleSubmit}
                        >
                          Confirm
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div
          ref={mapContainer}
          className="w-[350px] h-[800px] rounded-md shadow-md sticky top-0 bg-white"
        />
      </div>
      <div className="flex justify-center">
        <button
          className="duration-300 px-8 py-3 bg-myPrimary text-white font-bold rounded-2xl"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
