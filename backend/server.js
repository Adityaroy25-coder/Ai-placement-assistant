require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// DATABASE
// ===============================

console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

connectDB();

// ===============================
// CORS + BODY PARSER
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// ===============================
// RESUME PARSER
// ===============================

function parseResume(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );

  const phoneMatch = text.match(
    /(?:\+91[-\s]?)?[6-9]\d{9}/
  );

  const possibleSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "HTML",
    "CSS",
    "C++",
    "Java",
    "Python",
    "SQL",
    "Git",
    "GitHub",
    "AWS",
    "Docker",
  ];

  const skills = possibleSkills.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return {
    name: lines.length > 0 ? lines[0] : "Not Found",
    email: emailMatch ? emailMatch[0] : "Not Found",
    phone: phoneMatch ? phoneMatch[0] : "Not Found",
    skills,
  };
}

// ===============================
// UPLOADS
// ===============================

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (
      path.extname(file.originalname).toLowerCase() !== ".pdf"
    ) {
      return cb(
        new Error("Only PDF files are allowed")
      );
    }

    cb(null, true);
  },
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "AI Placement Assistant Backend is running",
  });
});

// ===============================
// RESUME UPLOAD
// ===============================

app.post(
  "/api/resume/upload",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Resume file is required",
        });
      }

      console.log(
        "Resume uploaded:",
        req.file.originalname
      );

      const pdfBuffer = fs.readFileSync(req.file.path);

      const pdfData = await pdfParse(pdfBuffer);

      const resumeText = pdfData.text;

      console.log(
        "Resume text extracted successfully"
      );

      const resumeData = parseResume(resumeText);

      console.log("Parsed Resume Data:");
      console.log(resumeData);

      return res.json({
        success: true,
        message:
          "Resume uploaded and analyzed successfully",

        file: {
          originalName: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
        },

        resumeText,
        resumeData,
      });
    } catch (error) {
      console.error(
        "Resume processing error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to process resume",
        error: error.message,
      });
    }
  }
);

// ===============================
// JOB SKILL EXTRACTION
// ===============================

function extractJobSkills(text) {
  const possibleSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "HTML",
    "CSS",
    "C++",
    "Java",
    "Python",
    "SQL",
    "Git",
    "GitHub",
    "AWS",
    "Docker",
    "Kubernetes",
    "TypeScript",
    "Next.js",
    "Angular",
    "Vue.js",
    "MySQL",
    "PostgreSQL",
    "REST API",
    "Machine Learning",
    "Data Structures",
    "Algorithms",
  ];

  return possibleSkills.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

// ===============================
// JOB DESCRIPTION ANALYZER
// ===============================

app.post("/api/job/analyze", (req, res) => {
  try {
    const {
      jobDescription,
      resumeData,
    } = req.body;

    if (
      !jobDescription ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Job description is required",
      });
    }

    const requiredSkills =
      extractJobSkills(jobDescription);

    const resumeSkills =
      resumeData &&
      Array.isArray(resumeData.skills)
        ? resumeData.skills
        : [];

    const normalizedResumeSkills =
      resumeSkills.map((skill) =>
        skill.toLowerCase().trim()
      );

    const matchingSkills =
      requiredSkills.filter(
        (skill) =>
          normalizedResumeSkills.includes(
            skill.toLowerCase().trim()
          )
      );

    const missingSkills =
      requiredSkills.filter(
        (skill) =>
          !normalizedResumeSkills.includes(
            skill.toLowerCase().trim()
          )
      );

    const matchScore =
      requiredSkills.length > 0
        ? Math.round(
            (matchingSkills.length /
              requiredSkills.length) *
              100
          )
        : 0;

    return res.json({
      success: true,
      message:
        "Job description analyzed successfully",

      requiredSkills,

      resumeSkills,

      matchingSkills,

      missingSkills,

      matchScore,
    });
  } catch (error) {
    console.error(
      "Job analysis error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to analyze job description",
      error: error.message,
    });
  }
});

// ===============================
// ADZUNA JOB SEARCH
// ===============================

app.get(
  "/api/jobs/search",
  async (req, res) => {
    try {
      const {
        query = "software developer",
        location = "india",
        page = 1,
      } = req.query;

      if (
        !process.env.ADZUNA_APP_ID ||
        !process.env.ADZUNA_APP_KEY
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Adzuna API credentials are missing.",
        });
      }

      const country = "in";

      const url =
        `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}` +
        `?app_id=${encodeURIComponent(
          process.env.ADZUNA_APP_ID
        )}` +
        `&app_key=${encodeURIComponent(
          process.env.ADZUNA_APP_KEY
        )}` +
        `&results_per_page=20` +
        `&what=${encodeURIComponent(query)}` +
        `&where=${encodeURIComponent(location)}` +
        `&content-type=application/json`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorText =
          await response.text();

        return res.status(response.status).json({
          success: false,
          message:
            "Adzuna API request failed.",
          error: errorText,
        });
      }

      const data =
        await response.json();

      const jobs =
        (data.results || []).map(
          (job) => ({
            id: job.id,

            title: job.title,

            company:
              job.company?.display_name ||
              "Company not specified",

            location:
              job.location?.display_name ||
              location,

            description:
              job.description || "",

            salaryMin:
              job.salary_min || null,

            salaryMax:
              job.salary_max || null,

            contractType:
              job.contract_type ||
              "Not specified",

            contractTime:
              job.contract_time ||
              "Not specified",

            category:
              job.category?.label ||
              "Software",

            created:
              job.created || null,

            url:
              job.redirect_url || null,
          })
        );

      return res.json({
        success: true,

        count: jobs.length,

        totalResults:
          data.count || 0,

        jobs,
      });
    } catch (error) {
      console.error(
        "Job Search Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch jobs.",

        error: error.message,
      });
    }
  }
);

// ===============================
// USER REGISTRATION
// ===============================

app.post(
  "/api/auth/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and password are required",
        });
      }

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "User already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword,
        });

      return res.status(201).json({
        success: true,

        message:
          "User registered successfully",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Registration failed",

        error:
          error.message,
      });
    }
  }
);

// ===============================
// USER LOGIN
// ===============================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        });
      }

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      const isPasswordValid =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      const token =
        jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d",
          }
        );

      return res.status(200).json({
        success: true,

        message:
          "Login successful",

        token,

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Login failed",

        error:
          error.message,
      });
    }
  }
);

// ===============================
// CURRENT USER
// ===============================

app.get(
  "/api/auth/me",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.userId
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error(
        "Get user error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get user",
      });
    }
  }
);

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use(
  (err, req, res, next) => {
    console.error(
      "Backend Error:",
      err.message
    );

    return res.status(500).json({
      success: false,

      message:
        err.message,
    });
  }
);

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(
    "================================="
  );

  console.log(
    `Backend running on port ${PORT}`
  );

  console.log(
    "================================="
  );
});
