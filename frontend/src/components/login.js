import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log("Email:", email, "Password:", password);

    if(email === "admin" && password === "admin"){
      alert("Login successful!");
      window.location.href = "/adminDashboard";
    }

  };

  return (
    <>
      <style>
        {`
            .form11.groove {
            border-style: groove;}

          .login-container {
            padding: 3rem 0;
          }
          .form-control {
            border: none;
            border-bottom: 2px solid #ccc;
            border-radius: 0;
          }
          .btn-dark {
            background-color: black;
            color: white;
            border: none;
            padding: 10px;
            font-size: 1rem;
          }
          .btn-outline-dark {
            border: 1px solid black;
            color: black;
            padding: 10px;
            font-size: 1rem;
          }
          .separator {
            width: 1px;
            background-color: rgba(0, 0, 0, 0.1);
          }
          .separator-horizontal {
            height: 1px;
            background-color: rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      <link rel="stylesheet" href="https://unpkg.com/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://unpkg.com/bs-brain@2.0.4/components/logins/login-12/assets/css/login-12.css" />
      <div className="form11">
      <section className="login-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="mb-5 text-center">
                <h2 className="display-5 fw-bold">Sign in</h2>
                <p>
                  Don't have an account? <a href="#!">Sign up</a>
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8">
              <div className="row gy-5 justify-content-center">
                <div className="col-12 col-lg-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row gy-3">
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="Username"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <label htmlFor="email">Username</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label htmlFor="password">Password</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row justify-content-between">
                          <div className="col-6">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="remember_me"
                                id="remember_me"
                              />
                              <label
                                className="form-check-label text-secondary"
                                htmlFor="remember_me"
                              >
                                Remember me
                              </label>
                            </div>
                          </div>
                          <div className="col-6 text-end">
                            <a
                              href="#!"
                              className="link-secondary text-decoration-none"
                            >
                              Forgot password?
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid">
                          <button className="btn btn-dark" type="submit">
                            Log in
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-12 col-lg-2 d-flex align-items-center justify-content-center gap-3 flex-lg-column">
                  <div className="separator d-none d-lg-block"></div>
                  <div className="separator-horizontal d-lg-none"></div>
                  <div>or</div>
                  <div className="separator d-none d-lg-block"></div>
                  <div className="separator-horizontal d-lg-none"></div>
                </div>
                <div className="col-12 col-lg-5 d-flex align-items-center">
                  <div className="d-flex gap-3 flex-column w-100">
                    <a
                      href="https://online-system-for-pet-care-and-treatment.onrender.com/auth/google"
                      className="btn btn-outline-dark"
                    >
                      Continue with Google
                    </a>
                    <a href="#!" className="btn btn-outline-dark">
                      Continue with Apple
                    </a>
                    <a href="#!" className="btn btn-outline-dark">
                      Continue with Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

export default Login;
