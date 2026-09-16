# 🤖 AI Placement & Career Intelligence Platform

A full-stack placement preparation platform designed to help students analyze their resumes, match job requirements, identify skill gaps, prepare for interviews, discover jobs, and track their placement readiness from a single dashboard.

## 🎯 Project Objective

The objective of the AI Placement & Career Intelligence Platform is to provide students with a centralized and personalized solution for placement preparation.

The platform aims to:

- Analyze resumes and identify relevant technical skills
- Compare candidate profiles with target job requirements
- Identify skill gaps and areas that require improvement
- Recommend relevant job opportunities
- Help students practice technical interviews
- Assess technical skills and placement readiness
- Track job applications in an organized manner
- Provide personalized career guidance and learning roadmaps
- Help students make data-driven decisions during their placement preparation

## 🌐 Live Demo

**Frontend:**  
https://ai-placement-assistant-psi.vercel.app

**Backend:**  
https://ai-placement-assistant-ea9w.onrender.com

## 📌 Overview

The AI Placement & Career Intelligence Platform brings multiple placement-preparation activities into one application.

Students can upload their resumes, analyze job descriptions, compare skills, discover relevant jobs, practice interviews, assess their technical skills, track applications, and generate career insights.

## ✨ Features

- 📄 Resume Analysis
- 🎯 Job Description & Skill Matching
- 💡 Skill Gap Analysis
- 🗺️ Personalized Career Roadmap
- 🎤 Mock Interview
- 💼 Application Tracker
- 📊 Job Readiness Score
- 💻 GitHub Analysis
- 🔎 Real Job Search & Recommendations
- 🧠 Skill Assessment
- 🔮 Career Prediction
- 🔐 User Registration & Login
- 📊 Centralized Placement Dashboard

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- MongoDB Atlas

### APIs & Authentication

- Adzuna Jobs API
- JWT Authentication
- Resume Parsing

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

## 🔮 Future Enhancements

The platform can be further enhanced with advanced features such as:

- 🤖 Advanced AI-powered resume feedback
- 🧠 Semantic job matching using NLP and embeddings
- 📚 Personalized course recommendations
- 💻 Personalized project recommendations based on skill gaps
- 🎤 Advanced AI-based mock interview evaluation
- 📧 Email notifications for relevant job opportunities
- 🔔 Job application deadline and follow-up reminders
- 📊 Advanced placement analytics and progress visualization
- 🌐 Integration with additional job portals
- 🎯 Personalized preparation plans based on target companies and roles
- 📈 Historical tracking of skill improvement and placement readiness


## 🏗️ System Architecture

```text
                         USER
                           │
                           ▼
                ┌─────────────────────┐
                │   React + Vite      │
                │     Frontend        │
                └──────────┬──────────┘
                           │
                     REST API Calls
                           │
                           ▼
                ┌─────────────────────┐
                │ Node.js + Express   │
                │      Backend        │
                └───────┬─────┬───────┘
                        │     │
             ┌──────────┘     └────────────┐
             ▼                             ▼
    ┌─────────────────┐          ┌─────────────────┐
    │  MongoDB Atlas  │          │  Adzuna Jobs    │
    │  Database       │          │      API        │
    └─────────────────┘          └─────────────────┘
