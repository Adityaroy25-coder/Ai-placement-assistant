import { useState } from "react";

function GitHubAnalysis({ onBack }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyzeRepository = async () => {
    setError("");
    setResult(null);

    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    try {
      const url = new URL(repoUrl.trim());

      if (url.hostname !== "github.com") {
        throw new Error(
          "Please enter a valid github.com repository URL."
        );
      }

      const parts = url.pathname
        .split("/")
        .filter(Boolean);

      if (parts.length < 2) {
        throw new Error(
          "Please enter a repository URL like https://github.com/username/repository"
        );
      }

      const owner = parts[0];
      const repo = parts[1].replace(".git", "");

      setLoading(true);

      // Repository information
      const repoResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`
      );

      if (!repoResponse.ok) {
        throw new Error(
          "Repository not found or it may be private."
        );
      }

      const repository = await repoResponse.json();

      // Languages
      const languageResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/languages`
      );

      const languages = languageResponse.ok
        ? await languageResponse.json()
        : {};

      // README
      const readmeResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`
      );

      const hasReadme = readmeResponse.ok;

      // Calculate score
      let score = 0;
      const strengths = [];
      const improvements = [];

      // README
      if (hasReadme) {
        score += 20;
        strengths.push("README documentation is available.");
      } else {
        improvements.push(
          "Add a detailed README with setup instructions and screenshots."
        );
      }

      // Description
      if (repository.description) {
        score += 10;
        strengths.push("Repository has a project description.");
      } else {
        improvements.push(
          "Add a clear repository description."
        );
      }

      // Languages
      const languageList = Object.keys(languages);

      if (languageList.length > 0) {
        score += 20;
        strengths.push(
          `Project uses ${languageList.length} programming language(s).`
        );
      } else {
        improvements.push(
          "Add source code so the project's technology stack can be analyzed."
        );
      }

      // Stars
      if (repository.stargazers_count >= 10) {
        score += 15;
        strengths.push("Repository has good community visibility.");
      } else if (repository.stargazers_count > 0) {
        score += 8;
      } else {
        improvements.push(
          "Improve project visibility by sharing the project and getting genuine feedback."
        );
      }

      // Forks
      if (repository.forks_count > 0) {
        score += 10;
        strengths.push("Repository has been forked.");
      }

      // Recent update
      if (repository.updated_at) {
        const updatedDate = new Date(
          repository.updated_at
        );

        const now = new Date();

        const daysSinceUpdate =
          (now - updatedDate) /
          (1000 * 60 * 60 * 24);

        if (daysSinceUpdate <= 30) {
          score += 15;
          strengths.push(
            "Repository has been updated recently."
          );
        } else {
          improvements.push(
            "Keep the repository updated with recent improvements."
          );
        }
      }

      // Open issues
      if (
        repository.open_issues_count > 0
      ) {
        improvements.push(
          "Review and resolve open issues before showcasing the project."
        );
      }

      // Topics
      if (
        repository.topics &&
        repository.topics.length > 0
      ) {
        score += 10;
        strengths.push(
          "Repository uses topics for better discoverability."
        );
      } else {
        improvements.push(
          "Add GitHub topics such as Java, React, Node.js, MongoDB, etc."
        );
      }

      score = Math.min(score, 100);

      setResult({
        name: repository.name,
        fullName: repository.full_name,
        description: repository.description,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        issues: repository.open_issues_count,
        language: repository.language,
        languages: languageList,
        hasReadme,
        updatedAt: repository.updated_at,
        visibility: repository.visibility,
        defaultBranch: repository.default_branch,
        score,
        strengths,
        improvements,
        htmlUrl: repository.html_url
      });
    } catch (err) {
      console.error("GitHub analysis error:", err);

      setError(
        err.message ||
          "Unable to analyze GitHub repository."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreStatus = (score) => {
    if (score >= 80) {
      return "🔥 Excellent Project";
    }

    if (score >= 60) {
      return "👍 Good Project";
    }

    if (score >= 40) {
      return "⚠️ Needs Improvement";
    }

    return "🚨 Improve Project";
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
        <h1>💻 GitHub Project Analysis</h1>

        <p>
          Analyze your GitHub project and get suggestions
          to make it more placement-ready.
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
          <h2>🔗 GitHub Repository</h2>

          <input
            value={repoUrl}
            onChange={(e) =>
              setRepoUrl(e.target.value)
            }
            placeholder="https://github.com/username/repository"
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box"
            }}
          />

          {error && (
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                borderRadius: "8px",
                background: "#ffecec",
                color: "#b00020"
              }}
            >
              ❌ {error}
            </div>
          )}

          <button
            onClick={analyzeRepository}
            disabled={loading}
            style={{
              marginTop: "15px",
              padding: "13px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontSize: "16px"
            }}
          >
            {loading
              ? "🔍 Analyzing..."
              : "🔍 Analyze Repository"}
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
              <h2>
                {result.name}
              </h2>

              <p>
                {result.description ||
                  "No repository description provided."}
              </p>

              <div
                style={{
                  fontSize: "60px",
                  fontWeight: "bold",
                  margin: "15px"
                }}
              >
                {result.score}
                <span
                  style={{
                    fontSize: "25px"
                  }}
                >
                  /100
                </span>
              </div>

              <h3>
                {getScoreStatus(result.score)}
              </h3>

              <a
                href={result.htmlUrl}
                target="_blank"
                rel="noreferrer"
              >
                🔗 Open GitHub Repository
              </a>
            </div>

            {/* Repository Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
                marginTop: "25px"
              }}
            >
              <StatCard
                title="⭐ Stars"
                value={result.stars}
              />

              <StatCard
                title="🍴 Forks"
                value={result.forks}
              />

              <StatCard
                title="🐛 Open Issues"
                value={result.issues}
              />

              <StatCard
                title="📝 README"
                value={
                  result.hasReadme
                    ? "Available"
                    : "Missing"
                }
              />
            </div>

            {/* Technologies */}
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
              <h2>💻 Technologies</h2>

              {result.languages.length > 0 ? (
                result.languages.map(
                  (language, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        padding: "8px 14px",
                        margin: "5px",
                        borderRadius: "20px",
                        background: "#eef7ff"
                      }}
                    >
                      {language}
                    </span>
                  )
                )
              ) : (
                <p>
                  No programming languages detected.
                </p>
              )}
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
              <h2>💪 Project Strengths</h2>

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
                  No major strengths detected yet.
                </p>
              )}
            </div>

            {/* Improvements */}
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
              <h2>🔧 Improvement Suggestions</h2>

              {result.improvements.length > 0 ? (
                result.improvements.map(
                  (improvement, index) => (
                    <p key={index}>
                      💡 {improvement}
                    </p>
                  )
                )
              ) : (
                <p>
                  🎉 Your project looks well prepared!
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow:
          "0 5px 25px rgba(0,0,0,0.08)"
      }}
    >
      <small>{title}</small>

      <h2
        style={{
          marginTop: "10px"
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default GitHubAnalysis;