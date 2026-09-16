import API_BASE_URL from "../api";
import React, { useState } from "react";

function JobRecommendations({ resumeData, onBack }) {
  const [query, setQuery] = useState("Java Developer");
  const [location, setLocation] = useState("Delhi");
  const [autoMode, setAutoMode] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [minSalary, setMinSalary] = useState("");
  const [jobType, setJobType] = useState("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minMatch, setMinMatch] = useState(0);

  // Resume skills
  const resumeSkills = (resumeData?.skills || []).map((skill) =>
    skill.toLowerCase().trim()
  );

  // ==========================================
  // GET RECOMMENDED ROLE
  // ==========================================

  const getRecommendedRole = () => {
    const skills = resumeSkills;

    // Full Stack first
    if (
      skills.includes("react") &&
      skills.includes("node.js")
    ) {
      return "Full Stack Developer";
    }

    // Java Developer
    if (
      skills.includes("java") &&
      (
        skills.includes("dsa") ||
        skills.includes("oop")
      )
    ) {
      return "Java Developer";
    }

    // Frontend
    if (
      skills.includes("react") &&
      skills.includes("javascript")
    ) {
      return "Frontend Developer";
    }

    // Backend
    if (
      skills.includes("node.js") ||
      skills.includes("mongodb") ||
      skills.includes("rest api")
    ) {
      return "Backend Developer";
    }

    // Data Science
    if (
      skills.includes("python") &&
      skills.includes("machine learning")
    ) {
      return "Data Scientist";
    }

    // C++ + DSA
    if (
      skills.includes("c++") &&
      skills.includes("dsa")
    ) {
      return "Software Engineer";
    }

    return "Software Developer";
  };

  // ==========================================
  // SMART RESUME-JOB MATCH
  // ==========================================

  const calculateMatch = (job) => {
    if (resumeSkills.length === 0) {
      return 0;
    }

    const jobText = `
      ${job.title || ""}
      ${job.description || ""}
      ${job.category || ""}
      ${job.company || ""}
    `.toLowerCase();

    // Skill aliases
    const skillAliases = {
      javascript: [
        "javascript",
        "js",
      ],

      "node.js": [
        "node.js",
        "nodejs",
        "node",
      ],

      mongodb: [
        "mongodb",
        "mongo db",
        "mongo",
      ],

      react: [
        "react",
        "react.js",
        "reactjs",
      ],

      "express.js": [
        "express.js",
        "express",
      ],

      "rest api": [
        "rest api",
        "restful api",
        "rest",
      ],

      "c++": [
        "c++",
        "cpp",
      ],

      "c#": [
        "c#",
        "csharp",
      ],

      sql: [
        "sql",
        "mysql",
        "postgresql",
        "postgres",
      ],

      java: [
        "java",
      ],

      python: [
        "python",
      ],

      html: [
        "html",
        "html5",
      ],

      css: [
        "css",
        "css3",
      ],

      dsa: [
        "dsa",
        "data structures",
        "data structures and algorithms",
        "algorithms",
      ],

      oop: [
        "oop",
        "object oriented programming",
        "object-oriented programming",
      ],

      "spring boot": [
        "spring boot",
        "spring",
      ],

      docker: [
        "docker",
        "containerization",
      ],

      aws: [
        "aws",
        "amazon web services",
      ],

      git: [
        "git",
        "github",
        "version control",
      ],
    };

    let matched = 0;

    resumeSkills.forEach((skill) => {
      const normalizedSkill = skill
        .toLowerCase()
        .trim();

      const aliases =
        skillAliases[normalizedSkill] || [
          normalizedSkill,
        ];

      const isMatched = aliases.some((alias) =>
        jobText.includes(alias)
      );

      if (isMatched) {
        matched++;
      }
    });

    // Skill score = 80%
    const skillScore =
      (matched / resumeSkills.length) * 80;

    // Job title relevance = 10%
    const titleText = (
      job.title || ""
    ).toLowerCase();

    let roleBonus = 0;

    if (
      titleText.includes("developer") ||
      titleText.includes("engineer") ||
      titleText.includes("software")
    ) {
      roleBonus = 10;
    }

    // Category relevance = 10%
    const categoryText = (
      job.category || ""
    ).toLowerCase();

    let categoryBonus = 0;

    if (
      categoryText.includes("it") ||
      categoryText.includes("software") ||
      categoryText.includes("technology")
    ) {
      categoryBonus = 10;
    }

    return Math.min(
      100,
      Math.round(
        skillScore +
        roleBonus +
        categoryBonus
      )
    );
  };

  // ==========================================
  // SEARCH REAL JOBS
  // ==========================================

  const searchJobs = async () => {
    if (!query.trim()) {
      setError("Please enter a job role.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter a location.");
      return;
    }

    setLoading(true);
    setError("");
    setJobs([]);

    try {
     const response = await fetch(
  `${API_BASE_URL}/api/jobs/search?query=${encodeURIComponent(
    query
  )}&location=${encodeURIComponent(location)}`
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch jobs."
        );
      }

      const jobsWithMatch = (data.jobs || [])
        .map((job) => ({
          ...job,
          matchScore: calculateMatch(job),
        }))
        .sort(
          (a, b) =>
            b.matchScore - a.matchScore
        );

      setJobs(jobsWithMatch);

      // Save top 5 jobs
      localStorage.setItem(
        "recommendedJobs",
        JSON.stringify(
          jobsWithMatch.slice(0, 5)
        )
      );
    } catch (err) {
      console.error(
        "Job Search Error:",
        err
      );

      setError(
        err.message ||
          "Unable to fetch jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESUME BASED JOB RECOMMENDATION
  // ==========================================

  const searchRecommendedJobs = async () => {
    if (resumeSkills.length === 0) {
      setError(
        "Please upload and analyze your resume first."
      );
      return;
    }

    const recommendedRole =
      getRecommendedRole();

    setQuery(recommendedRole);
    setAutoMode(true);
    setLoading(true);
    setError("");
    setJobs([]);

    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/search?query=${encodeURIComponent(
          recommendedRole
        )}&location=${encodeURIComponent(location)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch recommended jobs."
        );
      }

      const jobsWithMatch = (data.jobs || [])
        .map((job) => ({
          ...job,
          matchScore: calculateMatch(job),
        }))
        .sort(
          (a, b) =>
            b.matchScore - a.matchScore
        );

      setJobs(jobsWithMatch);

      // Save top 5 recommended jobs
      localStorage.setItem(
        "recommendedJobs",
        JSON.stringify(
          jobsWithMatch.slice(0, 5)
        )
      );
    } catch (err) {
      console.error(
        "Recommended Job Error:",
        err
      );

      setError(
        err.message ||
          "Unable to fetch recommended jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // APPLY FILTERS
  // ==========================================

  const filteredJobs = jobs.filter(
    (job) => {
      // Resume Match
      if (
        job.matchScore <
        Number(minMatch)
      ) {
        return false;
      }

      // Salary
      if (
        minSalary &&
        job.salaryMax &&
        job.salaryMax <
          Number(minSalary) * 100000
      ) {
        return false;
      }

      // Remote
      if (remoteOnly) {
        const jobText = `
          ${job.title || ""}
          ${job.description || ""}
          ${job.location || ""}
        `.toLowerCase();

        if (
          !jobText.includes("remote")
        ) {
          return false;
        }
      }

      // Job Type
      if (jobType !== "All") {
        const type = `
          ${job.contractType || ""}
          ${job.contractTime || ""}
        `.toLowerCase();

        if (
          !type.includes(
            jobType.toLowerCase()
          )
        ) {
          return false;
        }
      }

      return true;
    }
  );

  // ==========================================
  // FORMAT SALARY
  // ==========================================

  const formatSalary = (job) => {
    if (
      !job.salaryMin &&
      !job.salaryMax
    ) {
      return "Salary not specified";
    }

    const min = job.salaryMin
      ? `₹${Math.round(
          job.salaryMin / 100000
        )} LPA`
      : "";

    const max = job.salaryMax
      ? `₹${Math.round(
          job.salaryMax / 100000
        )} LPA`
      : "";

    if (min && max) {
      return `${min} - ${max}`;
    }

    return min || max;
  };
const handleApply = (job) => {
  const existingApplications =
    JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

  const alreadyApplied =
    existingApplications.some(
      (application) =>
        application.jobId === job.id
    );

  if (alreadyApplied) {
    alert("You have already applied to this job.");
    
    if (job.url) {
      window.open(
        job.url,
        "_blank",
        "noopener,noreferrer"
      );
    }

    return;
  }

  const newApplication = {
    id: Date.now(),
    jobId: job.id,
    title: job.title,
    jobTitle: job.title,
    company: job.company,
    location: job.location,
    matchScore: job.matchScore || 0,
    salaryMin: job.salaryMin || null,
    salaryMax: job.salaryMax || null,
    url: job.url || null,
    status: "Applied",
    appliedDate: new Date().toISOString(),
    date: new Date().toISOString(),
  };

  const updatedApplications = [
    ...existingApplications,
    newApplication,
  ];

  localStorage.setItem(
    "applications",
    JSON.stringify(updatedApplications)
  );

  alert(
    `${job.title} at ${job.company} added to Applications!`
  );

  if (job.url) {
    window.open(
      job.url,
      "_blank",
      "noopener,noreferrer"
    );
  }
};
  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
      }}
    >

      {/* BACK BUTTON */}

      <button
        onClick={onBack}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "30px",
        }}
      >
        ← Back to Dashboard
      </button>

      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >

          <h1
            style={{
              fontSize: "42px",
            }}
          >
            💼 Real Job Search
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
            }}
          >
            Search real job listings and find
            jobs matching your resume.
          </p>

          {/* RESUME RECOMMENDATION BUTTON */}

          {resumeSkills.length > 0 && (
            <button
              onClick={searchRecommendedJobs}
              disabled={loading}
              style={{
                marginTop: "15px",
                padding: "13px 25px",
                border: "none",
                borderRadius: "8px",
                background: "#4f46e5",
                color: "white",
                fontSize: "16px",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              🤖 Find Jobs For My Resume
            </button>
          )}

          {/* AUTO MODE */}

          {autoMode && (
            <p
              style={{
                marginTop: "12px",
                color: "#555",
              }}
            >
              🎯 Recommended role based on
              your resume:{" "}
              <strong>
                {query}
              </strong>
            </p>
          )}

        </div>

        {/* SEARCH */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.08)",
            marginBottom: "25px",
          }}
        >

          <h2>
            🔎 Search Jobs
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr auto",
              gap: "15px",
              alignItems: "end",
            }}
          >

            {/* ROLE */}

            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Job Role
              </label>

              <input
                type="text"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Java Developer"
                style={{
                  width: "100%",
                  padding: "13px",
                  border:
                    "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing:
                    "border-box",
                }}
              />

            </div>

            {/* LOCATION */}

            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Delhi"
                style={{
                  width: "100%",
                  padding: "13px",
                  border:
                    "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing:
                    "border-box",
                }}
              />

            </div>

            {/* SEARCH BUTTON */}

            <button
              onClick={searchJobs}
              disabled={loading}
              style={{
                padding: "13px 25px",
                border: "none",
                borderRadius: "8px",
                background: "#111827",
                color: "white",
                fontSize: "16px",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading
                ? "Searching..."
                : "🔎 Search Jobs"}
            </button>

          </div>
        </div>

        {/* FILTERS */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "25px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >

          <h2>
            ⚙️ Filters
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >

            {/* SALARY */}

            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                💰 Minimum Salary
              </label>

              <select
                value={minSalary}
                onChange={(e) =>
                  setMinSalary(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border:
                    "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              >

                <option value="">
                  Any Salary
                </option>

                <option value="3">
                  ₹3 LPA+
                </option>

                <option value="5">
                  ₹5 LPA+
                </option>

                <option value="7">
                  ₹7 LPA+
                </option>

                <option value="10">
                  ₹10 LPA+
                </option>

                <option value="15">
                  ₹15 LPA+
                </option>

              </select>

            </div>

            {/* JOB TYPE */}

            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                💼 Job Type
              </label>

              <select
                value={jobType}
                onChange={(e) =>
                  setJobType(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border:
                    "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              >

                <option value="All">
                  All Types
                </option>

                <option value="Full Time">
                  Full Time
                </option>

                <option value="Part Time">
                  Part Time
                </option>

                <option value="Contract">
                  Contract
                </option>

              </select>

            </div>

            {/* MATCH */}

            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                📊 Minimum Resume Match
              </label>

              <select
                value={minMatch}
                onChange={(e) =>
                  setMinMatch(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border:
                    "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              >

                <option value="0">
                  Any Match
                </option>

                <option value="30">
                  30%+
                </option>

                <option value="50">
                  50%+
                </option>

                <option value="70">
                  70%+
                </option>

                <option value="80">
                  80%+
                </option>

              </select>

            </div>

            {/* REMOTE */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: "25px",
              }}
            >

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >

                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) =>
                    setRemoteOnly(
                      e.target.checked
                    )
                  }
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />

                🏠 Remote Only

              </label>

            </div>

          </div>

        </div>

        {/* RESUME SKILLS */}

        {resumeSkills.length > 0 && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "25px",
            }}
          >

            <h3>
              🎯 Your Resume Skills
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >

              {resumeSkills.map(
                (skill, index) => (
                  <span
                    key={index}
                    style={{
                      background:
                        "#e8f0fe",
                      padding:
                        "7px 12px",
                      borderRadius:
                        "20px",
                    }}
                  >
                    {resumeData.skills[index]}
                  </span>
                )
              )}

            </div>

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#b91c1c",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "25px",
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >

            <h2>
              🔄 Finding jobs...
            </h2>

            <p>
              Searching real job listings...
            </p>

          </div>
        )}

        {/* RESULTS */}

        {!loading &&
          filteredJobs.length > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >

                <h2>
                  🔥 {filteredJobs.length} Jobs
                  Found
                </h2>

                <span
                  style={{
                    color: "#666",
                  }}
                >
                  Sorted by resume match
                </span>

              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(340px, 1fr))",
                  gap: "22px",
                }}
              >

                {filteredJobs.map(
                  (job, index) => (
                    <div
                      key={
                        job.id || index
                      }
                      style={{
                        background:
                          "white",
                        padding:
                          "25px",
                        borderRadius:
                          "16px",
                        boxShadow:
                          "0 5px 20px rgba(0,0,0,0.08)",
                        display:
                          "flex",
                        flexDirection:
                          "column",
                      }}
                    >

                      {/* JOB HEADER */}

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          gap: "15px",
                        }}
                      >

                        <div>

                          <h2
                            style={{
                              marginTop: 0,
                              marginBottom:
                                "8px",
                            }}
                          >
                            {job.title}
                          </h2>

                          <p>
                            🏢{" "}
                            <strong>
                              {job.company}
                            </strong>
                          </p>

                          <p>
                            📍{" "}
                            {job.location}
                          </p>

                        </div>

                        {/* MATCH SCORE */}

                        <div
                          style={{
                            minWidth:
                              "65px",
                            height:
                              "65px",
                            borderRadius:
                              "50%",
                            background:
                              "#eef2ff",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontWeight:
                              "bold",
                            fontSize:
                              "17px",
                          }}
                        >
                          {job.matchScore}%
                        </div>

                      </div>

                      <hr />

                      {/* SALARY */}

                      <p>
                        💰{" "}
                        <strong>
                          {formatSalary(
                            job
                          )}
                        </strong>
                      </p>

                      {/* TYPE */}

                      <p>
                        🕒{" "}
                        {job.contractType &&
                        job.contractType !==
                          "Not specified"
                          ? job.contractType
                          : job.contractTime}
                      </p>

                      {/* DESCRIPTION */}

                      <p
                        style={{
                          color: "#555",
                          lineHeight: "1.5",
                          display:
                            "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient:
                            "vertical",
                          overflow:
                            "hidden",
                        }}
                      >
                        {job.description}
                      </p>

                      {/* APPLY */}

                      <div
                        style={{
                          marginTop:
                            "auto",
                          paddingTop:
                            "15px",
                        }}
                      >

                       {job.url ? (
  <button
    onClick={() => handleApply(job)}
    style={{
      width: "100%",
      padding: "12px",
      background: "#111827",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "16px",
      cursor: "pointer",
    }}
  >
    🚀 Apply Now
  </button>
) : (
  <button
    disabled
    style={{
      width: "100%",
      padding: "12px",
    }}
  >
    Application Link Unavailable
  </button>
)}

                      </div>

                    </div>
                  )
                )}

              </div>
            </>
          )}

        {/* NO FILTERED RESULTS */}

        {!loading &&
          jobs.length > 0 &&
          filteredJobs.length === 0 && (
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >

              <h2>
                😕 No Matching Jobs
              </h2>

              <p>
                Try reducing your filters or
                searching for another role.
              </p>

            </div>
          )}

        {/* INITIAL STATE */}

        {!loading &&
          !error &&
          jobs.length === 0 && (
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >

              <h2>
                🔎 Search for Jobs
              </h2>

              <p>
                Enter a job role and location,
                then click Search Jobs.
              </p>

            </div>
          )}

      </div>
    </div>
  );
}

export default JobRecommendations;