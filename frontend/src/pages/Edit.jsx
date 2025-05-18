import React from "react";
import MapComponentEdit from "@/assets/components/MapComponentEdit";

function Edit() {
  return (
    <div className="font-nunito flex flex-col items-center mt-10 space-y-5 ">
      <h1 className="text-3xl">Create Trip</h1>
      <div className="h-fit">
        <MapComponentEdit />
      </div>
    </div>
  );
}

export default Edit;
