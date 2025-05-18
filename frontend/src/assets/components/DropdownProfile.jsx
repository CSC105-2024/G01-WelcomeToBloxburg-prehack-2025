import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { BsThreeDots } from "react-icons/bs";
import {
  // import dropdown
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  // import dialong
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function DropdownProfile({ id }) {
  const [deleteLoading, setDeleteLoading] = useState(true);
  const [editAlert, setEditAlert] = useState(false);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [deleteAlert, setDeleteAlert] = useState(false);
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:4002/trip/${id}`);
      setDeleteLoading(!deleteLoading);
      await wait(2000);
      setDeleteAlert(false);
      console.log(res);
      toast.success("Trip Deleted Successfully!");
      await wait(1500);
      window.location.reload();
    } catch (err) {
      console.err(err);
    }
  };
  const toEditPage = () => {
    window.location.href = `/edit/${id}`;
  };
  const toBlogPage = () => {
    window.location.href = `/trip/${id}`;
  };
  const handleEditClick = () => {};
  const handleEditClose = () => {
    setEditAlert(false);
  };
  const handleDeleteClick = () => {
    setDeleteAlert(true);
    console.log("HELLO" + editAlert);
  };
  const handleDeleteClose = () => {
    setDeleteAlert(false);
  };
  return (
    <DropdownMenu>
      <Toaster location={"top-right"} />
      <DropdownMenuTrigger asChild>
        <BsThreeDots className="p-px text-3xl bg-gray-200 absolute border-2 border-gray-300 rounded-lg hover:bg-gray-300 duration-300 cursor-pointer top-3 right-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Blog Details</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toBlogPage}>
          View
          <DropdownMenuShortcut>⇧⌘V</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={toEditPage}>
          Edit
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDeleteClick}>
          Delete
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
      {deleteAlert && (
        <AlertDialog open={deleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you certain of your decision?
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p className="italic">
                  “This is a moment of no return — the blog you crafted will be
                  altered, like thoughts cast into the river of time. What’s
                  done cannot be undone.”
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDeleteClose}>
                Cancel
              </AlertDialogCancel>

              {deleteLoading ? (
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              ) : (
                <AlertDialogAction
                  onClick={console.log("HELOO")}
                  className="bg-red-400 cursor-default hover:bg-red-400"
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  <p>...</p>
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </DropdownMenu>
  );
}

export default DropdownProfile;
