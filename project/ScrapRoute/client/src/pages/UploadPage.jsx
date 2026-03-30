// This file is added by Khushi Kumari to upload e-waste image
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const navigate = useNavigate();

  // ✅ Read logged-in user from localStorage (ScrapRoute style)
  const user = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
      // common structures: stored.user OR stored.userInfo OR stored
      return stored.user || stored.userInfo || stored;
    } catch {
      return {};
    }
  }, []);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handlePick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      alert("Please choose an image (JPG/PNG).");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  const handleUpload = () => {
    if (!file) return alert("Please browse and select an image first.");
    //alert("Image selected ✅ (Backend upload can be connected next)");
    alert("Upload successful");
    navigate("/pickup-dashboard");
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* ✅ HEADER (like other pages) */}
      <div className="navbar bg-base-100 shadow-sm px-4 md:px-8">
        <div className="flex-1 flex items-center gap-3">
          {/* Logo bubble */}
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg">
            ♻️
          </div>
          <div>
            <div className="text-lg font-extrabold leading-5">ScrapRoute</div>
            <div className="text-xs opacity-70">E-Waste Management</div>
          </div>
        </div>

        <div className="flex-none flex items-center gap-3">
          <div className="hidden sm:block text-sm">
            <span className="opacity-70">Welcome, </span>
            <span className="font-bold">{user?.name || user?.email || "User"}</span>
          </div>
          <button className="btn btn-sm btn-error text-white" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        {/* Title block (matches dashboard style) */}
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold">Upload E-Waste Image</h1>
          <p className="opacity-70 text-sm">
            Browse an image of the item you want to recycle.
          </p>
        </div>

        {/* Upload Card */}
        <div className="card bg-base-100 shadow-md border border-base-300">
          <div className="card-body">
            <label className="border-2 border-dashed border-base-300 rounded-2xl p-6 flex gap-4 items-center cursor-pointer hover:bg-base-200 transition">
              <span className="text-3xl">📷</span>
              <div>
                <p className="font-extrabold">Browse Image</p>
                <p className="text-sm opacity-70">JPG / PNG supported</p>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePick}
              />
            </label>

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-bold mb-2">Preview</p>
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-h-80 object-cover rounded-2xl border border-base-300"
                />
              </div>
            )}

            <button className="btn btn-success w-full mt-5" onClick={handleUpload}>
              Upload
            </button>

            <p className="text-xs opacity-60 mt-3">
              Tip: Use a clear image so verification is faster.
            </p>
          </div>
        </div>

        {/* ✅ FOOTER (like other pages) */}
        <div className="mt-10 text-center text-xs opacity-60">
          © {new Date().getFullYear()} ScrapRoute · Built for E-Waste Management
        </div>
      </div>
    </div>
  );
}
