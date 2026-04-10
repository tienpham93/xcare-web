# X-Care Web Portal

A professional healthcare diagnostic interface and patient portal built with **React 19**, **Vite**, and **Bun**. This application serves as the primary frontend for the X-Care AI system, providing a secure and intuitive environment for medical consultations and diagnostic tracking.

## 🏗 Architecture

The project is structured as a **Bun Workspace** (Monorepo) to ensure seamless management of both the frontend and the proxy server:

- **`app/frontend`**: A high-performance React application powered by Vite.
- **`app/server`**: An Express-based Backend For Frontend (BFF) that manages authentication and proxies requests to the core `xcare-server` AI layer.

## 🚀 Key Features

- **Secure Healthcare Login**: JWT-based authentication with automatic token expiry management.
- **Interactive Medical Chatbox**: Real-time diagnostic consultations with the X-Care agent.
- **Patient Dashboard**: Visualization of diagnostic metrics and medical history.
- **Healthcare Hot Topics**: Curated feed of relevant medical news and critical health alerts.
- **Feedback Loop**: Integrated voting and analytical submission for diagnostic quality improvement.

## 🛠 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Frontend Framework**: React 19 (Functional Components + Hooks)
- **Styling**: Vanilla CSS (Modern Design System)
- **Routing**: React Router 6
- **Server**: Express (Node/Bun)
- **Build Tool**: Vite 6

## 🚦 Quick Start

### 1) Prerequisites
- [Bun](https://bun.sh/) installed on your machine.
- The `xcare-server` must be running for data fetching.

### 2) Install Dependencies
Run from the project root:
```bash
bun install
```

### 3) Configure Environment
Update `app/frontend/src/env.ts` and `app/server/src/env.ts` with your local port configurations if different from defaults.

### 4) Start the Application
You can start both the frontend and the BFF server simultaneously using the root script:
```bash
bun start
```

Alternatively, you can start them individually:
```bash
bun run start:frontend # Starts Vite Dev Server
bun run start:server   # Starts Express BFF
```

## 🧪 Development Scripts

```bash
bun run format      # Formats code using Prettier
bun run build:all   # Executes production builds for both apps
bun run clean:all   # Cleans build artifacts and node_modules
```

---
*Created by the X-Care Engineering Team.*
