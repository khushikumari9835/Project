import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { upsertAgent } from "../utils/localDb"; // ✅ NEW import

// 1. Static Configuration
const ROLES = [
  
  { value: "admin", label: "Admin" },
  { value: "field_agent", label: "Field Agent" },
  { value: "user", label: "User" },
  { value: "vendor", label: "Vendor" },
];

// 2. Atomic Input Component
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

// 3. Main Component
const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize role from Landing Page state or default to 'user'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: location.state?.role || "user",
  });

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await register(
      formData.name,
      formData.email,
      formData.password,
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
          <FormInput
            name="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <FormInput
            name="password"
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="form-control mt-2">
            <label className="label-text text-white mb-1">Confirm Role</label>
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

          <button className="btn btn-primary w-full mt-6 text-white font-bold">
            Create Account
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

export default Register;
