// SignupPage.js
import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('user')){
      navigate('/');
    }
  }, [navigate]);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  const [values, setValues] = useState({
    name : "",
    email : "",
    password : "",
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
  }

  const handleChange = (e) => {
    setValues({...values , [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {name, email, password} = values;

    setLoading(true);
   
    try {
      const {data} = await axios.post(registerAPI, {
        name,
        email,
        password
      });

      if(data.success === true){
        delete data.user.password;
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      }
      else{
        toast.error(data.message, toastOptions);
      }
    } catch (err) {
      toast.error("Registration failed. Please try again.", toastOptions);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-shell relative min-h-screen flex items-center justify-center px-3 py-6 sm:p-4 overflow-hidden">
      
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
            color: { value: ["#4ade80", "#22c55e", "#16a34a", "#facc15"] },
            shape: {
              type: "char",
              character: [
                { value: "$", font: "Arial", weight: "bold" },
                { value: "₹", font: "Arial", weight: "bold" },
                { value: "€", font: "Arial", weight: "bold" },
              ],
            },
            opacity: { value: 0.8, random: true },
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
            Create an account
          </h2>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={values.name}
              className="premium-control w-full px-4 py-3 text-white rounded-lg outline-none placeholder-white/60"
              required
            />
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              value={values.email}
              className="premium-control w-full px-4 py-3 text-white rounded-lg outline-none placeholder-white/60"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={values.password}
              className="premium-control w-full px-4 py-3 text-white rounded-lg outline-none placeholder-white/60"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-custom w-full font-semibold py-3 rounded-lg transition-all flex items-center justify-center mt-2"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-[9999px] animate-spin"></span>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="text-center mt-6 text-sm text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--color-primary)] hover:underline font-bold tracking-wide">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
