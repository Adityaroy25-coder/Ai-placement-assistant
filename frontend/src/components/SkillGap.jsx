import { useState } from "react";

function SkillGap({ resumeData, onBack }) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const analyzeSkillGap = () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    const resumeSkills =
      resumeData && Array.isArray(resumeData.skills)
        ? resumeData.skills
        : [];

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

    const jdLower = jobDescription.toLowerCase();

    const requiredSkills = skillDatabase.filter((skill) =>
      jdLower.includes(skill.toLowerCase())
    );

    const normalizedResumeSkills = resumeSkills.map((skill) =>
      skill.toLowerCase().trim()
    );

    const matchingSkills = requiredSkills.filter((skill) =>
      normalizedResumeSkills.some(
        (resumeSkill) =>
          resumeSkill === skill.toLowerCase() ||
          resumeSkill.includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(resumeSkill)
      )
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !matchingSkills.includes(skill)
    );

    const matchScore =
      requiredSkills.length > 0
        ? Math.round(
            (matchingSkills.length / requiredSkills.length) * 100
          )
        : 0;

    setResult({
      requiredSkills,
      matchingSkills,
      missingSkills,
      matchScore
    });
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
          maxWidth: "950px",
          margin: "0 auto"
        }}
      >
        <h1>🎯 Skill Gap Analysis</h1>

        <p>
          Compare your resume skills with the requirements
          of your target job.
        </p>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            marginTop: "25px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
          }}
        >
          <h2>Target Job Description</h2>

          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste the job description here..."
            rows="10"
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              resize: "vertical"
            }}
          />

          <button
            onClick={analyzeSkillGap}
            style={{
              marginTop: "15px",
              padding: "13px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            🔍 Analyze Skill Gap
          </button>
        </div>

        {result && (
          <>
            {/* Score */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                marginTop: "25px",
                textAlign: "center",
                boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>Job Skill Match</h2>

              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  margin: "15px"
                }}
              >
                {result.matchScore}%
              </div>

              <p>
                {result.matchScore >= 80
                  ? "🔥 Excellent skill match"
                  : result.matchScore >= 60
                  ? "👍 Good skill match"
                  : result.matchScore >= 40
                  ? "⚠️ Moderate skill gap"
                  : "🚨 Significant skill gap"}
              </p>
            </div>

            {/* Matching Skills */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                marginTop: "25px",
                boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>✅ Matching Skills</h2>

              {result.matchingSkills.length > 0 ? (
                <div style={{ marginTop: "15px" }}>
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
              ) : (
                <p>No matching skills found.</p>
              )}
            </div>

            {/* Missing Skills */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                marginTop: "25px",
                boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>⚠️ Missing Skills</h2>

              {result.missingSkills.length > 0 ? (
                <div style={{ marginTop: "15px" }}>
                  {result.missingSkills.map(
                    (skill, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "15px",
                          marginTop: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "10px"
                        }}
                      >
                        <strong>{skill}</strong>

                        <p style={{ marginBottom: 0 }}>
                          Recommended: Learn {skill},
                          practice it through a project,
                          and add it to your resume after
                          gaining practical experience.
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p>
                  🎉 No major missing skills detected!
                </p>
              )}
            </div>

            {/* Learning Roadmap */}
            {result.missingSkills.length > 0 && (
              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "15px",
                  marginTop: "25px",
                  boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
                }}
              >
                <h2>📚 Suggested Learning Plan</h2>

                {result.missingSkills.map(
                  (skill, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginTop: "20px"
                      }}
                    >
                      <strong>
                        {index + 1}.
                      </strong>

                      <div>
                        <strong>
                          Learn {skill}
                        </strong>

                        <p>
                          Understand the fundamentals,
                          build a small project, and
                          practice interview questions
                          related to {skill}.
                        </p>
                      </div>
                    </div>
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

export default SkillGap;