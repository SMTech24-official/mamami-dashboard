import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { getAccessToken } from "../utils/auth";

export const DeleteButtonWithModal = ({ userId }: { userId: string }) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleDelete = async () => {
    try {
      // Perform delete API call
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      toast.success("User deleted successfully");
      setShowModal(false);
      // Refresh data or update state as needed
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-gray-500 hover:text-red-600 transition-colors"
        title="Delete"
      >
        <FiTrash2 size={18} />
      </button>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
