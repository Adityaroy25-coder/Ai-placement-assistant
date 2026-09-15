import API_BASE_URL from "../api";
import JobRecommendations from "./components/JobRecommendations";
import GitHubAnalysis from "./components/GitHubAnalysis";
import JobReadiness from "./components/JobReadiness";
import SkillGap from "./components/SkillGap";
import { useEffect, useState } from "react";
import CareerRoadmap from "./components/CareerRoadmap";
import JobDescription from "./components/JobDescription";
import Dashboard from "./components/Dashboard";
import MockInterview from "./components/MockInterview";
import ResumeUpload from "./components/ResumeUpload";
import Login from "./components/Login";
import Register from "./components/Register";
import ApplicationTracker from "./components/ApplicationTracker";
import SkillAssessment from "./components/SkillAssessment";
import CareerPrediction from "./components/CareerPrediction";
import "./App.css";

function App() {
  const [showUpload, setShowUpload] = useState(false);
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState(() => {
  const savedResumeData =
    localStorage.getItem("resumeData");

  return savedResumeData
    ? JSON.parse(savedResumeData)
    : null;
});
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  // Token exists, so restore dashboard immediately
  setPage("dashboard");

  const restoreSession = async () => {
    try {
     const response = await fetch(
  `${API_BASE_URL}/api/auth/me`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      if (!response.ok) {
        console.error(
          "Session verification failed:",
          response.status
        );
        return;
      }

      const data = await response.json();

      const loggedInUser = data.user || data;

      if (loggedInUser) {
        setUser(loggedInUser);
      }
    } catch (error) {
      console.error(
        "Could not verify session:",
        error
      );
    }
  };

  restoreSession();
}, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("resumeData");

    setUser(null);
    setResumeData(null);
    setPage("home");
  };

  // Resume Upload
 if (showUpload) {
  return (
    <ResumeUpload
      onBack={() => {
        setShowUpload(false);
        setPage("dashboard");
      }}

      onAnalysisComplete={(data) => {
        setResumeData(data);

        localStorage.setItem(
          "resumeData",
          JSON.stringify(data)
        );

        setShowUpload(false);
        setPage("dashboard");
      }}
    />
  );
}

  // Login
  if (page === "login") {
    return (
      <Login
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
          setPage("dashboard");
        }}
        onRegister={() => setPage("register")}
      />
    );
  }

  // Register
  if (page === "register") {
    return (
      <Register
        onRegisterSuccess={() => setPage("login")}
        onLogin={() => setPage("login")}
      />
    );
  }

  // Dashboard
  if (page === "dashboard") {
    return (
      <Dashboard
        user={user}
        resumeData={resumeData}
        onLogout={handleLogout}
        onResumeAnalysis={() => setShowUpload(true)}
        setPage={setPage}
      />
    );
  }

  // Job Matching
  if (page === "job") {
  return (
    <JobDescription
      resumeData={resumeData}
      onBack={() => setPage("dashboard")}
    />
  );
}
if (page === "skill-gap") {
  return (
    <SkillGap
      resumeData={resumeData}
      onBack={() => setPage("dashboard")}
    />
  );
}
if (page === "roadmap") {
  return (
    <CareerRoadmap
      resumeData={resumeData}
      onBack={() => setPage("dashboard")}
    />
  );
}
if (page === "applications") {
  return (
    <ApplicationTracker
      onBack={() => setPage("dashboard")}
    />
  );
}
if (page === "readiness") {
  return (
    <JobReadiness
      resumeData={resumeData}
      onBack={() => setPage("dashboard")}
    />
  );
}
  // Mock Interview
  if (page === "interview") {
    return (
      <MockInterview
      resumeData={resumeData}
        onBack={() => setPage("dashboard")}
      />
    );
  }
  if (page === "github") {
  return (
    <GitHubAnalysis
      onBack={() => setPage("dashboard")}
    />
  );
}
if (page === "jobs") {
  return (
    <JobRecommendations
      resumeData={resumeData}
      onBack={() => setPage("dashboard")}
    />
  );
}
if (page === "assessment") {
  return (
    <SkillAssessment
      onBack={() => setPage("dashboard")}
    />
  );
}
if (page === "prediction") {
  return (
    <CareerPrediction
      resumeData={resumeData}
      onBack={() => setPage("dashboard")}
    />
  );
}
  // Home Page
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          AI Placement Assistant
        </div>

        <div className="nav-links">

          <button onClick={() => setPage("home")}>
            Home
          </button>

          <a href="#features">
            Features
          </a>

          <button onClick={() => setPage("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPage("login")}>
            Login
          </button>

        </div>

      </nav>

      {/* Hero */}
      <main>

        <section className="hero" id="home">

          <div className="hero-content">

            <p className="badge">
              AI Powered Career Platform
            </p>

            <h1>
              Get Placement Ready
              <br />
              With <span>AI</span>
            </h1>

            <p className="hero-text">
              Upload your resume, analyze job descriptions,
              check your ATS score, identify missing skills
              and prepare for interviews with AI.
            </p>

            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={() => setShowUpload(true)}
              >
                Analyze My Resume
              </button>

              <button
                className="secondary-btn"
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Features
              </button>

            </div>

          </div>

        </section>

        {/* Features */}
        <section
          className="features"
          id="features"
        >

          <h2>
            Everything You Need for Placement
          </h2>

          <div className="feature-grid">

            <div className="feature-card">
              <h3>📄 Resume Analyzer</h3>
              <p>
                Upload your resume and get AI-powered feedback.
              </p>
            </div>

            <div className="feature-card">
              <h3>🎯 ATS Score</h3>
              <p>
                Check how well your resume matches a job description.
              </p>
            </div>

            <div className="feature-card">
              <h3>💡 Skill Matching</h3>
              <p>
                Find matching skills and discover missing skills.
              </p>
            </div>

            <div className="feature-card">
              <h3>🤖 AI Suggestions</h3>
              <p>
                Get personalized suggestions to improve your resume.
              </p>
            </div>

            <div className="feature-card">
              <h3>🎤 Interview Preparation</h3>
              <p>
                Generate interview questions based on your target job.
              </p>
            </div>

            <div className="feature-card">
              <h3>📊 Application Tracker</h3>
              <p>
                Track your job applications from one dashboard.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;