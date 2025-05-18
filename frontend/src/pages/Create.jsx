import React from "react";
import MapComponent from "@/assets/components/MapComponent";

function Create() {
  return (
    <div className="font-nunito flex flex-col items-center mt-10 space-y-5 ">
      <h1 className="text-3xl">Create Trip</h1>
      <div className="h-fit">
        <MapComponent/>
      </div>

      
    </div>
  );
}

export default Create;
