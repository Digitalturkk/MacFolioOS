"use client"

import type React from "react"

import { useState } from "react"

interface NotesProps {
  isDarkMode?: boolean
}

export default function Notes({ isDarkMode = true }: NotesProps) {
  // Update the notes state with enhanced content
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "About Me and Skills",
      content: `# Farid Huseynov (ファリド フセイノフ)
Software Engineer (ソフトウェアエンジニア)

1 year of total experience in software development with Spring Boot.
Have been selected for the Natsunojin 2025 at Rakuten*.
After Natsunojin, joined Rakuten Ichiba as a winter intern.
Falling in love with Java and Spring ecosystem.
Enthusiastic in Swift and SwiftUI.

* Rakuten Ichiba is the largest e-commerce platform in Japan.

Skills
Programming Languages:
- Java (Expert)
- Swift (Intermediate)
- JavaScript/TypeScript (Intermediate)
- Python (Advanced)
- Kotlin (Basic)

Backend:
- Spring Boot, Spring Data, Spring Security, Spring Cloud, Spring MVC, Spring AI
- Hibernate/JPA
- Node.js/Express/Prisma/Nodemon
- SQL (SQLite, PostgreSQL)
- NoSQL (MongoDB, Redis)
- RESTful API Design

Frontend:
- SwiftUI
- React/Next.js
- Tailwind CSS/Bootstrap/Material UI
- UI/UX Design with Figma

DevOps & Tools:
- Docker/Containerization
- CI/CD Pipelines
- Git/GitHub
- AWS/Cloud Services
- Linux/WSL

Contact:
Email: huseynovfarid1111@gmail.com
GitHub: github.com/digitalturkk`,
      date: "Today, 10:30 AM",
    },

    {
      id: 2,
      title: "Work Experience",
      content: `  Java Software Engineer Intern (Part-time) | Feb 2026 – Apr 2026
    Rakuten Ichiba Division | Tokyo, Japan (Remote)

 Assisted in the development and maintenance of high-traffic backend services for Japan's largest e-commerce ecosystem, using Java 17 and Spring Boot. 
 Gained hands-on experience with R-Cloud (Rakuten’s internal Kubernetes platform), deploying containerized microservices and managing cloud resources. 
 Monitored backend performance and system health using Prometheus and Grafana to identify latency bottlenecks in production-like environments. 
 Maintained and updated CI/CD pipelines through Bitbucket, automating delivery to staging environments.
 Actively participated in Agile rituals, including weekly Asakai (morning meetings) and peer code reviews, collaborating within a diverse, international remote team. 
 Contributed to database query optimization (TiDB/Redis) to improve data retrieval speeds for e-commerce services.

  Java Web Developer Internship | Oct 2024 – Mar 2025
    Khazar University Dunya School | Sumqayit, Azerbaijan

 Designed and implemented RESTful APIs using Java 21+ and Spring Boot to manage core educational data, including courses, students, and class schedules.
 Applied OOP principles to develop modular and production-ready server-side logic.
 Implemented Spring Security and JWT (JSON Web Tokens) for secure user authentication across internal web services.
 Managed and queried PostgreSQL databases, optimizing SQL commands to ensure data integrity and efficient retrieval for reporting.
 Collaborated on the development of an end-to-end Teacher Dashboard.
 Utilized Git for version control and followed established coding guidelines.

  Backend Program Lead | Jul 2023 – Present
      <Three/Edu> | Baku, Azerbaijan

 Designed and implemented comprehensive training programs for Python, Backend development, and foundational Frontend concepts, ensuring curriculum alignment with industry demands.
 Mentored and instructed over 100+ students, successfully transitioning them from basic concepts to developing full-stack projects.
 Developed and administered technical exams and assessment systems.

  Programming Mentor | Aug 2025 – Nov 2025
    Algorithmics | Baku, Azerbaijan

 Provided technical mentoring and guidance, helping students build their first programming projects.
 Conducted regular code reviews and debugging sessions, teaching students clean code principles, OOP fundamentals, and effective problem-solving techniques.
 Simplified complex computer science concepts (such as algorithms, data structures, and logic) for diverse audiences with varying technical backgrounds.`,
      date: "Yesterday, 3:15 PM",
    },{
      id: 3,
      title: "Projects",
      content: `My Projects:

      1. DuckVest - A powerful backend simulation of an investment brokerage platform built with Java 24 and Spring Boot 3, 
      featuring real-time stock trading (TwelveData API), user portfolio management, and multi-exchange operations.

      2. BARSDAG - A Spring Boot-based bar beverage exchange REST API featuring a dynamic supply-and-demand pricing system
      where drink prices fluctuate in real time based on active sales and scheduled intervals.
      
      3. MyGarden - A hardware-free, software-only precision agriculture SaaS (Node.js/React) that democratizes smart irrigation
      for small-scale farmers, cutting water waste by up to 40% via OpenWeather API and FAO soil data integration.

      4. FinDuck - A  financial management IOS application (SwiftUI) that allows users to
      track expenses, visualize spending trends, and set budget goals with real-time data analytics.

      All projects and more are open-source and available on my GitHub: github.com/digitalturkk 
      (Click the icon below on the dock)
      `,
      date: "Today, 10:30 AM",
    },
  ])

  const [selectedNoteId, setSelectedNoteId] = useState(1)
  const [editableContent, setEditableContent] = useState("")

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  const handleNoteSelect = (id: number) => {
    setSelectedNoteId(id)
    const note = notes.find((n) => n.id === id)
    if (note) {
      setEditableContent(note.content)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value)

    // Update the note content
    setNotes(
      notes.map((note) => {
        if (note.id === selectedNoteId) {
          return { ...note, content: e.target.value }
        }
        return note
      }),
    )
  }

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const sidebarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
  const selectedBg = isDarkMode ? "bg-gray-700" : "bg-gray-300"

  return (
    <div className={`flex h-full ${bgColor} ${textColor}`}>
      {/* Sidebar */}
      <div className={`w-64 ${sidebarBg} border-r ${borderColor} flex flex-col`}>
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-medium">Notes</h2>
          <button className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 cursor-pointer ${selectedNoteId === note.id ? selectedBg : hoverBg}`}
              onClick={() => handleNoteSelect(note.id)}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{note.date}</p>
              <p className={`text-sm mt-1 truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {note.content.split("\n")[0].replace(/^#+ /, "")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Note content */}
      <div className="flex-1 flex flex-col">
        {selectedNote && (
          <>
            <div className={`p-3 border-b ${borderColor}`}>
              <h2 className="font-medium">{selectedNote.title}</h2>
              <p className="text-xs text-gray-500">{selectedNote.date}</p>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <textarea
                className={`w-full h-full resize-none ${bgColor} ${textColor} focus:outline-none`}
                value={selectedNote.content}
                onChange={handleContentChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
