<<<<<<< HEAD
import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
=======
import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { requestOtp, verifyOtp } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const selectedRole = location.state?.role || "user";

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    const result = await requestOtp(email, password, selectedRole);

    if (result.success) {
      setMessage(result.message || "OTP sent to your email");
      setStep(2);
    } else {
      alert(result.error || "Unable to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const result = await verifyOtp(email, otp);

    if (!result.success) {
      alert(result.error || "OTP verification failed");
      return;
    }

    const userInfo = result.user;

    if (userInfo.role === "admin") return navigate("/admin");
    if (userInfo.role === "field_agent") return navigate("/agent");
    if (userInfo.role === "vendor") return navigate("/vendor");
    return navigate("/seller/dashboard");
=======
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Default to 'seller' if no role was passed from the previous page
  const selectedRole = location.state?.role || 'seller';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Pass credentials to your AuthContext login function
    const result = await login(email, password, selectedRole);
    
    if (result.success) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      // REDIRECTION LOGIC MATCHING YOUR ROUTES
      if (userInfo.role === 'admin') return navigate('/admin');
      if (userInfo.role === 'seller') return navigate('/upload');
      if (userInfo.role === 'field_agent') return navigate('/agent');
      if (userInfo.role === 'vendor') return navigate('/vendor');
      
      //navigate('/');
      //// added by khushi kumari -- start
      //navigate("/upload", { replace: true });
      // added by khushi kumari -- end
    //} else {
      //alert(result.error || "Login Failed");

      navigate("/seller/dashboard", { replace: true });
      return;

    }
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
  };

  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="card w-96 bg-neutral text-white shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-2 font-bold uppercase">
<<<<<<< HEAD
            {selectedRole.replace("_", " ")} Login
          </h2>

          <p className="text-center text-gray-400 text-sm mb-4">
            {step === 1
              ? "Enter email and password to receive OTP"
              : "Enter the OTP sent to your email"}
          </p>

          {message && (
            <div className="text-sm text-green-300 text-center mb-3">
              {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-white">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="input input-bordered w-full text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-white">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-primary w-full text-white font-bold mt-2">
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-white">OTP</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="input input-bordered w-full text-black"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <button className="btn btn-primary w-full text-white font-bold mt-2">
                Verify OTP & Login
              </button>

              <button
                type="button"
                className="btn btn-outline w-full"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setMessage("");
                }}
              >
                Back
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-gray-300">
              New here?
              <Link
                to="/register"
                state={{ role: selectedRole }}
=======
            {selectedRole.replace('_', ' ')} Login
          </h2>
          <p className="text-center text-gray-400 text-sm mb-4">Enter your credentials to continue</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label"><span className="label-text text-white">Email</span></label>
              <input 
                type="email" placeholder="name@company.com" 
                className="input input-bordered w-full text-black" 
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text text-white">Password</span></label>
              <input 
                type="password" placeholder="••••••••" 
                className="input input-bordered w-full text-black" 
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
            </div>

            <button className="btn btn-primary w-full text-white font-bold mt-2">
              Sign In
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-300">
              New here? 
              <Link 
                to="/register" 
                state={{ role: selectedRole }} 
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
                className="link link-accent ml-1 font-bold"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;