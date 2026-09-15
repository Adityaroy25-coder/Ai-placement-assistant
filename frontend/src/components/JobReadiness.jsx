import { useState } from "react";

function JobReadiness({ resumeData, onBack }) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const calculateReadiness = () => {
    const resumeSkills =
      resumeData && Array.isArray(resumeData.skills)
        ? resumeData.skills
        : [];

    const applications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

  const savedJobAnalysis =
  JSON.parse(
    localStorage.getItem("jobAnalysis") || "null"
  );

const jd = jobDescription.toLowerCase();

const savedMatchScore =
  savedJobAnalysis?.matchScore || 0;

    // -----------------------------
    // SKILL MATCH
    // -----------------------------

    const skillDatabase = [
      "Java",
      "C++",
      "Python",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "Spring Boot",
      "SQL",
      "MongoDB",
      "MySQL",
      "Git",
      "GitHub",
      "Docker",
      "AWS",
      "REST API",
      "Data Structures",
      "Algorithms",
      "DSA",
      "OOP",
      "HTML",
      "CSS",
      "TypeScript",
      "Machine Learning",
      "System Design"
    ];

    const requiredSkills = skillDatabase.filter((skill) =>
      jd.includes(skill.toLowerCase())
    );

    const normalizedResume = resumeSkills.map((skill) =>
      skill.toLowerCase().trim()
    );

    const matchingSkills = requiredSkills.filter((skill) => {
      const skillLower = skill.toLowerCase();

      return normalizedResume.some(
        (resumeSkill) =>
          resumeSkill === skillLower ||
          resumeSkill.includes(skillLower) ||
          skillLower.includes(resumeSkill)
      );
    });

   const skillScore =
  savedMatchScore > 0
    ? savedMatchScore
    : requiredSkills.length > 0
      ? Math.round(
          (matchingSkills.length /
            requiredSkills.length) *
            100
        )
      : resumeSkills.length > 0
        ? 70
        : 0;

    // -----------------------------
    // RESUME SCORE
    // -----------------------------

let resumeScore = 0;

if (resumeData) {
  resumeScore = 50;

  if (resumeSkills.length >= 10) {
    resumeScore += 30;
  } else if (resumeSkills.length >= 5) {
    resumeScore += 20;
  } else if (resumeSkills.length >= 3) {
    resumeScore += 10;
  }

  if (resumeData.name) {
    resumeScore += 5;
  }

  if (
    resumeData.email ||
    resumeData.phone
  ) {
    resumeScore += 5;
  }
}

resumeScore = Math.min(
  resumeScore,
  100
);

    // -----------------------------
    // DSA SCORE
    // -----------------------------

    const hasDSA = normalizedResume.some(
      (skill) =>
        skill.includes("dsa") ||
        skill.includes("data structure") ||
        skill.includes("algorithm")
    );

    const dsaScore = hasDSA ? 80 : 35;

    // -----------------------------
    // PROJECT SCORE
    // -----------------------------

    const hasProjects =
      resumeData &&
      (
        resumeData.projects ||
        resumeData.project ||
        resumeData.projectCount
      );

    const projectScore = hasProjects ? 85 : 50;

    // Since this AI Placement Assistant itself is a project
    const finalProjectScore = Math.max(
      projectScore,
      70
    );

    // -----------------------------
    // INTERVIEW SCORE
    // -----------------------------

    const interviewScore =
      Number(
        localStorage.getItem("interviewScore")
      ) || 0;

    const finalInterviewScore =
      interviewScore > 0
        ? interviewScore * 10
        : 50;

    // -----------------------------
    // APPLICATION SCORE
    // -----------------------------

    let applicationScore = 30;

    if (applications.length >= 10) {
      applicationScore = 100;
    } else if (applications.length >= 5) {
      applicationScore = 80;
    } else if (applications.length >= 2) {
      applicationScore = 60;
    } else if (applications.length === 1) {
      applicationScore = 45;
    }

    // -----------------------------
    // FINAL SCORE
    // -----------------------------

    const finalScore = Math.round(
      resumeScore * 0.20 +
      skillScore * 0.25 +
      dsaScore * 0.20 +
      finalProjectScore * 0.15 +
      finalInterviewScore * 0.10 +
      applicationScore * 0.10
    );
localStorage.setItem(
  "jobReadiness",
  JSON.stringify({
    finalScore,
    resumeScore,
    skillScore,
    dsaScore,
    projectScore: finalProjectScore,
    interviewScore: finalInterviewScore,
    applicationScore,
    updatedAt: new Date().toISOString(),
  })
);
    // -----------------------------
    // STRENGTHS
    // -----------------------------

    const strengths = [];

    if (resumeScore >= 70) {
      strengths.push("Resume foundation");
    }

    if (skillScore >= 70) {
      strengths.push("Good skill match");
    }

    if (dsaScore >= 70) {
      strengths.push("DSA preparation");
    }

    if (finalProjectScore >= 70) {
      strengths.push("Project experience");
    }

    if (applications.length >= 2) {
      strengths.push("Active job applications");
    }

    // -----------------------------
    // WEAKNESSES
    // -----------------------------

    const weaknesses = [];

    if (resumeScore < 70) {
      weaknesses.push("Improve resume");
    }

    if (skillScore < 70) {
      weaknesses.push("Learn missing job skills");
    }

    if (dsaScore < 70) {
      weaknesses.push("Practice DSA");
    }

    if (finalProjectScore < 70) {
      weaknesses.push("Build more projects");
    }

    if (finalInterviewScore < 70) {
      weaknesses.push("Practice mock interviews");
    }

    if (applications.length < 2) {
      weaknesses.push("Apply to more opportunities");
    }

    setResult({
      finalScore,
      resumeScore,
      skillScore,
      dsaScore,
      projectScore: finalProjectScore,
      interviewScore: finalInterviewScore,
      applicationScore,
      strengths,
      weaknesses,
      matchingSkills,
      requiredSkills
    });
  };

  const getStatus = (score) => {
    if (score >= 80) {
      return "🔥 Excellent";
    }

    if (score >= 65) {
      return "👍 Good";
    }

    if (score >= 50) {
      return "⚠️ Needs Improvement";
    }

    return "🚨 Beginner";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb"
      }}
    >
      <button
        onClick={onBack}
        style={{
          padding: "10px 18px",
          marginBottom: "25px",
          cursor: "pointer"
        }}
      >
        ← Back to Dashboard
      </button>

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto"
        }}
      >
        <h1>📊 Job Readiness Score</h1>

        <p>
          Measure how prepared you are for your target
          software development role.
        </p>

        {/* Input */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            marginTop: "25px",
            boxShadow:
              "0 5px 25px rgba(0,0,0,0.08)"
          }}
        >
          <h2>🎯 Target Job</h2>

          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste your target job description..."
            rows="8"
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              resize: "vertical"
            }}
          />

          <button
            onClick={calculateReadiness}
            style={{
              marginTop: "15px",
              padding: "13px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            📊 Calculate Readiness
          </button>
        </div>

        {result && (
          <>
            {/* Main Score */}
            <div
              style={{
                background: "white",
                padding: "35px",
                borderRadius: "15px",
                marginTop: "25px",
                textAlign: "center",
                boxShadow:
                  "0 5px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>Your Job Readiness</h2>

              <div
                style={{
                  fontSize: "64px",
                  fontWeight: "bold",
                  margin: "15px"
                }}
              >
                {result.finalScore}
                <span
                  style={{
                    fontSize: "25px"
                  }}
                >
                  /100
                </span>
              </div>

              <h3>
                {getStatus(result.finalScore)}
              </h3>
            </div>

            {/* Breakdown */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                marginTop: "25px",
                boxShadow:
                  "0 5px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>📈 Score Breakdown</h2>

              <div style={{ marginTop: "20px" }}>
                <ScoreRow
                  name="Resume Quality"
                  score={result.resumeScore}
                />

                <ScoreRow
                  name="Skill Match"
                  score={result.skillScore}
                />

                <ScoreRow
                  name="DSA Preparation"
                  score={result.dsaScore}
                />

                <ScoreRow
                  name="Projects"
                  score={result.projectScore}
                />

                <ScoreRow
                  name="Interview Preparation"
                  score={result.interviewScore}
                />

                <ScoreRow
                  name="Application Activity"
                  score={result.applicationScore}
                />
              </div>
            </div>

            {/* Strengths */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                marginTop: "25px",
                boxShadow:
                  "0 5px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>💪 Your Strengths</h2>

              {result.strengths.length > 0 ? (
                result.strengths.map(
                  (strength, index) => (
                    <p key={index}>
                      ✅ {strength}
                    </p>
                  )
                )
              ) : (
                <p>
                  Keep improving to build strong areas.
                </p>
              )}
            </div>

            {/* Weaknesses */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                marginTop: "25px",
                boxShadow:
                  "0 5px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>⚠️ Areas to Improve</h2>

              {result.weaknesses.length > 0 ? (
                result.weaknesses.map(
                  (weakness, index) => (
                    <p key={index}>
                      🔧 {weakness}
                    </p>
                  )
                )
              ) : (
                <p>
                  🎉 Excellent! No major weaknesses detected.
                </p>
              )}
            </div>

            {/* Matching Skills */}
            {result.matchingSkills.length > 0 && (
              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "15px",
                  marginTop: "25px",
                  boxShadow:
                    "0 5px 25px rgba(0,0,0,0.08)"
                }}
              >
                <h2>🎯 Target Job Skills</h2>

                <p>
                  Matching skills:{" "}
                  <strong>
                    {result.matchingSkills.length}
                  </strong>{" "}
                  /{" "}
                  {result.requiredSkills.length}
                </p>

                {result.matchingSkills.map(
                  (skill, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        padding: "8px 14px",
                        margin: "5px",
                        borderRadius: "20px",
                        background: "#e8f7ed"
                      }}
                    >
                      ✓ {skill}
                    </span>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ScoreRow({ name, score }) {
  return (
    <div
      style={{
        marginBottom: "20px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "7px"
        }}
      >
        <strong>{name}</strong>

        <strong>{score}/100</strong>
      </div>

      <div
        style={{
          height: "10px",
          background: "#e5e7eb",
          borderRadius: "10px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: "#2563eb",
            borderRadius: "10px"
          }}
        />
      </div>
    </div>
  );
}

export default JobReadiness;