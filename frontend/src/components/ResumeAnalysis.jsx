import "./ResumeAnalysis.css";

function ResumeAnalysis({ data }) {
  return (
    <div className="analysis-page">

      <div className="analysis-card">

        <h1>Resume Analysis</h1>

        <p className="analysis-subtitle">
          AI-powered analysis of your resume
        </p>

        {/* Candidate Information */}
        <div className="analysis-section">
          <h2>👤 Candidate Information</h2>

          <div className="info-grid">

            <div className="info-box">
              <span>Name</span>
              <strong>{data.name}</strong>
            </div>

            <div className="info-box">
              <span>Email</span>
              <strong>{data.email}</strong>
            </div>

            <div className="info-box">
              <span>Phone</span>
              <strong>{data.phone}</strong>
            </div>

          </div>
        </div>

        {/* Skills */}
        <div className="analysis-section">
          <h2>💻 Skills</h2>

          <div className="skills-container">
            {data.skills && data.skills.length > 0 ? (
              data.skills.map((skill, index) => (
                <span className="skill-tag" key={index}>
                  {skill}
                </span>
              ))
            ) : (
              <p>No skills detected</p>
            )}
          </div>
        </div>

        {/* ATS Score - Coming Soon */}
        <div className="ats-box">
          <h2>📊 ATS Score</h2>

          <div className="ats-score">
            Coming Soon
          </div>

          <p>
            ATS score will be calculated after adding job description.
          </p>
        </div>

      </div>

    </div>
  );
}

export default ResumeAnalysis;