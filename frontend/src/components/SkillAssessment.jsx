import React, { useState } from "react";

function SkillAssessment({ onBack }) {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const assessments = {
    Java: [
      {
        question: "Which keyword is used to create a class in Java?",
        options: ["function", "class", "struct", "define"],
        answer: "class",
      },
      {
        question: "Which concept allows a class to have multiple forms?",
        options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
        answer: "Polymorphism",
      },
      {
        question: "Which method is the entry point of a Java program?",
        options: ["start()", "run()", "main()", "execute()"],
        answer: "main()",
      },
      {
        question: "Which keyword is used to inherit a class?",
        options: ["implements", "extends", "inherits", "super"],
        answer: "extends",
      },
      {
        question: "Which collection does not allow duplicate elements?",
        options: ["List", "Set", "ArrayList", "Vector"],
        answer: "Set",
      },
    ],

    DSA: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        answer: "O(log n)",
      },
      {
        question: "Which data structure follows LIFO?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        answer: "Stack",
      },
      {
        question: "Which data structure follows FIFO?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        answer: "Queue",
      },
      {
        question: "Which algorithm is commonly used to find the shortest path?",
        options: ["Binary Search", "Dijkstra", "Bubble Sort", "DFS only"],
        answer: "Dijkstra",
      },
      {
        question: "What is the worst-case time complexity of linear search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: "O(n)",
      },
    ],

    SQL: [
      {
        question: "Which command is used to retrieve data from a database?",
        options: ["GET", "SELECT", "FETCH", "READ"],
        answer: "SELECT",
      },
      {
        question: "Which command is used to remove a table?",
        options: ["DELETE", "REMOVE", "DROP", "CLEAR"],
        answer: "DROP",
      },
      {
        question: "Which clause is used to filter rows?",
        options: ["SORT BY", "WHERE", "FILTER", "GROUP"],
        answer: "WHERE",
      },
      {
        question: "Which keyword removes duplicate results?",
        options: ["UNIQUE", "DISTINCT", "DIFFERENT", "FILTER"],
        answer: "DISTINCT",
      },
      {
        question: "Which function returns the number of rows?",
        options: ["SUM()", "TOTAL()", "COUNT()", "NUMBER()"],
        answer: "COUNT()",
      },
    ],

    JavaScript: [
      {
        question: "Which keyword declares a block-scoped variable?",
        options: ["var", "let", "define", "variable"],
        answer: "let",
      },
      {
        question: "Which symbol is used for strict equality?",
        options: ["=", "==", "===", "!="],
        answer: "===",
      },
      {
        question: "Which method adds an element to the end of an array?",
        options: ["push()", "add()", "append()", "insert()"],
        answer: "push()",
      },
      {
        question: "Which keyword defines a constant?",
        options: ["constant", "fixed", "const", "static"],
        answer: "const",
      },
      {
        question: "Which function converts JSON text into a JavaScript object?",
        options: [
          "JSON.parse()",
          "JSON.convert()",
          "JSON.object()",
          "JSON.decode()",
        ],
        answer: "JSON.parse()",
      },
    ],
  };

  const questions = selectedSkill
    ? assessments[selectedSkill]
    : [];

  const startAssessment = () => {
    if (!selectedSkill) return;

    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
    setResult(null);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    const updatedAnswers = [
      ...answers,
      {
        question: questions[currentQuestion].question,
        selected: selectedAnswer,
        correct: questions[currentQuestion].answer,
        isCorrect:
          selectedAnswer === questions[currentQuestion].answer,
      },
    ];

    setAnswers(updatedAnswers);
    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(updatedAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    const correctAnswers = finalAnswers.filter(
      (item) => item.isCorrect
    ).length;

    const total = questions.length;
    const percentage = Math.round((correctAnswers / total) * 100);

    let level = "";

    if (percentage >= 80) {
      level = "Advanced";
    } else if (percentage >= 50) {
      level = "Intermediate";
    } else {
      level = "Beginner";
    }

    const resultData = {
      skill: selectedSkill,
      correct: correctAnswers,
      total,
      percentage,
      level,
    };

    setResult(resultData);

    localStorage.setItem(
      `assessment_${selectedSkill}`,
      JSON.stringify(resultData)
    );
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
    setResult(null);
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
          maxWidth: "850px",
          margin: "auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <h1 style={{ fontSize: "42px" }}>
            🧠 Skill Assessment
          </h1>

          <p style={{ fontSize: "18px", color: "#555" }}>
            Test your technical skills and discover your current level.
          </p>
        </div>

        {!result && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2>Choose a Skill</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              {Object.keys(assessments).map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    setSelectedSkill(skill);
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setSelectedAnswer("");
                  }}
                  style={{
                    padding: "18px",
                    borderRadius: "10px",
                    border:
                      selectedSkill === skill
                        ? "3px solid #111827"
                        : "1px solid #ddd",
                    background:
                      selectedSkill === skill
                        ? "#eef2ff"
                        : "white",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>

            {selectedSkill && (
              <div style={{ marginTop: "35px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <strong>
                    Question {currentQuestion + 1} of{" "}
                    {questions.length}
                  </strong>

                  <span>{selectedSkill}</span>
                </div>

                <div
                  style={{
                    height: "8px",
                    background: "#e5e7eb",
                    borderRadius: "10px",
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${
                        ((currentQuestion + 1) /
                          questions.length) *
                        100
                      }%`,
                      background: "#111827",
                      borderRadius: "10px",
                    }}
                  />
                </div>

                <h2>
                  {questions[currentQuestion].question}
                </h2>

                <div style={{ marginTop: "25px" }}>
                  {questions[currentQuestion].options.map(
                    (option) => (
                      <label
                        key={option}
                        style={{
                          display: "block",
                          padding: "15px",
                          marginBottom: "12px",
                          border: "1px solid #ddd",
                          borderRadius: "10px",
                          cursor: "pointer",
                          background:
                            selectedAnswer === option
                              ? "#eef2ff"
                              : "white",
                        }}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={option}
                          checked={
                            selectedAnswer === option
                          }
                          onChange={(e) =>
                            setSelectedAnswer(
                              e.target.value
                            )
                          }
                          style={{ marginRight: "12px" }}
                        />

                        {option}
                      </label>
                    )
                  )}
                </div>

                <button
                  onClick={handleNext}
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "15px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#111827",
                    color: "white",
                    fontSize: "17px",
                    cursor: "pointer",
                  }}
                >
                  {currentQuestion === questions.length - 1
                    ? "Finish Assessment"
                    : "Next Question →"}
                </button>
              </div>
            )}
          </div>
        )}

        {result && (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h1>🎉 Assessment Complete!</h1>

            <h2 style={{ marginTop: "25px" }}>
              {result.skill}
            </h2>

            <div
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                margin: "20px 0",
              }}
            >
              {result.percentage}%
            </div>

            <h2>
              Level: <strong>{result.level}</strong>
            </h2>

            <p style={{ fontSize: "18px" }}>
              You answered{" "}
              <strong>{result.correct}</strong> out of{" "}
              <strong>{result.total}</strong> questions
              correctly.
            </p>

            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "#f5f7fb",
                borderRadius: "10px",
              }}
            >
              {result.level === "Advanced" && (
                <>
                  <h3>🚀 Excellent!</h3>
                  <p>
                    You have a strong understanding of{" "}
                    {result.skill}. Keep practicing advanced
                    concepts and interview problems.
                  </p>
                </>
              )}

              {result.level === "Intermediate" && (
                <>
                  <h3>👍 Good Progress!</h3>
                  <p>
                    Your fundamentals are decent. Practice
                    more problems and strengthen advanced
                    concepts in {result.skill}.
                  </p>
                </>
              )}

              {result.level === "Beginner" && (
                <>
                  <h3>📚 Keep Learning!</h3>
                  <p>
                    Focus on fundamentals and practice
                    regularly to improve your {result.skill}{" "}
                    skills.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={resetAssessment}
              style={{
                marginTop: "25px",
                padding: "12px 25px",
                border: "none",
                borderRadius: "8px",
                background: "#111827",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              🔄 Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillAssessment;