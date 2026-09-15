import { useState } from "react";

function MockInterview({ resumeData, onBack }) {
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  // ==============================
  // LOCAL QUESTION GENERATOR
  // ==============================

  const generateLocalQuestions = () => {
    const skills =
      resumeData && Array.isArray(resumeData.skills)
        ? resumeData.skills
        : [];

    const text = jobDescription.toLowerCase();

    const generatedQuestions = [];

    // General question
    generatedQuestions.push({
      question: "Tell me about yourself and your technical background.",
      type: "HR"
    });

    // Resume based question
    if (skills.length > 0) {
      generatedQuestions.push({
        question: `You have mentioned ${skills[0]} in your resume. Explain your experience with ${skills[0]} and describe a project where you used it.`,
        type: "Technical"
      });
    } else {
      generatedQuestions.push({
        question:
          "Explain one technical project that you have worked on and your contribution to it.",
        type: "Project"
      });
    }

    // Java
    if (text.includes("java") || skills.some((s) =>
      s.toLowerCase().includes("java")
    )) {
      generatedQuestions.push({
        question:
          "What are the main principles of Object-Oriented Programming in Java? Explain each with an example.",
        type: "Technical"
      });
    }

    // JavaScript
    if (
      text.includes("javascript") ||
      skills.some((s) =>
        s.toLowerCase().includes("javascript")
      )
    ) {
      generatedQuestions.push({
        question:
          "What is the difference between var, let and const in JavaScript?",
        type: "Technical"
      });
    }

    // React
    if (
      text.includes("react") ||
      skills.some((s) =>
        s.toLowerCase().includes("react")
      )
    ) {
      generatedQuestions.push({
        question:
          "What is React and how does the Virtual DOM work?",
        type: "Technical"
      });
    }

    // Node
    if (
      text.includes("node") ||
      skills.some((s) =>
        s.toLowerCase().includes("node")
      )
    ) {
      generatedQuestions.push({
        question:
          "What is Node.js and why is it useful for backend development?",
        type: "Technical"
      });
    }

    // SQL
    if (
      text.includes("sql") ||
      skills.some((s) =>
        s.toLowerCase().includes("sql")
      )
    ) {
      generatedQuestions.push({
        question:
          "What is the difference between a primary key and a foreign key in SQL?",
        type: "Database"
      });
    }

    // MongoDB
    if (
      text.includes("mongodb") ||
      skills.some((s) =>
        s.toLowerCase().includes("mongodb")
      )
    ) {
      generatedQuestions.push({
        question:
          "What is MongoDB and how is it different from a relational database?",
        type: "Database"
      });
    }

    // DSA
    if (
      text.includes("data structure") ||
      text.includes("dsa") ||
      skills.some((s) =>
        s.toLowerCase().includes("dsa")
      )
    ) {
      generatedQuestions.push({
        question:
          "What is the time complexity of binary search and why?",
        type: "DSA"
      });
    }

    // REST API
    if (
      text.includes("rest") ||
      text.includes("api") ||
      skills.some((s) =>
        s.toLowerCase().includes("api")
      )
    ) {
      generatedQuestions.push({
        question:
          "What is a REST API? Explain GET, POST, PUT and DELETE methods.",
        type: "Backend"
      });
    }

    // Git
    if (
      text.includes("git") ||
      skills.some((s) =>
        s.toLowerCase().includes("git")
      )
    ) {
      generatedQuestions.push({
        question:
          "What is Git and why is version control important in software development?",
        type: "Tools"
      });
    }

    // Project question
    generatedQuestions.push({
      question:
        "Explain one challenging problem you faced in a project and how you solved it.",
      type: "Project"
    });

    // HR
    generatedQuestions.push({
      question:
        "Why should we hire you for this role?",
      type: "HR"
    });

    // Remove duplicates and limit to 7
    const uniqueQuestions = [];

    generatedQuestions.forEach((item) => {
      const exists = uniqueQuestions.some(
        (q) => q.question === item.question
      );

      if (!exists) {
        uniqueQuestions.push(item);
      }
    });

    return uniqueQuestions.slice(0, 7);
  };

  // ==============================
  // START INTERVIEW
  // ==============================

  const startInterview = () => {
    const generated = generateLocalQuestions();

    setQuestions(generated);
    setCurrentQuestion(0);
    setAnswers([]);
    setAnswer("");
    setFinished(false);
    setStarted(true);
  };

  // ==============================
  // NEXT QUESTION
  // ==============================

  const handleNext = () => {
  if (!answer.trim()) {
    alert("Please enter your answer first.");
    return;
  }

  const updatedAnswers = [
    ...answers,
    {
      question: questions[currentQuestion].question,
      answer: answer,
    },
  ];

  setAnswers(updatedAnswers);
  setAnswer("");

  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
  } else {
    const interviewScore =
      questions.length > 0
        ? Math.round(
            (updatedAnswers.length / questions.length) * 100
          )
        : 0;

    localStorage.setItem(
      "interviewResult",
      JSON.stringify({
        score: interviewScore,
        totalQuestions: questions.length,
        answeredQuestions: updatedAnswers.length,
        completedAt: new Date().toISOString(),
      })
    );

    setFinished(true);
    setStarted(false);
  }
};
  // ==============================
  // RESULT SCREEN
  // ==============================

  if (finished) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "40px",
          background: "#f5f7fb"
        }}
      >
        <div
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            background: "white",
            padding: "35px",
            borderRadius: "15px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
          }}
        >
          <h1>🎉 Interview Completed</h1>

          <p>
            Great job! You completed the mock interview.
          </p>

          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#eef7ff",
              borderRadius: "10px"
            }}
          >
            <h2>📊 Interview Summary</h2>

            <p>
              Questions Attempted: <strong>{answers.length}</strong>
            </p>

            <p>
              Answered: <strong>{answers.length}</strong>
            </p>

            <p>
  Interview Score:{" "}
  <strong>
    {JSON.parse(
      localStorage.getItem("interviewResult") || "null"
    )?.score || 0}%
  </strong>
</p>
<p>
  {(
    JSON.parse(
      localStorage.getItem("interviewResult") || "null"
    )?.score || 0
  ) >= 80
    ? "🚀 Excellent! You are well prepared."
    : (
        JSON.parse(
          localStorage.getItem("interviewResult") || "null"
        )?.score || 0
      ) >= 60
    ? "💪 Good performance. Keep practicing."
    : "📚 Keep practicing to improve your interview readiness."}
</p>
          </div>

          <br />

          <button
            onClick={() => {
              setFinished(false);
              setAnswers([]);
              setCurrentQuestion(0);
              setAnswer("");
            }}
            style={{
              padding: "12px 22px",
              marginRight: "10px",
              cursor: "pointer"
            }}
          >
            🔄 Practice Again
          </button>

          <button
            onClick={onBack}
            style={{
              padding: "12px 22px",
              cursor: "pointer"
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // START SCREEN
  // ==============================

  if (!started) {
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
            marginBottom: "25px",
            padding: "10px 18px",
            cursor: "pointer"
          }}
        >
          ← Back to Dashboard
        </button>

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "white",
            padding: "35px",
            borderRadius: "15px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
          }}
        >
          <h1>🎤 Mock Interview</h1>

          <p>
            Practice interview questions based on your
            resume and target job.
          </p>

          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#eaf8ee",
              borderRadius: "8px"
            }}
          >
            ✅ Free Local Interview Mode
          </div>

          {resumeData && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                background: "#eef7ff",
                borderRadius: "8px"
              }}
            >
              📄 Resume data loaded
            </div>
          )}

          <br />

          <label>
            <strong>
              Target Job Description
            </strong>
          </label>

          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste the job description here..."
            rows="10"
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
              boxSizing: "border-box"
            }}
          />

          <br />
          <br />

          <button
            onClick={startInterview}
            style={{
              padding: "13px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            🚀 Start Mock Interview
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // QUESTION SCREEN
  // ==============================

  const current = questions[currentQuestion];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb"
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          background: "white",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 5px 25px rgba(0,0,0,0.08)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px"
          }}
        >
          <strong>
            Question {currentQuestion + 1} / {questions.length}
          </strong>

          <span>
            {current?.type}
          </span>
        </div>

        <h2>
          {current?.question}
        </h2>

        <br />

        <textarea
          value={answer}
          onChange={(e) =>
            setAnswer(e.target.value)
          }
          placeholder="Type your answer here..."
          rows="10"
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "vertical",
            boxSizing: "border-box"
          }}
        />

        <br />
        <br />

        <button
          onClick={handleNext}
          style={{
            padding: "13px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {currentQuestion === questions.length - 1
            ? "Finish Interview"
            : "Next Question →"}
        </button>
      </div>
    </div>
  );
}

export default MockInterview;