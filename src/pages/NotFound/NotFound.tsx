import { Link } from "react-router";

const NotFound = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 text-gray-800 p-4">
        <h1 className="text-9xl font-extrabold text-gray-300">404</h1>
        <h2 className="text-4xl font-bold text-gray-700 mt-4 mb-2">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-md">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <Link to="/dashboard">
          <a className="mt-8 px-6 py-3 bg-[#E46B71] text-white rounded-md hover:bg-[#ff676e] duration-300 inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            Go to Homepage
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
