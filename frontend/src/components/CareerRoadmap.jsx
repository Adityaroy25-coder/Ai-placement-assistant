import { useState } from "react";

function CareerRoadmap({ resumeData, onBack }) {
  const [jobDescription, setJobDescription] = useState("");
  const [roadmap, setRoadmap] = useState(null);

  const generateRoadmap = () => {
  const savedJobAnalysis = JSON.parse(
    localStorage.getItem("jobAnalysis") || "null"
  );

  const savedCareerPrediction = JSON.parse(
    localStorage.getItem("careerPrediction") || "null"
  );

  const resumeSkills =
    resumeData && Array.isArray(resumeData.skills)
      ? resumeData.skills
      : [];

  const normalizedResume = resumeSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  const targetRole =
    savedCareerPrediction?.topCareer ||
    "Software Developer";

  const jd = jobDescription.toLowerCase();

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

  let requiredSkills = [];

  if (
    savedJobAnalysis?.requiredSkills &&
    savedJobAnalysis.requiredSkills.length > 0
  ) {
    requiredSkills = savedJobAnalysis.requiredSkills;
  } else if (jd.trim()) {
    requiredSkills = skillDatabase.filter((skill) =>
      jd.includes(skill.toLowerCase())
    );
  }

  if (requiredSkills.length === 0) {
    alert(
      "Please analyze a job description first or paste a target job description."
    );
    return;
  }

  let missingSkills = [];

  if (
    savedJobAnalysis?.missingSkills &&
    savedJobAnalysis.missingSkills.length > 0
  ) {
    missingSkills = savedJobAnalysis.missingSkills;
  } else {
    missingSkills = requiredSkills.filter((skill) => {
      const skillLower = skill.toLowerCase();

      return !normalizedResume.some(
        (resumeSkill) =>
          resumeSkill === skillLower ||
          resumeSkill.includes(skillLower) ||
          skillLower.includes(resumeSkill)
      );
    });
  }

  const roadmapSteps = [];

  roadmapSteps.push({
    number: 1,
    title: `Strengthen ${targetRole} Fundamentals`,
    description:
      `Build strong programming fundamentals required for a ${targetRole} including OOP, problem solving, clean coding and debugging.`,
    duration: "2–3 weeks",
    status: "Foundation"
  });

  const needsDSA =
    missingSkills.some((skill) =>
      ["DSA", "Data Structures", "Algorithms"].includes(skill)
    ) ||
    !normalizedResume.some(
      (skill) =>
        skill.includes("dsa") ||
        skill.includes("data structure") ||
        skill.includes("algorithm")
    );

  if (needsDSA) {
    roadmapSteps.push({
      number: roadmapSteps.length + 1,
      title: "Master Data Structures & Algorithms",
      description:
        "Practice arrays, strings, linked lists, stacks, queues, trees, graphs, sorting, searching and dynamic programming.",
      duration: "4–6 weeks",
      status: "High Priority"
    });
  }

  missingSkills.forEach((skill) => {
    if (
      !["DSA", "Data Structures", "Algorithms"].includes(skill)
    ) {
      roadmapSteps.push({
        number: roadmapSteps.length + 1,
        title: `Learn ${skill}`,
        description:
          `Learn ${skill}, build mini projects and use it in backend or software development applications.`,
        duration: "1–3 weeks",
        status: "Skill Gap"
      });
    }
  });

  roadmapSteps.push({
    number: roadmapSteps.length + 1,
    title: `Build ${targetRole} Projects`,
    description:
      `Create 2–3 strong ${targetRole} projects and upload them on GitHub with proper README and documentation.`,
    duration: "3–5 weeks",
    status: "Projects"
  });

  roadmapSteps.push({
    number: roadmapSteps.length + 1,
    title: "Mock Interview Preparation",
    description:
      "Practice technical interviews, HR questions, project explanation and coding interview questions.",
    duration: "2–3 weeks",
    status: "Interview"
  });

  roadmapSteps.push({
    number: roadmapSteps.length + 1,
    title: "Start Applying for Jobs",
    description:
      `Apply for ${targetRole} internships and entry-level roles, track applications and improve based on feedback.`,
    duration: "Ongoing",
    status: "Career"
  });

  setRoadmap({
    targetRole,
    requiredSkills,
    missingSkills,
    roadmapSteps
  });

  localStorage.setItem(
    "careerRoadmap",
    JSON.stringify({
      targetRole,
      requiredSkills,
      missingSkills,
      roadmapSteps,
      updatedAt: new Date().toISOString()
    })
  );
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
        <h1>🗺️ Personalized Career Roadmap</h1>

        <p>
          Build a learning and placement roadmap based on
          your current skills and target job.
        </p>
{JSON.parse(localStorage.getItem("careerPrediction") || "null")?.topCareer && (
  <div
    style={{
      marginTop: "15px",
      padding: "12px 18px",
      background: "#e8f0fe",
      borderRadius: "10px"
    }}
  >
    🎯 Target Career:
    <strong>
      {" "}
      {
        JSON.parse(
          localStorage.getItem("careerPrediction") || "null"
        )?.topCareer
      }
    </strong>
  </div>
)}
        {/* Input */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            marginTop: "25px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
          }}
        >
          <h2>🎯 Target Job</h2>

          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste your target job description here..."
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
            onClick={generateRoadmap}
            style={{
              marginTop: "15px",
              padding: "13px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
           🚀 Generate Personalized Roadmap
          </button>
        </div>

        {roadmap && (
          <>
            {/* Skill Summary */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                marginTop: "25px",
                boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>📊 Skill Analysis</h2>

              <p>
                Required Skills:{" "}
                <strong>
                  {roadmap.requiredSkills.length}
                </strong>
              </p>

              <p>
                Missing Skills:{" "}
                <strong>
                  {roadmap.missingSkills.length}
                </strong>
              </p>

              {roadmap.missingSkills.length > 0 ? (
                <div style={{ marginTop: "15px" }}>
                  {roadmap.missingSkills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          padding: "8px 14px",
                          margin: "5px",
                          borderRadius: "20px",
                          background: "#fff3cd"
                        }}
                      >
                        ⚠️ {skill}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p>
                  🎉 No major skill gaps detected.
                </p>
              )}
            </div>

            {/* Roadmap */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                marginTop: "25px",
                boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>🚀 Your Career Roadmap</h2>

              {roadmap.roadmapSteps.map(
                (step, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "25px"
                    }}
                  >
                    {/* Number */}
                    <div
                      style={{
                        minWidth: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        background: "#eef7ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold"
                      }}
                    >
                      {step.number}
                    </div>

                    {/* Content */}
                    <div
                      style={{
                        flex: 1,
                        paddingBottom: "20px",
                        borderBottom:
                          "1px solid #eee"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "10px",
                          flexWrap: "wrap"
                        }}
                      >
                        <h3
                          style={{
                            margin: 0
                          }}
                        >
                          {step.title}
                        </h3>

                        <span>
                          {step.status}
                        </span>
                      </div>

                      <p>
                        {step.description}
                      </p>

                      <small>
                        ⏱️ Estimated time:{" "}
                        {step.duration}
                      </small>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Final Goal */}
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
              <h2>🎯 Final Goal</h2>

              <p>
                Complete the roadmap → Build projects →
                Practice interviews → Become job ready.
              </p>

              <strong>
                🚀 Placement Ready
              </strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CareerRoadmap;