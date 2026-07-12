# ArcLearn

A comprehensive, interactive learning platform for programming languages, frameworks, AI, system design, and security — with 1666+ topics, 45 guides, and 62 hand-crafted SVG diagrams.

## What's Inside

### Languages (14 guides — 979 topics)
Python, JavaScript, Java, C, C++, Rust, Go, C#, PHP, TypeScript, HTML, CSS, SQL, React

### Frameworks (9 guides — 193 topics)
Next.js, Vue.js, Angular, Express.js, Django, Flask, FastAPI, Spring Boot, Tailwind CSS

### Mobile (3 guides — 203 topics)
Kotlin, Dart, Swift

### Tools (5 guides — 79 topics)
Git, GitHub, Docker, Linux & Bash, CI/CD

### AI & Machine Learning (6 guides — 122 topics)
Machine Learning, Deep Learning, NLP, Computer Vision, Agentic AI, Generative AI

### System Design (4 guides — 41 topics)
Data Structures & Algorithms, System Design, API Design, Database Design

### Security (4 guides — 49 topics)
Cybersecurity, Ethical Hacking, OWASP Top 10, Cryptography

## Features

- **1666+ detailed topics** with code examples and quizzes
- **62 SVG diagrams** — hand-crafted, matching UI style
- **Interactive code sandboxes** for every topic
- **Progress tracking** — mark topics complete, see percentage
- **Search** across all topics and guides
- **7 category tabs** — Languages, Frameworks, Mobile, Tools, AI, System Design, Security
- **Responsive design** — works on desktop and mobile
- **Multi-question quiz flow** with instant feedback

## Tech Stack

- React + Vite
- Zustand for state management
- React Router for navigation
- Custom SVG diagrams (no external dependencies)

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
guide/
  languages/       - 14 programming language guides
  frameworks/      - 9 framework guides
  mobile/          - 3 mobile development guides
  tools/           - 5 developer tool guides
  ai/              - 6 AI & ML guides
  system-design/   - 4 system design guides
  security/        - 4 security guides
public/
  diagrams/        - 62 hand-crafted SVG diagrams
src/
  pages/           - Home, Learn, Search pages
  components/      - Sidebar, Quiz, LessonViewer
  lib/             - Guide loader, display names
  store/           - Zustand progress store
```

## License

MIT
