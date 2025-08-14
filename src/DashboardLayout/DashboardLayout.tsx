import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CiCircleList } from "react-icons/ci";
import { FiHome, FiLogOut, FiMenu, FiUsers, FiX } from "react-icons/fi";
import { Link, Outlet, useLocation } from "react-router";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import type { GetAllUsersResponse, User } from "../interfaces/AllTypes";
import { getAccessToken, getCurrentUser, logout } from "../utils/auth";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigationItems = [
    {
      href: "/dashboard",
      icon: <FiHome size={20} />,
      text: "Dashboard",
    },
    {
      href: "/dashboard/users",
      icon: <FiUsers size={20} />,
      text: "All Users",
    },
    {
      href: "/dashboard/circle",
      icon: <CiCircleList size={24} />,
      text: "Circle",
    },
  ];

  // Get current page title based on route
  const getPageTitle = () => {
    if (location.pathname === "/dashboard") return "Dashboard Overview";
    if (location.pathname === "/dashboard/users") return "All Users";
    if (location.pathname === "/dashboard/circle") return "Manage Circle";
    return "Dashboard";
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          logout();
          resolve(null);
        }, 1000);
      }),
      {
        loading: "Logging out...",
        success: () => {
          return "You have been logged out 👋";
        },
        error: "Logout failed",
      }
    );
  };

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

  const verifiedUsers = users.filter((user) => user.isProfileVerified).length;
  const unverifiedUsers = users.length - verifiedUsers;
  // console.log(currentUser)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e46b7144]">
          <div className="flex items-center space-x-3">
            <div onClick={() => setSidebarOpen(false)}>
              <Link to={"/dashboard"}>
                <img
                  draggable={false}
                  src="/logo.png"
                  alt="Company Logo"
                  className="h-10"
                />
              </Link>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <FiX size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center w-full px-4 py-3 mx-3 my-1 rounded-xl transition-all duration-200 group ${
                location.pathname === item.href
                  ? "text-[#E46B71]"
                  : "text-gray-600"
              }`}
            >
              <span
                className={`mr-3 transition-transform duration-200 ${
                  location.pathname === item.href
                    ? "scale-110"
                    : "group-hover:scale-105"
                }`}
              >
                {item.icon}
              </span>
              <span className="font-medium">{item.text}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-2 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group hover:cursor-pointer"
          >
            <FiLogOut
              size={20}
              className="mr-3 group-hover:scale-105 transition-transform duration-200"
            />
            <span className="font-medium text-red-600">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-[#e46b7144] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open sidebar"
              >
                <FiMenu size={20} className="text-gray-600" />
              </button>

              <div>
                <p className="text-xl font-bold">{getPageTitle()}</p>
                <p className="text-sm text-gray-500">
                  {location.pathname === "/dashboard"
                    ? "Welcome to your dashboard"
                    : `Welcome back! ${currentUser?.name || "Admin User"}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Avatar */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentUser?.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : "A"}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.name ? currentUser.name : "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}

        <main className="flex-1 overflow-auto bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center mt-10">
              <PuffLoader color="#E46B71" size={40} />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">Error: {error}</div>
          ) : (
            <div className="p-6">
              {/* Dashboard-specific content */}
              {location.pathname === "/dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {/* Total Users Card */}
                  <div className="bg-gradient-to-br from-[#E46B71] to-[#E46B71] text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-base font-semibold">Total Users</h3>
                    <p className="text-3xl font-bold mt-2">
                      {users.length ? users.length : "N/A"}
                    </p>
                  </div>

                  {/* Verified Users Card */}
                  <div className="bg-gradient-to-br from-green-700 to-green-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-base font-semibold">Verified Users</h3>
                    <p className="text-3xl font-bold mt-2">
                      {verifiedUsers ? verifiedUsers : "N/A"}
                    </p>
                  </div>

                  {/* Unverified Users Card */}
                  <div className="bg-gradient-to-br from-red-800 to-red-800 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-base font-semibold">
                      Unverified Users
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                      {unverifiedUsers ? unverifiedUsers : "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {/* Outlet for nested routes */}
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
