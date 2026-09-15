import { useState } from "react";

function ApplicationTracker({ onBack }) {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("applications");

    return saved ? JSON.parse(saved) : [];
  });

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const addApplication = () => {
    if (!company.trim() || !role.trim()) {
      alert("Please enter company and job role.");
      return;
    }

    const newApplication = {
      id: Date.now(),
      company,
      role,
      status,
      date,
      notes
    };

    const updatedApplications = [
      ...applications,
      newApplication
    ];

    setApplications(updatedApplications);

    localStorage.setItem(
      "applications",
      JSON.stringify(updatedApplications)
    );

    setCompany("");
    setRole("");
    setStatus("Applied");
    setDate("");
    setNotes("");
  };

  const updateStatus = (id, newStatus) => {
    const updatedApplications = applications.map(
      (application) =>
        application.id === id
          ? {
              ...application,
              status: newStatus
            }
          : application
    );

    setApplications(updatedApplications);

    localStorage.setItem(
      "applications",
      JSON.stringify(updatedApplications)
    );
  };

  const deleteApplication = (id) => {
    const updatedApplications = applications.filter(
      (application) => application.id !== id
    );

    setApplications(updatedApplications);

    localStorage.setItem(
      "applications",
      JSON.stringify(updatedApplications)
    );
  };

  const totalApplications = applications.length;
const formatDate = (value) => {
  if (!value) return "Not specified";

  const dateValue = new Date(value);

  if (isNaN(dateValue.getTime())) {
    return value;
  }

  return dateValue.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
  const shortlisted = applications.filter(
    (application) =>
      application.status === "Shortlisted"
  ).length;

  const interviews = applications.filter(
    (application) =>
      application.status === "Interview"
  ).length;

  const selected = applications.filter(
    (application) =>
      application.status === "Selected"
  ).length;

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
          maxWidth: "1100px",
          margin: "0 auto"
        }}
      >
        <h1>💼 Application Tracker</h1>

        <p>
          Track your internship and job applications
          from one place.
        </p>

        {/* Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginTop: "25px"
          }}
        >
          <div className="stat-card">
            <small>Total Applications</small>
            <h2>{totalApplications}</h2>
          </div>

          <div className="stat-card">
            <small>Shortlisted</small>
            <h2>{shortlisted}</h2>
          </div>

          <div className="stat-card">
            <small>Interviews</small>
            <h2>{interviews}</h2>
          </div>

          <div className="stat-card">
            <small>Selected</small>
            <h2>{selected}</h2>
          </div>
        </div>

        {/* Add Application */}
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
          <h2>➕ Add Application</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "15px",
              marginTop: "20px"
            }}
          >
            <input
              value={company}
              onChange={(e) =>
                setCompany(e.target.value)
              }
              placeholder="Company Name"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />

            <input
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              placeholder="Job Role"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            >
              <option>Applied</option>
              <option>Shortlisted</option>
              <option>Interview</option>
              <option>Selected</option>
              <option>Rejected</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc"
              }}
            />
          </div>

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Notes (optional)"
            rows="4"
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              resize: "vertical"
            }}
          />

          <button
            onClick={addApplication}
            style={{
              marginTop: "15px",
              padding: "13px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            ➕ Add Application
          </button>
        </div>

        {/* Applications */}
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
          <h2>📋 My Applications</h2>

          {applications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px"
              }}
            >
              <h3>No applications yet</h3>

              <p>
                Add your first job or internship
                application above.
              </p>
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
                marginTop: "20px"
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}
              >
                <thead>
                  <tr>
                    <th style={cellStyle}>
                      Company
                    </th>

                    <th style={cellStyle}>
                      Role
                    </th>

                    <th style={cellStyle}>
  Location
</th>

<th style={cellStyle}>
  Match
</th>

<th style={cellStyle}>
  Date
</th>

<th style={cellStyle}>
  Status
</th>

                    <th style={cellStyle}>
                      Notes
                    </th>

                    <th style={cellStyle}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map(
                    (application) => (
                      <tr key={application.id}>
                        <td style={cellStyle}>
                          <strong>
                            {application.company}
                          </strong>
                        </td>

                        <td style={cellStyle}>
  {application.role ||
    application.jobTitle ||
    application.title ||
    "Not specified"}
</td>

<td style={cellStyle}>
  {application.location ||
    "Not specified"}
</td>

<td style={cellStyle}>
  <strong>
    {application.matchScore != null
      ? `${application.matchScore}%`
      : "-"}
  </strong>
</td>

<td style={cellStyle}>
  {formatDate(
    application.date ||
      application.appliedDate
  )}
</td>
                        <td style={cellStyle}>
                          <select
                            value={
                              application.status
                            }
                            onChange={(e) =>
                              updateStatus(
                                application.id,
                                e.target.value
                              )
                            }
                          >
                            <option>
                              Applied
                            </option>

                            <option>
                              Shortlisted
                            </option>

                            <option>
                              Interview
                            </option>

                            <option>
                              Selected
                            </option>

                            <option>
                              Rejected
                            </option>
                          </select>
                        </td>

                        <td style={cellStyle}>
                          {application.notes ||
                            "-"}
                        </td>

                        <td style={cellStyle}>
                          {application.url && (
  <button
    onClick={() =>
      window.open(
        application.url,
        "_blank",
        "noopener,noreferrer"
      )
    }
    style={{
      cursor: "pointer",
      padding: "7px 12px",
      marginRight: "8px",
    }}
  >
    🔗 View Job
  </button>
)}
                          <button
                            onClick={() =>
                              deleteApplication(
                                application.id
                              )
                            }
                            style={{
                              cursor: "pointer",
                              padding: "7px 12px"
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  textAlign: "left"
};

export default ApplicationTracker;