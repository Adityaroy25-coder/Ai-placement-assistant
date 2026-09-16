import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({
  user,
  resumeData,
  jobAnalysis,
  onResumeAnalysis,
  onLogout,
  setPage,
}) {
 const [applications, setApplications] = useState([]);
 const [careerPrediction, setCareerPrediction] = useState(null);
 const [careerRoadmap, setCareerRoadmap] = useState(null);
 const [interviewResult, setInterviewResult] = useState(null);
 // Load applications from localStorage
// Load latest dashboard data from localStorage
useEffect(() => {
  const savedApplications =
    JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

  setApplications(savedApplications);

  const savedRecommendedJobs =
    JSON.parse(
      localStorage.getItem("recommendedJobs") || "[]"
    );

  setRecommendedJobs(savedRecommendedJobs);

  const savedCareerPrediction =
    JSON.parse(
      localStorage.getItem("careerPrediction") || "null"
    );

  if (savedCareerPrediction) {
    setCareerPrediction(savedCareerPrediction);
  }
  const savedCareerRoadmap =
  JSON.parse(
    localStorage.getItem("careerRoadmap") || "null"
  );

if (savedCareerRoadmap) {
  setCareerRoadmap(savedCareerRoadmap);
}
const savedInterviewResult =
  JSON.parse(
    localStorage.getItem("interviewResult") || "null"
  );

if (savedInterviewResult) {
  setInterviewResult(savedInterviewResult);
}
}, []);

  // Resume skills
  const resumeSkills = Array.isArray(resumeData?.skills)
    ? resumeData.skills
    : [];
const missingSkills = Array.isArray(
  jobAnalysis?.missingSkills
)
  ? jobAnalysis.missingSkills
  : [];
  const matchingSkills = Array.isArray(
  jobAnalysis?.matchingSkills
)
  ? jobAnalysis.matchingSkills
  : [];
  // Resume score / ATS score
  const atsScore =
    resumeData?.atsScore ||
    resumeData?.resumeScore ||
    78;

  // Applications count
  const applicationCount = applications.length;

  // Calculate a simple dynamic readiness score
  const calculateReadiness = () => {
    let score = 0;

    // Resume
    if (resumeData) {
      score += 30;
    }

    // Skills
    if (resumeSkills.length >= 5) {
      score += 20;
    } else {
      score += resumeSkills.length * 3;
    }

    // Applications
    if (applicationCount >= 5) {
      score += 20;
    } else {
      score += applicationCount * 4;
    }

    // Interview / preparation
    const assessmentResult =
      JSON.parse(localStorage.getItem("assessmentResult"));

    if (assessmentResult) {
      score += 15;
    }

    // GitHub
    const githubResult =
      JSON.parse(localStorage.getItem("githubAnalysis"));

    if (githubResult) {
      score += 15;
    }

    return Math.min(score, 100);
  };

  const savedReadiness =
  JSON.parse(
    localStorage.getItem("jobReadiness") || "null"
  );

const readinessScore =
  savedReadiness?.finalScore ??
  calculateReadiness();
const placementProgress = Math.min(
  100,
  Math.round(
    readinessScore * 0.5 +
    (resumeData ? 20 : 0) +
    Math.min(applicationCount * 2, 10) +
    (careerPrediction ? 10 : 0) +
    (careerRoadmap ? 10 : 0)
  )
);
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="dashboard-logo">
          AI Placement
          <span>Assistant</span>
        </div>

        <nav>

          <button
            className="active"
            onClick={() => setPage("dashboard")}
          >
            📊 Dashboard
          </button>

          <button onClick={onResumeAnalysis}>
            📄 Resume Analysis
          </button>

          <button onClick={() => setPage("job")}>
            🎯 Job Matching
          </button>

          <button onClick={() => setPage("skill-gap")}>
            💡 Skill Gap
          </button>

          <button onClick={() => setPage("roadmap")}>
            🗺️ Career Roadmap
          </button>

          <button onClick={() => setPage("interview")}>
            🎤 Interview
          </button>

          <button onClick={() => setPage("applications")}>
            💼 Applications
          </button>

          <button onClick={() => setPage("readiness")}>
            📊 Job Readiness
          </button>

          <button onClick={() => setPage("github")}>
            💻 GitHub Analysis
          </button>

          <button onClick={() => setPage("jobs")}>
            💼 Job Recommendations
          </button>

          <button onClick={() => setPage("assessment")}>
            🧠 Skill Assessment
          </button>

          <button onClick={() => setPage("prediction")}>
            🔮 Career Prediction
          </button>

        </nav>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Topbar */}
        <header className="dashboard-header">

          <div
            onClick={() => setPage("dashboard")}
            style={{ cursor: "pointer" }}
          >
            <h1>Dashboard</h1>
            <p>Track your placement preparation</p>
          </div>

          <div className="user-info">

            <div className="avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.name || "Student"}
              </strong>

              <small>
                {user?.email || "student@example.com"}
              </small>
            </div>

          </div>

        </header>

        {/* Welcome */}
        <section className="welcome-card">

          <div>

            <span>
              AI Career Intelligence
            </span>

            <h2>
              Welcome back, {user?.name || "Student"} 👋
            </h2>

            <p>
              Let's improve your placement readiness
              and get you closer to your dream job.
            </p>

          </div>

          <div className="readiness-score">

            <small>
              Job Readiness
            </small>

            <strong>
              {readinessScore}
            </strong>

            <span>
              /100
            </span>

          </div>

        </section>

        {/* Stats */}
        <section className="stats-grid">

          <div className="stat-card">

            <span>📄</span>

            <div>

              <small>
                ATS Score
              </small>

              <h3>
                {resumeData ? `${atsScore}%` : "--"}
              </h3>

            </div>

          </div>

          <div className="stat-card">

            <span>💡</span>

            <div>

              <small>
                Skills Found
              </small>

              <h3>
                {resumeSkills.length}
              </h3>

            </div>

          </div>

          <div className="stat-card">

  <span>⚠️</span>

  <div>

    <small>
      Missing Skills
    </small>

    <h3>
      {jobAnalysis
        ? missingSkills.length
        : "--"}
    </h3>

  </div>

</div>

          <div className="stat-card">

            <span>💼</span>

            <div>

              <small>
                Applications
              </small>

              <h3>
                {applicationCount}
              </h3>

            </div>

          </div>

        </section>

        {/* Main Grid */}
        <section className="dashboard-grid">

          {/* Resume */}
          <div className="dashboard-card">

            <div className="card-header">

              <h3>
                📄 Resume Analysis
              </h3>

              <span>
                {resumeData
                  ? `${atsScore}%`
                  : "Not analyzed"}
              </span>

            </div>
{jobAnalysis && (
  <p>
    🎯 Job Match Score:{" "}
    <strong>{jobAnalysis.matchScore}%</strong>
  </p>
)}
            <p>
              {resumeData
                ? "Your resume has been analyzed. Continue improving your skills and projects."
                : "Upload your resume to analyze your skills, experience and placement readiness."}
            </p>

            <button
              className="primary-action"
              onClick={onResumeAnalysis}
            >
              {resumeData
                ? "Analyze Again"
                : "Analyze Resume"}
            </button>

          </div>

         {/* Skill Gap */}
<div className="dashboard-card">

  <div className="card-header">

    <h3>
      💡 Skill Gap
    </h3>

    <span>
      {jobAnalysis
        ? `${missingSkills.length} missing`
        : "Analyze a job"}
    </span>

  </div>

  <div className="skill-list">

    {missingSkills.length > 0 ? (
      missingSkills
        .slice(0, 6)
        .map((skill, index) => (
          <span key={index}>
            {skill}
          </span>
        ))
    ) : jobAnalysis ? (
      <p>
        🎉 No missing skills found!
      </p>
    ) : (
      <p>
        Analyze a job description to see your skill gaps.
      </p>
    )}

  </div>

  <button
    className="secondary-action"
    onClick={() => setPage("job")}
  >
    Analyze Job
  </button>

</div>
{/* Career Roadmap */}
<div className="dashboard-card wide-card">
  <div className="card-header">
    <h3>🗺️ Personalized Career Roadmap</h3>

    <span>
      {careerRoadmap?.targetRole || "AI Generated"}
    </span>
  </div>

  {careerRoadmap?.roadmapSteps?.length > 0 ? (
    <div className="roadmap">
      {careerRoadmap.roadmapSteps
        .slice(0, 3)
        .map((step, index) => (
          <div
            className={`roadmap-step ${
              index === 0 ? "completed" : ""
            }`}
            key={step.number || index}
          >
            <div className="step-number">
              {index === 0 ? "✓" : index + 1}
            </div>

            <div>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
    </div>
  ) : (
    <>
      <p>
        Generate your personalized roadmap based on your
        career prediction and missing skills.
      </p>

      <button
        className="secondary-action"
        onClick={() => setPage("roadmap")}
      >
        🗺️ Generate Roadmap
      </button>
    </>
  )}
</div>

{/* Career Prediction */}
<div className="dashboard-card">
  <div className="card-header">
    <h3>🔮 Career Prediction</h3>

    {careerPrediction?.topScore != null && (
      <span>
        {careerPrediction.topScore}%
      </span>
    )}
  </div>

  {careerPrediction?.topCareer ? (
    <>
      <h2 style={{ marginTop: "15px" }}>
        {careerPrediction.topCareer}
      </h2>

      <p>
        Based on your resume skills, assessment,
        job match and overall readiness.
      </p>

      <button
        className="primary-action"
        onClick={() => setPage("prediction")}
      >
        View Career Prediction
      </button>
    </>
  ) : (
    <>
      <p>
        Analyze your resume and complete your
        skill assessment to get a personalized
        career prediction.
      </p>

      <button
        className="primary-action"
        onClick={() => setPage("prediction")}
      >
        🔮 Predict My Career
      </button>
    </>
  )}
</div>
{/* Placement Progress */}
<div className="dashboard-card wide-card placement-progress-card">
  <div className="card-header">
    <h3>📊 Placement Progress</h3>
    <span>{placementProgress}%</span>
  </div>

  <div className="progress-container">
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{
          width: `${placementProgress}%`,
        }}
      ></div>
    </div>

    <div className="progress-labels">
      <span>Getting Started</span>
      <strong>{placementProgress}% Complete</strong>
      <span>Placement Ready</span>
    </div>
  </div>

  <p className="progress-message">
    {placementProgress >= 80
      ? "🚀 You are highly prepared for placement. Start applying actively!"
      : placementProgress >= 60
      ? "💪 Good progress! Strengthen your remaining skills and keep applying."
      : placementProgress >= 40
      ? "📚 You are making progress. Focus on your skill gaps and interview preparation."
      : "🎯 Build your resume, skills and projects to start your placement journey."}
  </p>
</div>
          {/* Interview Preparation */}
<div className="dashboard-card">
  <div className="card-header">
    <h3>🎤 Interview Preparation</h3>

    <span>
      {interviewResult
        ? `${interviewResult.score || 0}%`
        : "Not Started"}
    </span>
  </div>

  {interviewResult ? (
    <>
      <div className="dashboard-score">
        {interviewResult.score || 0}%
      </div>

      <p>
        {interviewResult.score >= 80
          ? "🚀 Excellent interview performance!"
          : interviewResult.score >= 60
          ? "💪 Good performance. Keep practicing."
          : "📚 More practice is recommended before interviews."}
      </p>

      <button
        className="secondary-action"
        onClick={() => setPage("interview")}
      >
        🎤 Practice Again
      </button>
    </>
  ) : (
    <>
      <p>
        Test your technical knowledge with an AI-style
        mock interview based on your skills.
      </p>

      <button
        className="secondary-action"
        onClick={() => setPage("interview")}
      >
        🚀 Start Mock Interview
      </button>
    </>
  )}
</div>

          {/* Job Recommendations */}
<div className="dashboard-card">

  <div className="card-header">

    <h3>
      💼 Recommended Jobs
    </h3>

    <span>
      {recommendedJobs.length > 0
        ? `${recommendedJobs.length} jobs`
        : "AI Match"}
    </span>

  </div>

  {recommendedJobs.length > 0 ? (
    recommendedJobs
      .slice(0, 3)
      .map((job, index) => (
        <div
          className="job-item"
          key={job.id || index}
        >

          <div>
            <strong>
              {job.title}
            </strong>

            <small>
              {job.company || "Company"}
            </small>
          </div>

          <span>
            {job.matchScore || 0}% Match
          </span>

        </div>
      ))
  ) : (
    <p>
      Find jobs based on your resume to see
      personalized recommendations here.
    </p>
  )}

  <button
    className="secondary-action"
    onClick={() => setPage("jobs")}
  >
    {recommendedJobs.length > 0
      ? "View All Jobs"
      : "Find Jobs For Me"}
  </button>

</div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;