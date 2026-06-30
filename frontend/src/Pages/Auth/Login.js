// LoginPage.js
import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI, verifyOTPAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [displayOTP, setDisplayOTP] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, otp } = values;

    setLoading(true);

    try {
      if (showOTPForm) {
        const { data } = await axios.post(verifyOTPAPI, {
          email,
          otp,
        });

        if (data.success === true) {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/");
          toast.success(data.message, toastOptions);
        } else {
          toast.error(data.message, toastOptions);
        }
      } else {
        const { data } = await axios.post(loginAPI, {
          email,
          password,
        });

        if (data.success === true) {
          if (data.requireOTP) {
            setShowOTPForm(true);
            if (data.otp) setDisplayOTP(data.otp);
            toast.success("OTP generated! See code below.", toastOptions);
          } else {
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/");
            toast.success(data.message, toastOptions);
          }
        } else {
          toast.error(data.message, toastOptions);
        }
      }
    } catch (error) {
      toast.error(showOTPForm ? "OTP Verification failed." : "Login failed. Please check your credentials.", toastOptions);
    }
    setLoading(false);
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-3 py-6 sm:p-4 overflow-hidden bg-[linear-gradient(135deg,#0b0f19_0%,#0f172a_58%,#050816_100%)]">
      
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        className="absolute inset-0 z-0"
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: ["#00ffb2", "#7c3aed", "#38bdf8", "#ff4d6d"] },
            shape: {
              type: "char",
              character: [
                { value: "$", font: "Arial", weight: "bold" },
                { value: "₹", font: "Arial", weight: "bold" },
                { value: "€", font: "Arial", weight: "bold" },
              ],
            },
            opacity: { value: 0.35, random: true },
            size: { value: { min: 15, max: 30 } },
            move: {
              enable: true,
              speed: 2.5,
              direction: "bottom",
              random: true,
              straight: false,
              outModes: { default: "out" },
            },
            rotate: {
              value: { min: 0, max: 360 },
              direction: "random",
              animation: { enable: true, speed: 5 },
            }
          },
          detectRetina: true,
        }}
      />
      
      <ToastContainer />

      <div className="glass-panel z-10 max-w-md w-full p-5 sm:p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider flex items-center justify-center mb-2">
            <span className="text-[var(--color-primary)]">Wise</span>Pay
          </div>
          <h2 className="text-base sm:text-lg font-medium text-[var(--color-text-muted)] text-center tracking-wide">
            Welcome back
          </h2>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {showOTPForm ? (
            <div className="animate-fade-in-up">
              {displayOTP && (
                <div className="mb-4 p-4 rounded-lg text-center" style={{background: 'rgba(0,255,178,0.1)', border: '1px solid var(--color-primary)'}}>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Your OTP Code</p>
                  <p className="text-3xl font-extrabold tracking-widest text-[var(--color-primary)]">{displayOTP}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">Valid for 10 minutes</p>
                </div>
              )}
              <input 
                type="text"
                name="otp"
                value={values.otp}
                onChange={handleChange}
                className="premium-control w-full px-4 py-3 text-white rounded-lg outline-none placeholder-white/60 text-center tracking-widest text-xl font-bold"
                placeholder="Enter 6-digit OTP" 
                maxLength="6"
                required 
              />
              <p className="text-center text-[var(--color-primary)] text-sm mt-3">Copy the code above and paste it here</p>
            </div>
          ) : (
            <>
              <div>
                <input 
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className="premium-control w-full px-4 py-3 text-white rounded-lg outline-none placeholder-white/60"
                  placeholder="Email address" 
                  required 
                />
              </div>

              <div>
                <input 
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className="premium-control w-full px-4 py-3 text-white rounded-lg outline-none placeholder-white/60"
                  placeholder="Password" 
                  required 
                />
              </div>

              <div className="flex justify-end w-full">
                <Link to="/forgotPassword" className="text-sm text-[var(--color-primary)] hover:text-white transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-custom w-full font-semibold py-3 rounded-lg transition-all flex items-center justify-center"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-[9999px] animate-spin"></span>
            ) : (
              showOTPForm ? "Verify OTP" : "Log In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[var(--color-primary)] hover:underline font-bold tracking-wide">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
