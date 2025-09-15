Of course. A great `README.md` is the final, crucial step to showcase your work professionally. Based on your code and the assignment requirements, here is a complete `README.md` file.

You can copy and paste this entire block of text directly into the `README.md` file in your project's root directory.

-----

# Lead Scoring Engine - Kuvaka Tech Assignment

This project is a backend service designed for a hiring assignment from Kuvaka Tech. The service automates the process of lead qualification by scoring potential customers based on a combination of rule-based logic and reasoning from a generative AI model (Google's Gemini).

The application is built with **Node.js**, **Express.js**, and is containerized using **Docker**.

## Features

  - **RESTful API:** Clean, well-documented endpoints for submitting product offers and lead data.
  - **Dual-Layer Scoring:** A hybrid scoring pipeline using both deterministic rules and AI-powered analysis.
  - **CSV Handling:** Accepts lead data via CSV file uploads.
  - **AI Integration:** Leverages the Google Gemini model for nuanced lead intent classification.
  - **Dockerized:** Fully containerized for easy setup, deployment, and consistent runtime environments.
  - **Bonus: CSV Export:** An endpoint to export the final scored results as a downloadable CSV file.

## Project Structure

The project follows a standard Node.js service architecture, separating concerns into routes, controllers, and services.

```
/kuvaka-backend-task
|
|-- /src
|   |-- /controllers
|   |   |-- lead.controller.js  // Handles request/response logic for all endpoints
|   |
|   |-- /routes
|   |   |-- api.routes.js       // Defines all API routes and connects them to controllers
|   |
|   |-- /services
|   |   |-- ai.service.js       // Contains all logic for interacting with the Gemini AI
|   |   |-- scoring.service.js  // Contains the rule-based scoring logic
|   |
|   |-- /middleware
|   |   |-- upload.js           // Multer configuration for handling CSV file uploads
|
|-- .env                      // For storing secret API keys
|-- .gitignore                // Specifies files for Git to ignore
|-- Dockerfile                // Recipe for building the Docker image
|-- .dockerignore             // Specifies files for Docker to ignore
|-- package.json              // Project metadata and dependencies
|-- index.js                 // Main application entry point
|-- README.md                 // This file!
```

## Deployed URL

The service is deployed on Render and is accessible at the following base URL:
**`https://kuvaka-tech-task.onrender.com/`**

-----

## Setup and Installation

### 1\. Running Locally

**Prerequisites:**

  * Node.js (v18 or later)
  * npm

**Instructions:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/imdeeep/kuvaka-tech-task
    cd kuvaka-backend-task
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add your Google Gemini API key:

    ```
    GEMINI_API_KEY="your_google_ai_studio_api_key_here"
    ```

4.  **Start the server:**

    ```bash
    npm run dev
    ```

    The server will be running at `http://localhost:3000`.

### 2\. Running with Docker (Bonus)

**Prerequisites:**

  * Docker Desktop

**Instructions:**

1.  **Create a `.env` file** as described in the local setup section.

2.  **Build the Docker image:**

    ```bash
    docker build -t kuvaka-task-app .
    ```

3.  **Run the Docker container:**

    ```bash
    docker run -p 3000:3000 -d --name kuvaka-task-container --env-file .env kuvaka-task-app
    ```

    The server will be available at `http://localhost:3000`.

-----

## API Endpoints & Usage

Here is the full workflow for using the API. The base URL for all endpoints is `https://kuvaka-tech-task.onrender.com/api`.

### Sample CSV File

Before you begin, create a file named `leads.csv` with the following content:

```csv
name,role,company,industry,location,linkedin_bio
Ava Patel,Head of Growth,FlowMetrics,B2B SaaS,San Francisco,"Driving growth for mid-market SaaS companies through innovative demand generation and marketing automation strategies."
Ben Carter,Marketing Specialist,Innovate Corp,Tech Solutions,Austin,"Content creation and digital marketing for technology firms. Passionate about SEO and lead nurturing."
Clara Diaz,HR Assistant,Global Retail Inc.,Retail,New York,
```

### Step 1: Set the Product/Offer Details

  * **Endpoint:** `POST /api/offer`
  * **Description:** Submits the details of the product against which leads will be scored.

**cURL Request:**

```bash
curl -X POST https://kuvaka-tech-task.onrender.com/api/offer \
-H "Content-Type: application/json" \
-d '{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach", "6x more meetings"],
  "ideal_use_cases": ["B2B SaaS mid-market"]
}'
```

**Successful Response:**

```json
{ "message": "Offer details saved." }
```

### Step 2: Upload the CSV of Leads

  * **Endpoint:** `POST /api/leads/upload`
  * **Description:** Uploads a CSV file containing the leads to be scored.

**cURL Request:**
*(Run this command from the same directory where you saved `leads.csv`)*

```bash
curl -X POST https://kuvaka-tech-task.onrender.com/api/leads/upload \
-F "leadsFile=@leads.csv"
```

**Successful Response:**

```json
{ "message": "3 leads uploaded successfully." }
```

### Step 3: Trigger the Scoring Process

  * **Endpoint:** `POST /api/score`
  * **Description:** Starts the scoring pipeline, processing the uploaded leads against the submitted offer.

**cURL Request:**

```bash
curl -X POST https://kuvaka-tech-task.onrender.com/api/score
```

**Successful Response:**

```json
{ "message": "Scoring complete. Results are ready." }
```

### Step 4: Retrieve the Results

  * **Endpoint:** `GET /api/results`
  * **Description:** Fetches the final scored leads as a JSON array.

**cURL Request:**

```bash
curl https://kuvaka-tech-task.onrender.com/api/results
```

**Successful Response:**

```json
[
  {
    "name": "Ava Patel",
    "role": "Head of Growth",
    "company": "FlowMetrics",
    "intent": "High",
    "score": 90,
    "reasoning": "Fits ICP SaaS mid-market and role is a decision maker."
  },
  {
    "name": "Ben Carter",
    "role": "Marketing Specialist",
    "company": "Innovate Corp",
    "intent": "Medium",
    "score": 50,
    "reasoning": "Works in an adjacent tech industry and holds an influencer role, but is not a primary decision-maker."
  },
  {
    "name": "Clara Diaz",
    "role": "HR Assistant",
    "company": "Global Retail Inc.",
    "intent": "Low",
    "score": 10,
    "reasoning": "The prospect's industry (Retail) and role (HR) do not align with the ideal customer profile."
  }
]
```

### (Bonus) Step 5: Export Results as CSV

  * **Endpoint:** `GET /api/results/export`
  * **Description:** Downloads the final scored leads as a `results.csv` file.

**How to Use:**
Simply open the following URL in your web browser, and the file will download automatically:
`https://kuvaka-tech-task.onrender.com/api/results/export`

-----

## Scoring Logic & Prompts Explained

The final score for each lead is a sum of two components, with a maximum possible score of 100.

### Rule-Based Layer (Max 50 Points)

This layer provides a deterministic score based on concrete data points:

1.  **Role Relevance (0-20 points):**
      * **+20 points:** If the role contains keywords like `head`, `vp`, `director`, `manager`, `ceo`, etc., indicating a decision-maker.
      * **+10 points:** If the role contains keywords like `influencer` or `specialist`.
2.  **Industry Match (0-20 points):**
      * **+20 points:** If the industry is a direct match for the Ideal Customer Profile (e.g., contains "SaaS").
      * **+10 points:** If the industry is in an adjacent field (e.g., contains "tech").
3.  **Data Completeness (0-10 points):**
      * **+10 points:** If all fields in the lead's profile (`name`, `role`, `company`, `industry`, `location`, `linkedin_bio`) are present and non-empty.

### AI Layer (Max 50 Points)

This layer uses the Google Gemini model to provide a more nuanced analysis of the lead's buying intent.

  * **AI Prompt Used:** The following prompt is constructed and sent to the AI for each lead:

> ```
> Product/Offer Details:
> - Name: AI Outreach Automation
> - Value Propositions: 24/7 outreach, 6x more meetings
> - Ideal Use Cases: B2B SaaS mid-market
> ```

> Prospect (Lead) Details:
>
>   - Name: [Lead's Name]
>   - Role: [Lead's Role]
>   - Company: [Lead's Company]
>   - Industry: [Lead's Industry]
>   - Location: [Lead's Location]
>   - LinkedIn Bio: [Lead's LinkedIn Bio]

> Based on the product and prospect details, classify the buying intent of this prospect as "High", "Medium", or "Low".
> Then, provide a 1-2 sentence explanation for your classification.

> Format your response as a JSON object with two keys: "intent" and "reasoning".
> Example: {"intent": "High", "reasoning": "Fits ICP SaaS mid-market and role is a decision maker."}
>
> ```
> ```

  * **AI Score Mapping:** The AI's classification is mapped to points as follows:
      * **High** = 50 points
      * **Medium** = 30 points
      * **Low** = 10 points

The `Final Score` is the sum of the `Rule-Based Score` and the `AI Score`.

```
```