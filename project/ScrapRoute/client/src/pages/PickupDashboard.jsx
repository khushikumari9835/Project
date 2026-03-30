// This file is added by Khushi Kumari to upload e-waste image
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PickupDashboard() {
  const navigate = useNavigate();

<<<<<<< HEAD
  // ✅ Get logged-in user (works with common ScrapRoute storage formats)
=======
  
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  const user = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
      return stored.user || stored.userInfo || stored;
    } catch {
      return {};
    }
  }, []);

  const [form, setForm] = useState({
    category: "",
    model: "",
    year: "",
    condition: "",
    description: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
  };

  const handleAddItem = () => {
    // connect API later
    alert("Item added ✅ (API integration can be added next)");
  };

  return (
    <div className="min-h-screen bg-base-200">
<<<<<<< HEAD
      {/* ✅ HEADER (same styling pattern as Upload page / dashboards) */}
=======
      {/* HEADER ) */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      <div className="navbar bg-base-100 shadow-sm px-4 md:px-8">
        <div className="flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg">
            ♻️
          </div>
          <div>
            <div className="text-lg font-extrabold leading-5">ScrapRoute</div>
<<<<<<< HEAD
            <div className="text-xs opacity-70">E-Waste Management</div>
=======
            
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
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

<<<<<<< HEAD
      {/* ✅ BODY */}
=======
      {/*  BODY */}
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Title line */}
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold">Pickup Dashboard</h1>
          <p className="text-sm opacity-70">
            Add item details and track your pickup request.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
<<<<<<< HEAD
          {/* LEFT: Form + My Pickup Requests */}
=======
          
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          <div className="space-y-4">
            {/* FORM */}
            <div className="card bg-base-100 shadow-md border border-base-300">
              <div className="card-body">
                <h2 className="card-title">Form</h2>

                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    name="category"
                    className="select select-bordered w-full"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Category</option>
                    <option>TV</option>
                    <option>Laptop</option>
                    <option>Charger</option>
                    <option>Mobile Phone</option>
                    <option>Battery</option>
                    <option>Mouse</option>
                    <option>Keyboard</option>
                  </select>

                  <input
                    name="model"
                    placeholder="Model"
                    className="input input-bordered w-full"
                    value={form.model}
                    onChange={handleChange}
                  />

                  <input
                    name="year"
                    placeholder="Year of purchase"
                    className="input input-bordered w-full"
                    value={form.year}
                    onChange={handleChange}
                  />

                  <select
                    name="condition"
                    className="select select-bordered w-full"
                    value={form.condition}
                    onChange={handleChange}
                  >
                    <option value="">Condition</option>
                    <option>Good</option>
                    <option>Poor</option>
                    <option>Very Poor</option>
                  </select>
                </div>

                <textarea
                  name="description"
                  placeholder="Description"
                  className="textarea textarea-bordered w-full"
                  value={form.description}
                  onChange={handleChange}
                />

                <button className="btn btn-success w-full md:w-auto" onClick={handleAddItem}>
                  Add Item
                </button>
              </div>
            </div>

<<<<<<< HEAD
            {/* MY PICKUP REQUESTS */}
=======
      
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
            <div className="card bg-base-100 shadow-md border border-base-300">
              <div className="card-body">
                <h2 className="card-title">My Pickup Requests</h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-200/40 p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-900/5 grid place-items-center">
                        💻
                      </div>
                      <div>
                        <div className="font-extrabold">Laptop</div>
                        <div className="text-xs opacity-70">Pickup ID: #12376</div>
                      </div>
                    </div>
                    <span className="badge badge-warning">Pending</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-200/40 p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-900/5 grid place-items-center">
                        📱
                      </div>
                      <div>
                        <div className="font-extrabold">Mobile Phone</div>
                        <div className="text-xs opacity-70">Pickup ID: #12377</div>
                      </div>
                    </div>
                    <span className="badge badge-info">Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Track Your Pickup */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Track Your Pickup</h2>

              {/* Map placeholder (you can replace with Google Map later) */}
              <div className="h-44 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center">
                <div className="text-sm opacity-70 font-bold">
                  Real-time Google Map (placeholder)
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold">Laptop</div>
                  <span className="badge badge-warning">Pending</span>
                </div>
                <div className="text-sm opacity-70">Nearest Recycler: GreenTech Recycling</div>
                <div className="text-sm opacity-70">Pickup ID: #12376</div>
              </div>

              <button className="btn btn-primary mt-4 w-full">Track</button>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* ✅ FOOTER */}
=======
      
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <div className="mt-10 text-center text-xs opacity-60">
          © {new Date().getFullYear()} ScrapRoute · Built for E-Waste Management
        </div>
      </div>
    </div>
  );
}
