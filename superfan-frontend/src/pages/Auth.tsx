import React from "react";

const Auth = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Login to Superfan</h1>

      <div className="flex flex-col space-y-4 w-full max-w-sm">
        {/* Spotify */}
        <a
          href={`${BACKEND_URL}/auth/spotify`}
          className="px-4 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          Continue with Spotify
        </a>

        {/* Google */}
        <a
          href={`${BACKEND_URL}/auth/google`}
          className="px-4 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
        >
          Continue with Google
        </a>

        {/* Facebook */}
        <a
          href={`${BACKEND_URL}/auth/facebook`}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Continue with Facebook
        </a>
      </div>
    </div>
  );
};

export default Auth;
