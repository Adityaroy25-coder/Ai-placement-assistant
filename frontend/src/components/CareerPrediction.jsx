import React, { useState } from "react";

function CareerPrediction({ resumeData, onBack }) {
  const [prediction, setPrediction] = useState(null);

  const careerRoles = [
    {
      role: "Java Developer",
      skills: ["java", "oop", "dsa", "sql", "git"],
      description:
        "Develop backend applications and enterprise software using Java.",
      roadmap:
        "Java → OOP → DSA → Spring Boot → REST API → SQL → Projects",
    },
    {
      role: "Frontend Developer",
      skills: [
        "html",
        "css",
        "javascript",
        "react",
        "git",
      ],
      description:
        "Build responsive and interactive web applications.",
      roadmap:
        "HTML → CSS → JavaScript → React → APIs → Projects",
    },
    {
      role: "Backend Developer",
      skills: [
        "java",
        "node.js",
        "mongodb",
        "rest api",
        "git",
      ],
      description:
        "Build APIs, server-side applications and database systems.",
      roadmap:
        "Programming → REST API → Node.js/Java → MongoDB/SQL → Projects",
    },
    {
      role: "Full Stack Developer",
      skills: [
        "html",
        "css",
        "javascript",
        "react",
        "node.js",
        "mongodb",
      ],
      description:
        "Develop complete frontend and backend web applications.",
      roadmap:
        "HTML/CSS → JavaScript → React → Node.js → MongoDB → Full Stack Projects",
    },
    {
      role: "Software Engineer",
      skills: [
        "java",
        "c++",
        "python",
        "dsa",
        "oop",
        "sql",
      ],
      description:
        "Design, develop and maintain software systems and applications.",
      roadmap:
        "Programming → OOP → DSA → DBMS → OS → Projects → Interviews",
    },
    {
      role: "Data/AI Engineer",
      skills: [
        "python",
        "sql",
        "machine learning",
        "data structures",
      ],
      description:
        "Work with data processing, machine learning and intelligent systems.",
      roadmap:
        "Python → Statistics → SQL → ML → Projects → Deployment",
    },
  ];

  const getAssessmentScore = (skill) => {
    const data = localStorage.getItem(`assessment_${skill}`);

    if (!data) return 0;

    try {
      return JSON.parse(data).percentage || 0;
    } catch {
      return 0;
    }
  };

 const calculateRoleScore = (role) => {
  const resumeSkills = (
    resumeData?.skills || []
  ).map((skill) =>
    skill.toLowerCase().trim()
  );

  if (resumeSkills.length === 0) {
    return 0;
  }

  const skillAliases = {
    "node.js": ["node.js", "nodejs", "node"],
    mongodb: ["mongodb", "mongo db", "mongo"],
    "express.js": ["express.js", "express"],
    "rest api": [
      "rest api",
      "restful api",
      "rest",
    ],
    dsa: [
      "dsa",
      "data structures",
      "algorithms",
      "data structures and algorithms",
    ],
    oop: [
      "oop",
      "object oriented programming",
      "object-oriented programming",
    ],
    sql: [
      "sql",
      "mysql",
      "postgresql",
      "postgres",
    ],
    react: [
      "react",
      "react.js",
      "reactjs",
    ],
    javascript: [
      "javascript",
      "js",
    ],
    "c++": ["c++", "cpp"],
    html: ["html", "html5"],
    css: ["css", "css3"],
    git: [
      "git",
      "github",
      "version control",
    ],
  };

  const isSkillMatched = (
    requiredSkill
  ) => {
    const aliases =
      skillAliases[requiredSkill] || [
        requiredSkill,
      ];

    return resumeSkills.some(
      (resumeSkill) =>
        aliases.includes(resumeSkill) ||
        aliases.some(
          (alias) =>
            resumeSkill.includes(alias) ||
            alias.includes(resumeSkill)
        )
    );
  };

  let matchedSkills = 0;

  role.skills.forEach((skill) => {
    if (isSkillMatched(skill)) {
      matchedSkills++;
    }
  });

  // Resume skills = 50%
  const resumeSkillScore =
    (matchedSkills / role.skills.length) *
    50;

  // Assessment = 20%
  const assessments = role.skills
    .map((skill) =>
      getAssessmentScore(skill)
    )
    .filter((score) => score > 0);

  let assessmentScore = 0;

  if (assessments.length > 0) {
    const averageAssessment =
      assessments.reduce(
        (a, b) => a + b,
        0
      ) / assessments.length;

    assessmentScore =
      averageAssessment * 0.20;
  }

  // Job Readiness = 15%
  const savedReadiness =
    JSON.parse(
      localStorage.getItem(
        "jobReadiness"
      ) || "null"
    );

  const readinessScore =
    savedReadiness?.finalScore || 0;

  const readinessContribution =
    readinessScore * 0.15;

  // Job Match = 15%
  const savedJobAnalysis =
    JSON.parse(
      localStorage.getItem(
        "jobAnalysis"
      ) || "null"
    );

  const jobMatchScore =
    savedJobAnalysis?.matchScore || 0;

  const jobMatchContribution =
    jobMatchScore * 0.15;

  return Math.min(
    100,
    Math.round(
      resumeSkillScore +
      assessmentScore +
      readinessContribution +
      jobMatchContribution
    )
  );
};
  
  const generatePrediction = () => {
    if (!resumeData?.skills?.length) {
      alert("Please upload your resume first.");
      return;
    }

    const predictions = careerRoles
      .map((role) => {
        const score = calculateRoleScore(role);

        const resumeSkills = resumeData.skills.map((skill) =>
          skill.toLowerCase().trim()
        );

        const matchedSkills = role.skills.filter((skill) =>
          resumeSkills.some(
            (resumeSkill) =>
              resumeSkill.includes(skill) ||
              skill.includes(resumeSkill)
          )
        );

        const missingSkills = role.skills.filter(
          (skill) =>
            !resumeSkills.some(
              (resumeSkill) =>
                resumeSkill.includes(skill) ||
                skill.includes(resumeSkill)
            )
        );

        return {
          ...role,
          score,
          matchedSkills,
          missingSkills,
        };
      })
      .sort((a, b) => b.score - a.score);

    setPrediction(predictions);
  };

  const getLevel = (score) => {
    if (score >= 80) return "Excellent Fit";
    if (score >= 60) return "Strong Fit";
    if (score >= 40) return "Moderate Fit";
    return "Needs Improvement";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
      }}
    >
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
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1 style={{ fontSize: "42px" }}>
            🔮 Career Prediction
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
            }}
          >
            Discover which career roles best match your
            current skills.
          </p>
        </div>

        {!prediction && (
          <div
            style={{
              background: "white",
              padding: "45px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "60px" }}>🎯</div>

            <h2>Analyze Your Career Fit</h2>

            <p
              style={{
                maxWidth: "650px",
                margin: "15px auto",
                color: "#555",
              }}
            >
              We'll compare your resume skills and skill
              assessment results with different technical
              career paths.
            </p>

            {resumeData?.skills?.length > 0 && (
              <p>
                <strong>
                  {resumeData.skills.length}
                </strong>{" "}
                skills detected in your resume.
              </p>
            )}

            <button
              onClick={generatePrediction}
              style={{
                marginTop: "20px",
                padding: "14px 30px",
                border: "none",
                borderRadius: "8px",
                background: "#111827",
                color: "white",
                fontSize: "17px",
                cursor: "pointer",
              }}
            >
              🔮 Predict My Career
            </button>
          </div>
        )}

        {prediction && (
          <>
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "16px",
                marginBottom: "30px",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,0.08)",
              }}
            >
              <h2>🏆 Best Career Match</h2>

              <h1 style={{ marginBottom: "10px" }}>
                {prediction[0].role}
              </h1>

              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                {prediction[0].score}%
              </div>

              <p>
                <strong>
                  {getLevel(prediction[0].score)}
                </strong>
              </p>

              <p>
                {prediction[0].description}
              </p>

              <h3>✅ Your Matching Skills</h3>

              <p>
                {prediction[0].matchedSkills.length > 0
                  ? prediction[0].matchedSkills.join(", ")
                  : "No major matching skills yet."}
              </p>

              <h3>📚 Skills to Improve</h3>

              <p>
                {prediction[0].missingSkills.length > 0
                  ? prediction[0].missingSkills.join(", ")
                  : "You have all major skills! 🎉"}
              </p>

              <h3>🗺️ Recommended Roadmap</h3>

              <p>{prediction[0].roadmap}</p>
            </div>

            <h2 style={{ marginBottom: "20px" }}>
              📊 Career Compatibility
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {prediction.map((item) => (
                <div
                  key={item.role}
                  style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "15px",
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <h2>{item.role}</h2>

                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      margin: "15px 0",
                    }}
                  >
                    {item.score}%
                  </div>

                  <p>
                    <strong>
                      {getLevel(item.score)}
                    </strong>
                  </p>

                  <p>{item.description}</p>

                  <h4>Matching Skills</h4>

                  <p>
                    {item.matchedSkills.length > 0
                      ? item.matchedSkills.join(", ")
                      : "None yet"}
                  </p>

                  <h4>Missing Skills</h4>

                  <p>
                    {item.missingSkills.length > 0
                      ? item.missingSkills.join(", ")
                      : "None 🎉"}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "35px",
              }}
            >
              <button
                onClick={() => setPrediction(null)}
                style={{
                  padding: "12px 25px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🔄 Analyze Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CareerPrediction;

