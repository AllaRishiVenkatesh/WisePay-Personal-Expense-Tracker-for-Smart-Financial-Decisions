import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { forgotPasswordAPI } from "../../utils/ApiRequest";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

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
    const { email, newPassword, confirmPassword } = values;

    if (!email || !newPassword || !confirmPassword) {
      toast.error("Please enter all fields", toastOptions);
      return;
    }

    if (newPassword.trim().length < 6) {
      toast.error("Password must be at least 6 characters", toastOptions);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", toastOptions);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(forgotPasswordAPI, {
        email,
        newPassword,
      });

      if (data?.success) {
        toast.success(data.message || "Password reset successfully", toastOptions);
        setTimeout(() => navigate("/login"), 900);
      } else {
        toast.error(data?.message || "Unable to reset password", toastOptions);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to reset password",
        toastOptions
      );
    } finally {
      setLoading(false);
    }
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
                { value: "Rs", font: "Arial", weight: "bold" },
                { value: "EUR", font: "Arial", weight: "bold" },
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
            },
          },
          detectRetina: true,
        }}
      />

      <ToastContainer />

      <div className="glass-panel z-10 max-w-md w-full p-5 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 text-center tracking-wide">
          Reset Password
        </h2>
        <p className="text-[var(--color-text-muted)] mb-8 text-center text-sm font-medium">
          Enter your account email and choose a new password.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="premium-control w-full px-4 py-3 text-white rounded-lg outline-none placeholder-white/60"
            placeholder="Email address"
            required
          />

          <input
            type="password"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            className="premium-control w-full px-4 py-3 text-white rounded-lg outline-none placeholder-white/60"
            placeholder="New password"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            className="premium-control w-full px-4 py-3 text-white rounded-lg outline-none placeholder-white/60"
            placeholder="Confirm new password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-custom w-full font-semibold py-3 rounded-lg transition-all flex items-center justify-center"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-[9999px] animate-spin"></span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Remembered it?{" "}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline font-bold tracking-wide">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
