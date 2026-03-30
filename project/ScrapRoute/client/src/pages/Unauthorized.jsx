import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 border border-base-300 shadow-sm max-w-md w-full">
        <div className="card-body text-center space-y-4">
          <div className="text-2xl font-extrabold text-error">
            Unauthorized to access
          </div>

          <div className="text-sm opacity-70">
            You are not authorized to access this module with your current role.
          </div>

          <div className="grid gap-2">
            <button
              className="btn btn-outline w-full"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>

            <Link to="/login" className="btn btn-primary w-full">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
