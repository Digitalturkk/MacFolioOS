"use client"

import { useState, useEffect } from "react"
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  Terminal as TerminalIcon, 
  Play, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  Layers,
  Search,
  GitBranch
} from "lucide-react"

interface VSCodeJavaProps {
  isDarkMode?: boolean
}

// Эмуляция структуры Spring Boot проекта
const javaFiles = {
  "UserApplication.java": {
    name: "UserApplication.java",
    path: "src/main/java/com/unec/digital/UserApplication.java",
    content: `package com.unec.digital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
    }
}`
  },
  "UserController.java": {
    name: "UserController.java",
    path: "src/main/java/com/unec/digital/controller/UserController.java",
    content: `package com.unec.digital.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping
    public ResponseEntity<List<String>> getAllUsers() {
        return ResponseEntity.ok(List.of("Farid", "Eldar", "Saida"));
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody String user) {
        return ResponseEntity.status(201).body("User created: " + user);
    }
}`
  },
  "application.yml": {
    name: "application.yml",
    path: "src/main/resources/application.yml",
    content: `server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/digital_db
    username: postgres
    password: top_secret_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true`
  },
  "pom.xml": {
    name: "pom.xml",
    path: "pom.xml",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.unec</groupId>
    <artifactId>digital-economy</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
    </dependencies>
</project>`
  }
}

export default function VSCodeJava({ isDarkMode = true }: VSCodeJavaProps) {
  const [activeFile, setActiveFile] = useState<keyof typeof javaFiles>("UserController.java")
  const [isStructureOpen, setIsStructureOpen] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Microsoft Windows [Version 10.0.22631]",
    "(c) Корпорация Майкрософт (Microsoft Corporation). Все права защищены.",
    "",
    "farid@unec-digital-economy MINGW64 /d/projects/backend",
    "$ "
  ])

  // Симуляция логов запуска Spring Boot
  const runSpringApp = () => {
    if (isRunning) return
    setIsRunning(true)
    
    const logs = [
      "$ mvn spring-boot:run",
      "[INFO] Scanning for projects...",
      "[INFO] Bootstrapping Spring Data repositories...",
      "[INFO] Found 1 JPA repository interfaces.",
      " ",
      "  .   ____          _            __ _ _",
      " /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\\\ \\\\ \\\\ \\\\",
      "( ( )\\\\___ | '_ | '_| | '_ \\\\/ _\` | \\\\ \\\\ \\\\ \\\\",
      " \\\\/  ___)| |_)| |  | | | | | (_| |  ) ) ) )",
      "  '  |____| .__|_|  |_|_| |_|\\\\__, | / / / /",
      " =========|_|==============|___/============= ",
      " :: Spring Boot ::                (v3.2.4)",
      " ",
      "2026-06-16T12:45:01.234Z  INFO 14208 --- [main] c.u.digital.UserApplication : Starting UserApplication using Java 17...",
      "2026-06-16T12:45:01.982Z  INFO 14208 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)",
      "2026-06-16T12:45:02.451Z  INFO 14208 --- [main] o.h.e.t.j.p.i.ComponentContainerEntityManagerFactory : HHH000204: Processing PersistenceUnitInfo [name: default]",
      "2026-06-16T12:45:03.102Z  INFO 14208 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path '/api'",
      "2026-06-16T12:45:03.115Z  INFO 14208 --- [main] c.u.digital.UserApplication : Started UserApplication in 2.14 seconds (process running for 2.8)"
    ]

    let currentLogIndex = 0
    setTerminalLogs((prev) => [...prev, logs[0]])

    const interval = setInterval(() => {
      currentLogIndex++
      if (currentLogIndex < logs.length) {
        setTerminalLogs((prev) => [...prev, logs[currentLogIndex]])
      } else {
        clearInterval(interval)
      }
    }, 150)
  }

  // Стилизация под тему VS Code (One Dark Pro / Quiet Light)
  const theme = {
    bg: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#f3f3f3]",
    sidebar: isDarkMode ? "bg-[#252526]" : "bg-[#e8e8e8]",
    activityBar: isDarkMode ? "bg-[#333333]" : "bg-[#2c2c2c]",
    editorBg: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#ffffff]",
    terminalBg: isDarkMode ? "bg-[#181818]" : "bg-[#f0f0f0]",
    text: isDarkMode ? "text-[#d4d4d4]" : "text-[#333333]",
    textMuted: isDarkMode ? "text-[#858585]" : "text-[#707070]",
    border: isDarkMode ? "border-[#2b2b2b]" : "border-[#d0d0d0]",
    accent: "bg-[#007acc] text-white",
    tokenKeyword: "text-[#C586C0]", // @RestController, package, public
    tokenClass: "text-[#4EC9B0]",   // ResponseEntity, String
    tokenMethod: "text-[#DCDCAA]",  // getAllUsers, run
    tokenString: "text-[#CE9178]",  // "/api/v1/users"
    tokenAnnotation: "text-[#DCDCAA]"
  }

  // Функция для примитивной декоративной подсветки синтаксиса Java
  const highlightJava = (code: string) => {
    return code.split("\n").map((line, i) => {
      let formatted = line
        .replace(/(package|import|public|class|interface|static|void|return|new|private)/g, `<span class="${theme.tokenKeyword}">$1</span>`)
        .replace(/(@\w+)/g, `<span class="text-[#DCDCAA] font-medium">$1</span>`)
        .replace(/(ResponseEntity|String|List|UserApplication|SpringApplication)/g, `<span class="${theme.tokenClass}">$1</span>`)
        .replace(/(["'].*?["'])/g, `<span class="${theme.tokenString}">$1</span>`)
        
      return (
        <div key={i} className="flex font-mono text-[13px] leading-5 whitespace-pre">
          <span className="w-10 text-right pr-4 select-none opacity-30 text-xs mt-0.5">{i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: formatted || " " }} />
        </div>
      )
    })
  }

  return (
    <div 
      className={`h-full w-full flex flex-col ${theme.bg} ${theme.text} select-none font-sans`}
      style={{ borderBottomLeftRadius: "inherit", borderBottomRightRadius: "inherit" }}
    >
      {/* Топ-бар инструментов (Toolbar) */}
      <div className={`h-9 w-full ${theme.sidebar} flex items-center justify-between px-3 border-b ${theme.border} text-xs`}>
        <div className="flex items-center space-x-4">
          <span className="font-semibold opacity-80">Workspace [Java Build]</span>
          <span className={`${theme.textMuted} truncate max-w-[300px]`}>{javaFiles[activeFile].path}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={runSpringApp}
            disabled={isRunning}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#2ea043] text-white font-medium hover:bg-[#3fb950] transition-colors shadow-sm disabled:opacity-50`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunning ? "Running..." : "Run App"}</span>
          </button>
        </div>
      </div>

      {/* Основной рабочая область */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Активити-бар (Узкая вертикальная панель слева) */}
        <div className={`w-12 h-full ${theme.activityBar} flex flex-col items-center py-2 space-y-4 text-neutral-400`}>
          <Layers className="w-5 h-5 text-white cursor-pointer" />
          <Search className="w-5 h-5 hover:text-white cursor-pointer" />
          <GitBranch className="w-5 h-5 hover:text-white cursor-pointer" />
          <Settings className="w-5 h-5 hover:text-white cursor-pointer absolute bottom-3" />
        </div>

        {/* Сайдбар структуры проекта (Project Explorer) */}
        <div className={`w-52 h-full ${theme.sidebar} border-r ${theme.border} flex flex-col pt-2 text-xs`}>
          <div 
            className="flex items-center px-2 py-1 font-bold uppercase tracking-wider text-[10px] cursor-pointer opacity-70"
            onClick={() => setIsStructureOpen(!isStructureOpen)}
          >
            {isStructureOpen ? <ChevronDown className="w-3.5 h-3.5 mr-1" /> : <ChevronRight className="w-3.5 h-3.5 mr-1" />}
            DIGITAL-ECONOMY [MAVEN]
          </div>

          {isStructureOpen && (
            <div className="mt-1 space-y-0.5">
              <div className="flex items-center px-3 py-1 opacity-60"><Folder className="w-4 h-4 mr-1.5 text-sky-500" /> src/main/java</div>
              
              {/* Контроллеры */}
              <div className="flex items-center px-6 py-1 text-sky-400 font-medium"><FolderOpen className="w-4 h-4 mr-1.5" /> controller</div>
              <button 
                onClick={() => setActiveFile("UserController.java")}
                className={`w-full flex items-center pl-9 pr-2 py-1 text-left ${activeFile === "UserController.java" ? "bg-white/[0.08] font-semibold" : "hover:bg-white/[0.03]"}`}
              >
                <FileCode className="w-3.5 h-3.5 mr-1.5 text-orange-400" /> UserController.java
              </button>

              {/* Главный запуск */}
              <button 
                onClick={() => setActiveFile("UserApplication.java")}
                className={`w-full flex items-center pl-9 pr-2 py-1 text-left ${activeFile === "UserApplication.java" ? "bg-white/[0.08] font-semibold" : "hover:bg-white/[0.03]"}`}
              >
                <FileCode className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> UserApplication.java
              </button>

              <div className="flex items-center px-3 py-1 opacity-60"><Folder className="w-4 h-4 mr-1.5 text-emerald-500" /> resources</div>
              <button 
                onClick={() => setActiveFile("application.yml")}
                className={`w-full flex items-center pl-6 pr-2 py-1 text-left ${activeFile === "application.yml" ? "bg-white/[0.08] font-semibold" : "hover:bg-white/[0.03]"}`}
              >
                <FileCode className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> application.yml
              </button>

              <button 
                onClick={() => setActiveFile("pom.xml")}
                className={`w-full flex items-center pl-3 pr-2 py-1 text-left ${activeFile === "pom.xml" ? "bg-white/[0.08] font-semibold" : "hover:bg-white/[0.03]"}`}
              >
                <FileCode className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> pom.xml
              </button>
            </div>
          )}
        </div>

        {/* Правая часть: Редактор кода + Встроенный Терминал */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Вкладки (Tabs) */}
          <div className={`h-9 w-full ${theme.sidebar} flex items-center border-b ${theme.border} overflow-x-auto`}>
            <div className={`h-full flex items-center px-4 border-r ${theme.border} ${theme.editorBg} text-xs font-medium border-t-2 border-t-sky-500`}>
              <FileCode className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
              {javaFiles[activeFile].name}
            </div>
          </div>

          {/* Рабочее поле редактора кода */}
          <div className={`flex-1 overflow-y-auto py-3 ${theme.editorBg} select-text text-left`}>
            {highlightJava(javaFiles[activeFile].content)}
          </div>

          {/* Встроенный Терминал (Spring Boot Logs Output) */}
          <div className={`h-48 w-full ${theme.terminalBg} border-t ${theme.border} flex flex-col font-mono text-xs overflow-hidden`}>
            <div className={`h-7 w-full ${theme.sidebar} flex items-center px-3 justify-between text-[11px]`}>
              <div className="flex items-center space-x-2 font-semibold">
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>Terminal (spring-boot-runtime)</span>
              </div>
            </div>
            <div className="flex-1 p-3 overflow-y-auto select-text space-y-1 text-left text-neutral-300">
              {terminalLogs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap leading-relaxed">{log}</div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}