import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoLocationOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import DropdownProfile from "../assets/components/DropdownProfile";
function Profile() {
  const userId = useParams();
  const id = userId.userId;
  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  let isCreator = false;
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState("");
  const [birth, setBirth] = useState(new Date());
  const [gender, setGender] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setShowSave(true);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImg(imageUrl);
      setSelectedFile(file);
    }
  };
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trip_profile");

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
  const handleInputClick = () => {
    inputRef.current.click();
  };
  const handleEditProfile = async () => {
    let imageUrl = "";
    if (previewImg && previewImg !== user.img) {
      imageUrl = await uploadImageToCloudinary(selectedFile);
      setImageUrl(imageUrl);
    }
    try {
      const age = birth;
      const data = {
        name: name,
        // age: age,
        img: imageUrl || user.img,
      };

      const res = await axios.patch(`http://localhost:4002/user/${id}`, data);
      console.log(res.data);
    } catch (err) {
      console.error("Upload failed", err);
      throw err;
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4002/user/${id}`);

        setUser(res.data.user);
        setTrip(res.data.user.tripParticipants);
        setName(res.data.user.name);
        setPreviewImg(res.data.user.img);
        setGender(res.data.user.gender);
      } catch (err) {
        console.log("Error", err);
        throw Error;
      }
    };
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
    fetchCurrentUser();
    fetchUser();
  }, [userId]);

  if (currentUser.id === id) isCreator = true;
  if (!user || !currentUser || !trip) return <>Loading...</>;
  return (
    <div>
      <div className="relative h-[50vh] w-full flex justify-center font-nunito">
        <div className="w-full h-[25vh] bg-amber-50"></div>
        <div className="absolute w-3/4 h-[25vh] border-1 border-black top-[12vh] z-50 bg-white flex items-center justify-between p-18">
          <div className=" flex items-center ">
            <img
              src={previewImg}
              alt="Profile"
              className="w-20 h-35 -ml-15 md:ml-1 md:w-40 md:h-40 object-cover rounded-full  border-1 border-black"
            />

            <div className="ml-10 -mt-20 mr-4 md:space-y-4 md:p-4">
              <h1 className="text-xl md:text-2xl flex items-center">
                {user.name}
                {isCreator && (
                  <FaEdit
                    className="ml-4 duration-300 hover:bg-gray-200 p-1 text-3xl rounded-sm cursor-pointer hover:scale-110"
                    onClick={() => setDialogOpen(!dialogOpen)}
                  />
                )}
              </h1>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px] ">
                  <DialogHeader>
                    <DialogTitle
                      className={"flex justify-center text-2xl font-bold"}
                    >
                      Your Profile
                    </DialogTitle>
                    <DialogDescription className={"text-center"}>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col justify-center items-center">
                    <img
                      src={previewImg}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-full cursor-pointer border-1 border-black"
                      onClick={handleInputClick}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={inputRef}
                    />
                    <div>
                      <p>Name</p>
                      <input
                        type="text"
                        name=""
                        id=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <button type="submit" onClick={handleEditProfile}>
                      Save changes
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <h1>{user.gender}</h1>
            </div>
          </div>
          <div className="flex mt-10 items-center flex-col md:justify-center space-y-2">
            <h1 className="mt-20 -ml-5 text-sm md:text-2xl">Total Contributions</h1>
            <h1 className="text-sm -ml-8 md:text-2xl">{user.tripParticipants.length}</h1>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-20">
          {trip.map((value, index) => {
            console.log(value);

            return (
              <div key={index}>
                <div
                  key={index}
                  className="border rounded-md shadow-sm bg-white overflow-hidden"
                >
                  <div className="h-40 bg-gray-700 flex items-center justify-center relative">

                    <DropdownProfile id={value.tripId} />
                    {value.trip.img ? (
                      <img
                        src={value.trip.img}
                        alt={value.trip.tripName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white font-semibold">No Image</div>
                    )}
                  </div>

                  <div className="p-6 space-y-2">
                    <span className="relative inline-block group">
                      <span
                        className="group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left after:scale-x-0 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-gray-400 text-lg md:text-2xl font-bold cursor-pointer"
                        onClick={() =>
                          (window.location.href = `/trip/${value.tripId}`)
                        }
                      >
                        {value.trip.tripName}
                      </span>
                    </span>
                    <p className="text-sm text-myPrimary flex flex-col space-y-1 md:space-y-3">
                      <span className="w-full h-auto flex items-start">
                        <IoLocationOutline className="mr-2 text-lg" />
                        {value.trip.locationName.length > 30
                          ? value.trip.locationName.substring(0, 30) + "..."
                          : value.trip.locationName}
                        ,
                      </span>
                      <span className="text-black flex items-center">
                        <FaRegCalendarAlt className="mr-2 text-lg" />
                        {format(value.trip.dateStart, "PPP")} - {format(value.trip.dateEnd, "PPP")}
                      </span>
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={value.trip.createdBy.img}
                          alt="creator"
                          className="w-6 h-6 rounded-full border cursor-pointer"
                          onClick={() =>
                            (window.location.href = `/profile/${value.trip.createdById}`)
                          }
                        />
                        <p className="text-xs md:text-sm text-gray-600 mr-2">
                          Created by{" "}
                          <span
                            className="duration-300 hover:text-black cursor-pointer"
                            onClick={() =>
                              (window.location.href = `/profile/${value.trip.createdById}`)
                            }
                          >
                            {value.trip.createdBy.name}
                          </span>
                        </p>
                      </div>
                      <button
                        className="bg-myPrimary text-white text-sm px-4 py-2 font-bold rounded hover:bg-[#02569E] transition"
                        onClick={() =>
                          (window.location.href = `/trip/${value.tripId}`)
                        }
                      >
                        View
                      </button>
                    </div>
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

export default Profile;