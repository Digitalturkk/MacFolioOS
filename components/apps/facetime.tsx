"use client"

import { useState, useEffect } from "react"
import { 
  Terminal, 
  FileCode, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  User, 
  Rocket, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  Mail, 
  Phone, 
  Linkedin, 
  Download
} from "lucide-react"

interface SpaceCVProps {
  isDarkMode?: boolean
}

export default function SpaceCV({ isDarkMode = true }: SpaceCVProps) {
  const [activeTab, setActiveTab] = useState<string>("summary.java")
  const [booting, setBooting] = useState<boolean>(true)
  const [terminalLines, setTerminalLines] = useState<string[]>([])

  // Эффект загрузки космического бортового компьютера
  useEffect(() => {
    const lines = [
      "SYSTEM: Initializing DigitalSamurai OS v2.0.26...",
      "SATELLITE: Connecting to Baku-Sumqayit-Tokyo uplink... OK",
      "CORE: Loading Java 21 Runtime Environment...",
      "CORE: Spring Boot 3.3.0 initialized successfully.",
      "CONTAINER: R-Cloud Kubernetes pods running [Active]",
      "MISSION: Fetching Farid Huseynov's CV profiles...",
      "READY: Welcome, Captain. Access granted."
    ]
    
    let currentLine = 0
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setTerminalLines((prev) => [...prev, lines[currentLine]])
        currentLine++
      } else {
        clearInterval(interval)
        setTimeout(() => setBooting(false), 600)
      }
    }, 250)

    return () => clearInterval(interval)
  }, [])

  // Структурированные данные твоего резюме
  const skills = {
    languages: [
      { name: "Java 21", level: 95 },
      { name: "Python", level: 80 },
      { name: "SQL (PostgreSQL/TiDB)", level: 85 },
      { name: "JavaScript / TypeScript", level: 75 },
      { name: "Swift (iOS)", level: 70 }
    ],
    frameworks: ["Spring Boot", "Spring Security", "Spring Data JPA", "Spring Cloud", "Spring AI", "OAuth2", "Express.js", "Docker", "Kubernetes (R-Cloud)"]
  }

  if (booting) {
    return (
      <div className="h-full w-full bg-[#0a0f1d] font-mono text-emerald-400 p-6 flex flex-col justify-end box-border">
        <div className="space-y-2 max-w-3xl">
          <div className="text-4xl animate-pulse mb-6 text-sky-400">🚀 DIGITAL SAMURAI CORE</div>
          {terminalLines.map((line, index) => (
            <div key={index} className="text-sm md:text-base leading-relaxed tracking-wide">
              <span className="text-slate-500">&gt;&gt;</span> {line}
            </div>
          ))}
          <div className="w-6 h-4 bg-emerald-400 animate-ping inline-block mt-2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans overflow-hidden border border-slate-800 rounded-xl shadow-2xl">

      <div className="flex-1 flex overflow-hidden">
        
        <div className="w-16 sm:w-60 bg-[#0d1117] border-r border-slate-800 flex flex-col font-mono">
          <div className="p-3 hidden sm:block text-[11px] font-bold text-slate-500 tracking-widest uppercase border-b border-slate-800/50">
            Navigation / Files
          </div>
          
          <nav className="flex-1 p-2 space-y-1">
            {[
              { id: "summary.java", label: "summary.java", icon: User, color: "text-amber-400" },
              { id: "skills.json", label: "skills.json", icon: FileCode, color: "text-sky-400" },
              { id: "experience.sh", label: "experience.sh", icon: Briefcase, color: "text-emerald-400" },
              { id: "projects.go", label: "projects.go", icon: FolderGit2, color: "text-purple-400" },
              { id: "education.md", label: "education.md", icon: GraduationCap, color: "text-rose-400" },
            ].map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-center sm:justify-start space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive 
                      ? "bg-slate-800 text-white shadow-inner border border-slate-700" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                  <span className="hidden sm:inline truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Виджет Спутника в углу */}
          <div className="p-3 hidden sm:block border-t border-slate-800/60 bg-[#161b22]/30 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-bold">
              <Rocket className="w-3 h-3 animate-bounce" />
              <span>MISSION DETAILS</span>
            </div>
            <div>Target: Full-Stack / Backend</div>
            <div>Steward: Farid Huseynov</div>
          </div>
        </div>

        {/* Главное окно редактора / Терминала */}
        <div className="flex-1 bg-[#090d13] flex flex-col overflow-auto p-4 md:p-8 font-mono text-sm leading-relaxed">
          
          {/* Контент вкладки: Summary */}
          {activeTab === "summary.java" && (
            <div className="space-y-6 max-w-3xl animate-fadeIn">
              <div>
                <span className="text-[#ff7b72]">public class</span> <span className="text-[#f0883e]">SoftwareEngineer</span> {"{"}
                <div className="pl-4 md:pl-8 mt-2 text-slate-400">
                  <span className="text-[#ff7b72]">private String</span> name = <span className="text-[#a5d6ff]">"Huseynov Farid"</span>;
                  <br />
                  <span className="text-[#ff7b72]">private String</span> callsign = <span className="text-[#a5d6ff]">"Digital Samurai (digisamu)"</span>;
                </div>
                {"}"}
              </div>

              <div className="bg-[#161b22] border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Terminal className="w-32 h-32 text-white" />
                </div>
                <h2 className="text-lg font-bold text-sky-400 mb-3 flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>SYSTEM_OVERVIEW // Professional Summary</span>
                </h2>
                <p className="text-slate-300 text-xs md:text-sm font-sans leading-relaxed">
                  Java Software Engineer with over a year of experience in internal web service development using Java 21
                  and the Spring ecosystem. Demonstrated ability to rapidly adapt to complex architectures and contribute
                  effectively to high-traffic ecosystems, gained through engineering experience at Rakuten and Dunya School.
                  Possesses a strong understanding of OOP, clean code principles, and relational databases.
                </p>
              </div>

              {/* Быстрые контакты Бортовой связи */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <a href="tel:+994704783977" className="flex items-center space-x-3 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-300 truncate">+994-70-478-39-77</span>
                </a>
                <a href="mailto:huseynovfarid1111@gmail.com" className="flex items-center space-x-3 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span className="text-xs text-slate-300 truncate">huseynovfarid1111@gmail.com</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-300 truncate">Farid Huseynov</span>
                </a>
              </div>
            </div>
          )}

          {/* Контент вкладки: Skills */}
          {activeTab === "skills.json" && (
            <div className="space-y-6 max-w-3xl animate-fadeIn">
              <h2 className="text-lg font-bold text-sky-400 flex items-center space-x-2 border-b border-slate-800 pb-2">
                <Cpu className="w-5 h-5 text-sky-400" />
                <span>CORE_ENGINE_PARAMETERS // Hard Skills</span>
              </h2>

              {/* Языки программирования в виде Прогресс баров энергосистем */}
              <div className="space-y-4">
                <div className="text-xs text-slate-400 mb-2">// Language Core Output:</div>
                {skills.languages.map((lang, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-200">{lang.name}</span>
                      <span className="text-sky-400">{lang.level}% Power</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
                      <div 
                        className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${lang.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Фреймворки в виде тегов микросхем */}
              <div className="pt-4">
                <div className="text-xs text-slate-400 mb-3">// Ecosystem & Tools Integration:</div>
                <div className="flex flex-wrap gap-2">
                  {skills.frameworks.map((fw, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs font-mono bg-slate-900 border border-slate-800 rounded-md text-slate-300 shadow-sm hover:border-slate-600 transition-colors">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Языковые Модули */}
              <div className="pt-4 border-t border-slate-800/60">
                <div className="text-xs text-slate-400 mb-3">// Communications Matrix:</div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg"><span className="text-emerald-400 font-bold">English:</span> C1 Professional</div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg"><span className="text-emerald-400 font-bold">Russian:</span> Native Communication</div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg"><span className="text-emerald-400 font-bold">Japanese:</span> N5 Foundational</div>
                </div>
              </div>
            </div>
          )}

          {/* Контент вкладки: Experience */}
          {activeTab === "experience.sh" && (
            <div className="space-y-8 max-w-3xl animate-fadeIn font-sans">
              <h2 className="text-lg font-mono font-bold text-emerald-400 flex items-center space-x-2 border-b border-slate-800 pb-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>LOG_TIMELINE // Work History</span>
              </h2>

              <div className="relative border-l-2 border-slate-800 pl-6 space-y-8 ml-3">
                
                {/* РАКУТЕН */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0d1117] border-2 border-emerald-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <h3 className="text-base font-bold text-white">Java Software Engineer Intern (Part-time)</h3>
                    <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Feb 2026 – Apr 2026
                    </span>
                  </div>
                  <div className="text-sm text-sky-400 font-mono mb-2">Rakuten Ichiba Division | Tokyo, Japan (Remote)</div>
                  <ul className="list-disc list-outside pl-4 space-y-1.5 text-slate-300 text-xs md:text-sm leading-relaxed">
                    <li>Assisted in the development and maintenance of high-traffic backend services for Japan's largest e-commerce ecosystem, using Java 17 and Spring Boot.</li>
                    <li>Gained hands-on experience with R-Cloud (Rakuten’s internal Kubernetes platform), deploying containerized microservices and managing cloud resources.</li>
                    <li>Monitored backend performance and system health using Prometheus and Grafana to identify latency bottlenecks.</li>
                    <li>Maintained and updated CI/CD pipelines through Bitbucket, automating delivery to staging environments.</li>
                  </ul>
                </div>

                {/* ДУНЬЯ ШКОЛА */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0d1117] border-2 border-slate-700 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <h3 className="text-base font-bold text-white">Java Web Developer Internship</h3>
                    <span className="text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
                      Oct 2024 – Mar 2025
                    </span>
                  </div>
                  <div className="text-sm text-sky-400 font-mono mb-2">Khazar University Dunya School | Sumqayit, Azerbaijan</div>
                  <ul className="list-disc list-outside pl-4 space-y-1.5 text-slate-300 text-xs md:text-sm leading-relaxed">
                    <li>Designed and implemented RESTful APIs using Java 21+ and Spring Boot to manage core educational data.</li>
                    <li>Implemented Spring Security and JWT (JSON Web Tokens) for secure user authentication across internal services.</li>
                    <li>Managed and queried PostgreSQL databases, optimizing SQL commands to ensure efficient retrieval for reporting.</li>
                  </ul>
                </div>

                {/* THREE/EDU */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#0d1117] border-2 border-slate-700 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <h3 className="text-base font-bold text-white">Backend Program Lead</h3>
                    <span className="text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
                      Jul 2023 – Present
                    </span>
                  </div>
                  <div className="text-sm text-sky-400 font-mono mb-2">&lt;Three/Edu&gt; | Baku, Azerbaijan</div>
                  <ul className="list-disc list-outside pl-4 space-y-1.5 text-slate-300 text-xs md:text-sm leading-relaxed">
                    <li>Designed and implemented training programs for Python, Backend development, and foundational Frontend concepts.</li>
                    <li>Mentored and instructed over 100+ students, successfully transitioning them from basic concepts to full-stack architectures.</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* Контент вкладки: Projects */}
          {activeTab === "projects.go" && (
            <div className="space-y-6 max-w-3xl animate-fadeIn font-sans">
              <h2 className="text-lg font-mono font-bold text-purple-400 flex items-center space-x-2 border-b border-slate-800 pb-2">
                <FolderGit2 className="w-5 h-5 text-purple-400" />
                <span>MISSION_OBJECTIVES // Projects</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* DuckVest */}
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-md hover:border-purple-500/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">DuckVest</h3>
                    <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">Sim Brokerage</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Developed a Spring Boot backend simulating a stockbrokerage platform with trading, user portfolios, and real-time market data integration.
                  </p>
                  <div className="text-[11px] font-mono text-slate-500 pt-2">
                    Tech: Java 21+, Spring Boot, React, PostgreSQL
                  </div>
                </div>

                {/* MyGarden */}
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-md hover:border-purple-500/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">MyGarden</h3>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">🏆 3rd Place Hackathon</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Led the team and worked on both idea development and backend implementation of a Smart Irrigation Decision Support System MVP for “Yaşıl Qarabağ”.
                  </p>
                  <div className="text-[11px] font-mono text-slate-500 pt-2">
                    Tech: Express.js, React, MongoDB
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Контент вкладки: Education */}
          {activeTab === "education.md" && (
            <div className="space-y-6 max-w-3xl animate-fadeIn">
              <h2 className="text-lg font-bold text-rose-400 flex items-center space-x-2 border-b border-slate-800 pb-2">
                <GraduationCap className="w-5 h-5 text-rose-400" />
                <span>ARCHIVE_ACADEMY // Education</span>
              </h2>

              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 shadow-md">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">Bachelor of Information Technologies</h3>
                    <p className="text-sky-400 text-sm">Azerbaijan State University of Economics (UNEC)</p>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-mono">
                    2023 - 2027
                  </span>
                </div>
                <div className="text-xs text-slate-400 pt-2 font-mono">
                  &gt; Faculty: Digital Economy <br />
                  &gt; Status: Current Node [Active Academic Lifecycle]
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Командный Нижний Статус-бар с триггером Скачивания резюме */}
      <div className="bg-[#161b22] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2 text-slate-500">
          <span>LF</span>
          <span>UTF-8</span>
          <span className="hidden sm:inline">🚀 SpaceOS Engine v2</span>
        </div>
        
        {/* Кнопка мгновенного скачивания резюме из папки public */}
        <a 
          href="/resume.pdf" 
          download="Farid_Huseynov_Resume.pdf"
          className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-1.5 rounded-lg shadow transition-all active:scale-95 text-xs font-sans"
        >
          <Download className="w-3.5 h-3.5" />
          <span>DOWNLOAD CV</span>
        </a>
      </div>

    </div>
  )
}
