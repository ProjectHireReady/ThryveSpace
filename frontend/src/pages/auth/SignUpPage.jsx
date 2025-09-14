// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import signupImage from "../../assets/auth/auth2.svg";
// import { Link, useNavigate } from "react-router-dom";
// import "./Auth.css";
// import { Eye, EyeOff } from "lucide-react";
// import { z } from "zod";


// const signupSchema = z.object({
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   confirmPassword: z.string().min(1, "Please confirm your password"),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// export default function SignupPage() {
//   const { signup, loading: authLoading, error: authError } = useAuth();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});


//   const navigate = useNavigate();


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Clear specific field error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: null }));
//     }

//     // Special handling for confirm password
//     if (name === 'password' && errors.confirmPassword) {
//       setErrors(prev => ({ ...prev, confirmPassword: null }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // CRITICAL: Prevent browser validation
//     e.target.setAttribute('novalidate', 'true');
//     setErrors({});

//     const result = signupSchema.safeParse(formData);
//     if (!result.success) {
//       const formatted = {};
//       result.error?.errors?.forEach(err => {
//         formatted[err.path[0]] = err.message;
//       });
//       setErrors(formatted);
//       return;
//     }

//     try {
//       // Call signup from AuthContext
//       await signup({
//         first_name: formData.firstName,
//         last_name: formData.lastName,
//         email: formData.email,
//         password: formData.password,
//       });
//       navigate("/login"); // Redirect on success
//     } catch (err) {
//       setErrors({ form: err?.message || authError || "Signup failed" });
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <div className="auth-image-wrapper">
//           <img src={signupImage} alt="Signup" className="auth-image" />
//         </div>

//         <div className="auth-form-wrapper">
//           <form className="auth-form" onSubmit={handleSubmit} noValidate>
//             <h2>Sign Up</h2>

//             {errors.form && <p className="error-msg">{errors.form}</p>}

//             <label>First Name:</label>
//             <input
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder="e.g., Elizabeth"
//               aria-invalid={errors.firstName ? 'true' : 'false'}
//               aria-describedby={errors.firstName ? "firstName-error" : undefined}
//             />
//             {errors.firstName && <p className="inline-error">{errors.firstName}</p>}

//             <label>Last Name:</label>
//             <input
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder="e.g., Williams"
//               aria-invalid={errors.lastName ? 'true' : 'false'}
//               aria-describedby={errors.lastName ? "lastName-error" : undefined}
//             />
//             {errors.lastName && <p className="inline-error">{errors.lastName}</p>}

//             <label>Email:</label>
//             <input
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               aria-invalid={errors.email ? 'true' : 'false'}
//               aria-describedby={errors.email ? "email-error" : undefined}
//             />
//             {errors.email && <p className="inline-error">{errors.email}</p>}

//             <label>Password:</label>
//             <div className="password-input-wrapper">
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="At least 8 characters"
//                 aria-invalid={errors.password ? 'true' : 'false'}
//                 aria-describedby={errors.password ? "password-error" : undefined}
//                 autoComplete="new-password"
//               />
//               <button
//                 type="button"
//                 className="toggle-password-btn"
//                 onClick={() => setShowPassword((p) => !p)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {errors.password && <p className="inline-error">{errors.password}</p>}

//             <label>Confirm Password:</label>
//             <div className="password-input-wrapper">
//               <input
//                 name="confirmPassword"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 aria-invalid={errors.confirmPassword ? 'true' : 'false'}
//                 aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
//               />


//               <button
//                 type="button"
//                 className="toggle-password-btn"
//                 onClick={() => setShowPassword((p) => !p)}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
                
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//             {errors.confirmPassword && (
//               <p id="confirm-password-error" className="inline-error">
//                 {errors.confirmPassword}
//               </p>
//             )}

//             <button type="submit" disabled={authLoading}>
//               {authLoading ? "Processing..." : "Sign Up"}
//             </button>

//             <p className="toggle-text">
//               Already have an account? <Link to="/login">Login</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import signupImage from "../../assets/auth/auth2.svg";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => {
  console.log("Password match check:", { 
    password: data.password, 
    confirmPassword: data.confirmPassword,
    match: data.password === data.confirmPassword 
  });
  return data.password === data.confirmPassword;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const { signup, loading: authLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    // Special handling for confirm password
    if (name === 'password' && errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.setAttribute('novalidate', 'true');
    
    setErrors({});

    
    
    const result = signupSchema.safeParse(formData);
    
   
    
    if (!result.success) {
      
      const formatted = {};
      
      // Zod uses 'issues' not 'errors'
      result.error.issues?.forEach(err => {
        
        formatted[err.path[0]] = err.message;
      });
      
      setErrors(formatted);
      return;
    }

    try {
      await signup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      // Set form-level error for API/server errors
      setErrors(prev => ({ 
        ...prev, 
        form: err?.message || authError || "Signup failed. Please try again." 
      }));
      //setErrors({ form: err?.message || authError || "Signup failed" });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image-wrapper">
          <img src={signupImage} alt="Signup" className="auth-image" />
        </div>

        <div className="auth-form-wrapper">
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h2>Sign Up</h2>

            {errors.form && <div className="error-msg">{errors.form}</div>}
            

            <label className={errors.firstName ? 'error' : ''}>
              First Name:
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g., Elizabeth"
              className={errors.firstName ? 'error' : ''}
              aria-invalid={errors.firstName ? 'true' : 'false'}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" className="inline-error">
                {errors.firstName}
              </p>
            )}

            <label className={errors.lastName ? 'error' : ''}>
              Last Name:
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g., Williams"
              className={errors.lastName ? 'error' : ''}
              aria-invalid={errors.lastName ? 'true' : 'false'}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="inline-error">
                {errors.lastName}
              </p>
            )}

            <label className={errors.email ? 'error' : ''}>
              Email:
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? 'error' : ''}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="inline-error">
                {errors.email}
              </p>
            )}

            <label className={errors.password ? 'error' : ''}>
              Password:
            </label>
            <div className={`password-input-wrapper ${errors.password ? 'error' : ''}`}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={errors.password ? 'error' : ''}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? "password-error" : undefined}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="inline-error">
                {errors.password}
              </p>
            )}

            <label className={errors.confirmPassword ? 'error' : ''}>
              Confirm Password:
            </label>
            <div className={`password-input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="inline-error">
                {errors.confirmPassword}
              </p>
            )}

            <button type="submit" disabled={authLoading}>
              {authLoading ? "Processing..." : "Sign Up"}
            </button>

            <p className="toggle-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}