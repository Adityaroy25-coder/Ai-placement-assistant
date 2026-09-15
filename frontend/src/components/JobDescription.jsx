import { useState } from "react";
import API_BASE_URL from "../../api";
import "./JobDescription.css";
function JobDescription({ resumeData, onBack }) {

  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/job/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
  jobDescription: jobDescription,
  resumeData: resumeData
})
        }
      );

      const data = await response.json();

      console.log("Job Analysis:", data);

      if (data.success) {
  setResult(data);

  // Save latest job analysis for Dashboard
  localStorage.setItem(
    "jobAnalysis",
    JSON.stringify(data)
  );
} else {
        alert(data.message || "Analysis failed");
      }

    } catch (error) {
      console.error("Job Analysis Error:", error);
      alert("Failed to analyze job description.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
  <div className="job-page">

    <button
      className="back-btn"
      onClick={onBack}
    >
      ← Back to Dashboard
    </button>

    <div className="job-card">

        <div className="job-icon">💼</div>

        <h1>Job Description</h1>

        <p>
          Paste the job description to identify required skills
          and compare them with your resume.
        </p>

        <textarea
          className="job-textarea"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          className="job-analyze-btn"
          onClick={handleAnalyzeJob}
          disabled={analyzing}
        >
          {analyzing
            ? "Analyzing..."
            : "Analyze Job Description"}
        </button>

        {result && (
  <div className="job-result">

    <h2>ATS / Match Score: {result.matchScore}%</h2>

    <h3>Required Skills</h3>

    <div className="skill-list">
      {(result.requiredSkills || result.skills || []).map(
        (skill, index) => (
          <span className="skill-tag" key={index}>
            {skill}
          </span>
        )
      )}
    </div>

    <h3>Matching Skills</h3>

    <div className="skill-list">
      {result.matchingSkills?.length > 0 ? (
        result.matchingSkills.map((skill, index) => (
          <span className="skill-tag" key={index}>
            ✓ {skill}
          </span>
        ))
      ) : (
        <p>No matching skills found.</p>
      )}
    </div>

    <h3>Missing Skills</h3>

    <div className="skill-list">
      {result.missingSkills?.length > 0 ? (
        result.missingSkills.map((skill, index) => (
          <span className="skill-tag" key={index}>
            ⚠ {skill}
          </span>
        ))
      ) : (
        <p>No missing skills found.</p>
      )}
    </div>

  </div>
)}
      </div>
    </div>
  );
}

export default JobDescription;