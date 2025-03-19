import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // Error is a RouteErrorResponse
    errorMessage = error.statusText || error.data?.message || "Unknown error";
  } else if (error instanceof Error) {
    // Error is a standard JS Error
    errorMessage = error.message;
  } else if (typeof error === "string") {
    // Error is a string
    errorMessage = error;
  } else {
    // Unknown error type
    errorMessage = "Unknown error";
  }

  return (
    <div className="max-w-xl mx-auto text-center my-8">
      <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
      <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
        {errorMessage}
      </p>
      <p>
        <Link to="/" className="text-secondary font-medium hover:underline">
          Return to Home Page
        </Link>
      </p>
    </div>
  );
}
