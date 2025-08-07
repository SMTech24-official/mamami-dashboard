import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiFrown,
  FiMail,
  FiMeh,
  FiShield,
  FiSmile,
  FiTrash2,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { LuLoaderCircle, LuUserRoundCheck, LuUserRoundX } from "react-icons/lu";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import Swal from "sweetalert2";
import type { GetAllUsersResponse, User } from "../../interfaces/AllTypes";
import { getAccessToken, getCurrentUser } from "../../utils/auth";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);
  const [demotingUserId, setDemotingUserId] = useState<string | null>(null);
  const currentUser = getCurrentUser();

  //   Get all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<GetAllUsersResponse>(
          `${API_BASE_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          }
        );
        setUsers(res.data.data);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to fetch users";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getFeelingIcon = (feeling: string) => {
    switch (feeling) {
      case "FRUSTRATED":
        return <FiFrown className="text-red-500" />;
      case "SAD":
        return <FiMeh className="text-yellow-500" />;
      case "GRATEFUL":
        return <FiSmile className="text-green-500" />;
      default:
        return <FiMeh className="text-gray-500" />;
    }
  };

  //   const handleEdit = (userId: string) => {
  //     console.log("Edit user:", userId);
  //   };

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Soft delete user?",
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
        setDeletingUserId(userId);
        await axios.patch(
          `${API_BASE_URL}/admin/users/${userId}/soft-delete`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          }
        );

        // Update local state to reflect the deletion
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, isActive: false } : user
          )
        );

        toast.success("User soft deleted successfully", {
          position: "top-right",
        });
        // console.log(res);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Failed to delete user";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setDeletingUserId(null);
      }
    }
  };

  const handlePromote = async (userId: string) => {
    try {
      setPromotingUserId(userId); // Set the user being promoted
      const result = await Swal.fire({
        title: "Promote to Admin?",
        text: "This user will gain admin privileges",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Promote",
        cancelButtonText: "Cancel",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2",
          cancelButton:
            "px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",
        },
      });

      if (!result.isConfirmed) {
        setPromotingUserId(null);
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/super-admin/users/${userId}/promote-to-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: "ADMIN" } : user
        )
      );

      toast.success("User promoted to admin successfully");
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to promote user";
      toast.error(errorMessage);
    } finally {
      setPromotingUserId(null);
    }
  };

  const handleDemote = async (userId: string) => {
    try {
      setDemotingUserId(userId); // Set the user being demoted
      const result = await Swal.fire({
        title: "Demote to Regular User?",
        text: "This user will lose admin privileges",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Demote",
        cancelButtonText: "Cancel",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2",
          cancelButton:
            "px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",
        },
      });

      if (!result.isConfirmed) {
        setDemotingUserId(null);
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/super-admin/users/${userId}/demote-to-user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: "USER" } : user
        )
      );

      toast.success("User demoted to regular user successfully");
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Failed to demote user";
      toast.error(errorMessage);
    } finally {
      setDemotingUserId(null);
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-6 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FiUser className="mr-2" /> Name
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FiMail className="mr-2" /> Email
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FiShield className="mr-2" /> Role
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FiShield className="mr-2" /> Verified
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FiActivity className="mr-2" /> Status
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" /> Created
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mood
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-[#E46B71] flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "ADMIN"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {user.isProfileVerified ? (
                      <FiCheckCircle
                        className="text-green-500"
                        title="Verified"
                      />
                    ) : (
                      <FiXCircle
                        className="text-red-500"
                        title="Not Verified"
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {user.feelingToday?.map((feeling, index) => (
                        <span key={index} title={feeling}>
                          {getFeelingIcon(feeling)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                      {/* <button
                        onClick={() => handleEdit(user.id)}
                        className="text-gray-500 hover:text-blue-600"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button> */}
                      {user.isActive ? (
                        // Conditions where delete should be disabled:
                        // 1. Any user trying to delete themselves
                        // 2. ADMIN trying to delete SUPER_ADMIN or other ADMINS
                        user.id === currentUser?.id ||
                        (currentUser?.role === "ADMIN" &&
                          (user.role === "SUPER_ADMIN" ||
                            user.role === "ADMIN")) ? (
                          <button
                            disabled
                            className="text-gray-300 cursor-not-allowed"
                            title={
                              user.id === currentUser?.id
                                ? "Cannot delete yourself"
                                : currentUser?.role === "ADMIN" &&
                                  user.role === "SUPER_ADMIN"
                                ? "Cannot delete SUPER_ADMIN"
                                : "Cannot delete other admins"
                            }
                          >
                            <FiTrash2 size={18} />
                          </button>
                        ) : deletingUserId === user.id ? (
                          <div className="flex justify-center items-center">
                            <LuLoaderCircle
                              className="text-[#E46B71] animate-spin"
                              size={18}
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-gray-500 hover:text-red-600 hover:cursor-pointer transition-all duration-300"
                            title="Soft Delete"
                            disabled={deletingUserId !== null}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )
                      ) : (
                        <button
                          disabled
                          className="text-gray-300 cursor-not-allowed"
                          title="User is already soft deleted"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}

                      {currentUser?.role === "SUPER_ADMIN" && (
                        <>
                          {user.role === "USER" &&
                            (promotingUserId === user.id ? (
                              <div className="flex justify-center items-center">
                                <LuLoaderCircle
                                  className="text-blue-500 animate-spin"
                                  size={18}
                                />
                              </div>
                            ) : (
                              <button
                                onClick={() => handlePromote(user.id)}
                                className="text-green-600 hover:text-green-800 hover:cursor-pointer"
                                title="Promote to admin"
                                disabled={promotingUserId !== null}
                              >
                                <LuUserRoundCheck size={18} />
                              </button>
                            ))}
                          {user.role === "ADMIN" &&
                            (demotingUserId === user.id ? (
                              <div className="flex justify-center items-center">
                                <LuLoaderCircle
                                  className="text-yellow-500 animate-spin"
                                  size={18}
                                />
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDemote(user.id)}
                                className="text-yellow-600 hover:text-yellow-800 hover:cursor-pointer"
                                title="Demote to user"
                                disabled={demotingUserId !== null}
                              >
                                <LuUserRoundX size={18} />
                              </button>
                            ))}
                        </>
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
  );
};

export default AllUsers;
