import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
<<<<<<< HEAD

const ROLES = [
  { value: "field_agent", label: "Field Agent" }, // ✅ visible but blocked
  { value: "user", label: "User" },
  { value: "vendor", label: "Vendor" },
  { value: "admin", label: "Admin" },
];

=======
import { upsertAgent } from "../utils/localDb"; // ✅ NEW import

// 1. Static Configuration
const ROLES = [

  
  { value: "field_agent", label: "Field Agent" },
  { value: "user", label: "User" },
  { value: "vendor", label: "Vendor" },
  { value: "admin", label: "Admin" }, // ✅ add this
];

// 2. Atomic Input Component
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
const FormInput = ({ name, type, placeholder, value, onChange }) => (
  <div className="form-control mb-2">
    <label className="label-text text-white capitalize mb-1">{name}</label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="input input-bordered w-full text-black"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

<<<<<<< HEAD
=======
// 3. Main Component
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
=======
  // Initialize role from Landing Page state or default to 'user'
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: location.state?.role || "user",
<<<<<<< HEAD
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
=======
  });

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

  const handleSubmit = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    // 🚨 BLOCK FIELD AGENT REGISTRATION HERE
    if (formData.role === "field_agent") {
      alert("Field Agents can only be registered by a Vendor.");
      return;
    }

    setLoading(true);

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
    const res = await register(
      formData.name,
      formData.email,
      formData.password,
<<<<<<< HEAD
      formData.role,
      { address: formData.address }
    );

    setLoading(false);

    if (res?.success) {
      alert(
        res?.message ||
          "Registration successful. Please login using email, password and OTP."
      );

=======
      formData.role
    );

    if (res?.success) {
      // ✅ If field agent registered, add to agents registry (real agents)
      if (formData.role === "field_agent") {
        upsertAgent({
          name: formData.name,
          email: formData.email,
          role: "field_agent",
          createdAt: new Date().toISOString(),
        });
      }

      // Continue normal flow
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
      navigate("/login", { state: { role: formData.role } });
    } else {
      alert(res?.error || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="card w-96 bg-neutral p-8 shadow-2xl text-white">
        <h2 className="text-2xl font-bold text-center mb-2 uppercase">
          Register
        </h2>
<<<<<<< HEAD

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
        <p className="text-center text-xs text-gray-400 mb-6 font-medium tracking-wide">
          Joining as {formData.role.replace("_", " ")}
        </p>

        <form onSubmit={handleSubmit}>
          <FormInput
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
<<<<<<< HEAD

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          <FormInput
            name="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
          />
<<<<<<< HEAD

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          <FormInput
            name="password"
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
          />

<<<<<<< HEAD
          <FormInput
            name="address"
            type="text"
            placeholder="Address / Location"
            value={formData.address}
            onChange={handleChange}
          />

          <div className="form-control mt-2">
            <label className="label-text text-white mb-1">Select Role</label>
=======
          <div className="form-control mt-2">
            <label className="label-text text-white mb-1">Confirm Role</label>
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
            <select
              name="role"
              className="select select-bordered w-full text-black"
              value={formData.role}
              onChange={handleChange}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

<<<<<<< HEAD
          <button
            className="btn btn-primary w-full mt-6 text-white font-bold"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
=======
          <button className="btn btn-primary w-full mt-6 text-white font-bold">
            Create Account
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            to="/login"
            state={{ role: formData.role }}
            className="text-sm link link-accent"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Register;
=======
export default Register;
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
