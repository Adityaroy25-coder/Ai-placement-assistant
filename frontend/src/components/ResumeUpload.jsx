import { useState } from "react";
import API_BASE_URL from "../../api";
import "./ResumeUpload.css";
import ResumeAnalysis from "./ResumeAnalysis";

function ResumeUpload({ onAnalysisComplete, onBack }) {

  const [file, setFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {

    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      return;
    }

    setFile(selectedFile);
  };


  const handleAnalyze = async () => {

    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    setUploading(true);

    const formData = new FormData();

    formData.append("resume", file);

    try {

     const response = await fetch(
  `${API_BASE_URL}/api/resume/upload`,
  {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Backend Response:", data);

      if (data.success) {

        console.log("Resume Data:", data);

        console.log(
          "Extracted Resume Text:",
          data.resumeText
        );

        console.log(
          "Parsed Resume Data:",
          data.resumeData
        );

        localStorage.setItem(
  "resumeData",
  JSON.stringify(data.resumeData)
);

setAnalysisData(data.resumeData);
onAnalysisComplete(data.resumeData);

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.error("Upload Error:", error);

      alert("Failed to upload resume.");

    } finally {

      setUploading(false);

    }
  };


  // If analysis is available,
  // show analysis page instead of upload page




return (

    <div className="resume-page">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Dashboard
      </button>

      <div className="resume-card">

        <div className="resume-icon">
          📄
        </div>


        <h1>
          Upload Your Resume
        </h1>


        <p>
          Upload your resume in PDF format and let AI analyze your
          skills, experience and ATS compatibility.
        </p>


        <label className="upload-box">

          <span>
            📁
          </span>


          <strong>
            {file
              ? file.name
              : "Choose your resume"}
          </strong>


          <small>
            PDF files only
          </small>


          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />

        </label>


        {file && (

          <div className="selected-file">

            <span>
              ✅
            </span>

            <span>
              {file.name}
            </span>

          </div>

        )}


        <button
          className="upload-btn"
          onClick={handleAnalyze}
          disabled={uploading}
        >

          {uploading
            ? "Uploading..."
            : "Analyze Resume"}

        </button>

      </div>

    </div>

  );
}


export default ResumeUpload;