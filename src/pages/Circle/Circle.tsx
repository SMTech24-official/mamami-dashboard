import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiActivity,
  FiCalendar,
  FiEdit,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { LuLoaderCircle } from "react-icons/lu";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { z } from "zod";
import type { Circle, GetCirclesResponse } from "../../interfaces/AllTypes";
import { getAccessToken } from "../../utils/auth";

// Zod schema for form validation
const createCircleSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

type CreateCircleFormData = z.infer<typeof createCircleSchema>;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CircleComp = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingCircleId, setDeletingCircleId] = useState<string | null>(null);
  const [editingCircleId, setEditingCircleId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCircleFormData>({
    resolver: zodResolver(createCircleSchema),
  });

  // Get all circles on component mount
  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const res = await axios.get<GetCirclesResponse>(
          `${API_BASE_URL}/circles`,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          }
        );
        setCircles(res.data.data);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to fetch circles";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCircles();
  }, []);

  // Handle modal close
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      setEditingCircleId(null);
      reset();
    }, 300);
  };

  // Handle edit button click
  const handleEditClick = (circle: Circle) => {
    setEditingCircleId(circle.id);
    setValue("name", circle.name);
    setValue("description", circle.description);
    setIsModalOpen(true);
  };

  // Handle form submission (create or update)
  const onSubmit = async (data: CreateCircleFormData) => {
    try {
      if (editingCircleId) {
        // Update existing circle
        const response = await axios.patch(
          `${API_BASE_URL}/admin/circles/${editingCircleId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          }
        );

        setCircles(
          circles.map((circle) =>
            circle.id === editingCircleId ? response.data.data : circle
          )
        );
        toast.success("Circle updated successfully!");
      } else {
        // Create new circle
        const response = await axios.post(
          `${API_BASE_URL}/admin/circles`,
          data,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          }
        );
        setCircles((prevCircles) => [...prevCircles, response.data.data]);
        toast.success("Circle created successfully!");
      }
      handleCloseModal();
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : editingCircleId
        ? "Failed to update circle"
        : "Failed to create circle";
      toast.error(errorMessage);
    }
  };

  // Delete circle handler
  const handleDelete = async (circleId: string) => {
    const result = await Swal.fire({
      title: "Delete circle?",
      text: "This cannot be undone",
      width: 400,
      padding: "1rem",
      backdrop: "rgba(0,0,0,0.4)",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "text-sm",
        confirmButton:
          "px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 mr-2 hover:cursor-pointer",
        cancelButton:
          "px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 hover:cursor-pointer",
      },
    });

    if (result.isConfirmed) {
      try {
        setDeletingCircleId(circleId);
        await axios.delete(`${API_BASE_URL}/admin/circles/${circleId}`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
        setCircles(circles.filter((circle) => circle.id !== circleId));
        toast.success("Circle deleted successfully");
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to delete circle";
        toast.error(errorMessage);
      } finally {
        setDeletingCircleId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <PuffLoader color="#E46B71" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Circles</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-3 py-2 bg-[#E46B71] text-white rounded hover:bg-[#ff676e] hover:cursor-pointer transition-all duration-300"
            >
              <FiPlus className="mr-2" /> Create Circle
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiActivity className="mr-2" /> Status
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" /> Created
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {circles.map((circle) => (
                  <tr key={circle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {circle.name}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {circle.description}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          circle.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {circle.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(circle.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleEditClick(circle)}
                          className="text-gray-500 hover:text-blue-600 hover:cursor-pointer transition-all duration-300"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        {deletingCircleId === circle.id ? (
                          <div className="flex justify-center items-center">
                            <LuLoaderCircle
                              className="text-[#E46B71] animate-spin"
                              size={18}
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(circle.id)}
                            className="text-gray-500 hover:text-red-600 hover:cursor-pointer transition-all duration-300"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-white/20 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className={`bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-all duration-300 transform ${
              isClosing ? "animate-modal-hide" : "animate-modal-show"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCircleId ? "Edit Circle" : "Create New Circle"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E46B71] focus:border-transparent transition-all duration-300 ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter circle name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register("description")}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E46B71] focus:border-transparent resize-none transition-all duration-300 ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter circle description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#E46B71] border border-transparent rounded-md hover:bg-[#ff676e] focus:outline-none focus:ring-2 focus:ring-[#E46B71] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center hover:cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <LuLoaderCircle className="animate-spin mr-2" size={16} />
                      {editingCircleId ? "Updating..." : "Creating..."}
                    </>
                  ) : editingCircleId ? (
                    "Update Circle"
                  ) : (
                    "Create Circle"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CircleComp;
