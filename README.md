# AI Tool Directory & Workflow Playbook

This project is a functional prototype built for a hackathon. It demonstrates a curated, context-driven AI tool directory designed to solve the problem of "overwhelming choice" presented by massive, unfiltered AI tool aggregators.

Our platform shifts the focus from simple discovery to practical application by providing industry-specific toolkits, actionable prompts, and skill-level tagging.

## Core Features

*   **Industry-Specific Curation**: Toolkits are organized by professional fields like Marketing, Healthcare, and Software Development, filtering out irrelevant tools.
*   **Actionable Prompts**: Every tool is paired with a ready-to-use prompt example, demonstrating its immediate value and lowering the barrier to entry.
*   **Skill-Level Tagging**: Tools are labeled as **Beginner**, **Intermediate**, or **Advanced** to guide users to the right solution for their expertise.
*   **Local User Authentication**: A lightweight, functional user registration and login system is included to simulate a complete user experience.

---

## Technical Stack

*   **Frontend**: React
*   **Mock Backend/Authentication**: `json-server` with `json-server-auth` for handling user registration and JWT-based login.
*   **Styling**: (Add your CSS framework here, e.g., CSS, Tailwind CSS, Material-UI)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js**: Version 14.0 or higher
*   **npm**: (Node Package Manager, included with Node.js)
*   **Git**

---

## Local Installation and Setup

To run this project on your local machine, please follow these steps:

**1. Clone the Repository**
Open your terminal and clone the project repository.

**2. Install Dependencies**
Install the necessary npm packages for both the frontend and the mock backend.

> **Note:** This will start a mock API server on `http://localhost:3000`. The server will watch the `db.json` file to persist user data. Leave this terminal running.

**3. Start the React Application**
In your original terminal window, run the command below to start the frontend application.

pnpm run dev


---

This prototype was developed by Team Cynaptix.
