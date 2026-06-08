# Compensation Intelligence Platform

<div align="center">
  <h3>Data-driven compensation intelligence platform for HR professionals, managers, and engineers.</h3>
</div>

---

## 📖 Project Overview

**Purpose:** Provide real-time, verified compensation intelligence across companies, levels, and geographic locations.

**Business Value:** Eliminates information asymmetry in tech compensation. Empowers candidates to negotiate better offers and helps companies price talent accurately using AI-driven insights.

**Target Users:** 
- Software Engineers & Tech Professionals (Candidates)
- Hiring Managers & Recruiters (Employers)
- HR Compensation Analysts

**Problem Being Solved:** Compensation data is traditionally fragmented, outdated, or hidden behind expensive paywalls. This platform democratizes compensation structures by providing structured level mappings, location-based cost-of-living adjustments, and AI-powered offer negotiation strategies.

---

## ✨ Key Features

- **Authentication:** Enterprise-grade OAuth (Google, GitHub) & Credentials login.
- **Salary Explorer:** Advanced filtering for global compensation data.
- **Company Intelligence:** Deep dives into company-specific compensation bands.
- **Level Intelligence:** Algorithmic level mapping across top tech companies (e.g., Google L5 = Meta E5).
- **Compensation Comparison:** Side-by-side comparison of multiple compensation packages.
- **AI Advisor:** Gemini-powered autonomous agent for personalized career and negotiation advice.
- **Offers Analysis:** Detailed breakdown and scoring of job offers.
- **Negotiation Intelligence:** AI-generated negotiation strategies and counter-offer recommendations.
- **Analytics:** Macro-level trends on global compensation shifts.
- **Profile Management:** Comprehensive professional profile tracking.
- **Settings:** Extensive user preferences, privacy, and security controls.
- **Watchlist & Saved:** Track specific companies, roles, and locations over time.

---

## 🖥️ Platform Screens

| Screen | Description |
|--------|-------------|
| **Dashboard** | Personalized overview of saved comparisons, recent insights, and market trends. |
| **Explorer** | Global database of compensation entries with granular filtering. |
| **Companies** | Directory of tech companies with compensation bands and level structures. |
| **Locations** | Geographic compensation analysis and cost-of-living adjustments. |
| **Levels** | Cross-company level mapping and promotion intelligence. |
| **Analytics** | Macro-level charts showing market trends and YoY compensation growth. |
| **Offers** | Offer management, scoring, and side-by-side comparison. |
| **AI Advisor** | Chat interface with the Principal AI Compensation Advisor. |
| **Profile** | Professional onboarding and experience management. |
| **Settings** | Enterprise account center for security, billing, and connected accounts. |

---

## 🏗️ Architecture Overview

The system is built as a **Modular Monolith** using Next.js App Router, enabling rapid development while maintaining clean module boundaries for future microservice extraction.

```mermaid
graph TD
    User([User]) --> Frontend[Next.js React Frontend]
    Frontend --> API[Next.js API Routes]
    
    subgraph Core Platform
        API --> Auth[NextAuth.js]
        API --> DB_Layer[Prisma ORM]
    end
    
    subgraph Intelligence Engine
        API --> AIService[AI Services]
        AIService --> Gemini[Google Gemini API]
    end
    
    DB_Layer --> Postgres[(PostgreSQL)]
```

---

## 📐 High Level Design (HLD)

### Frontend Layer
- **Tech:** Next.js 14, React, TypeScript, TailwindCSS, Shadcn UI
- **Responsibilities:** Server-side rendering, routing, state management, and highly interactive UI components (dashboards, charts).

### Backend Layer
- **Tech:** Next.js API Routes (Serverless)
- **Responsibilities:** Handling HTTP requests, business logic execution, data validation (Zod), and orchestrating external services.

### Database Layer
- **Tech:** PostgreSQL + Prisma ORM
- **Responsibilities:** Relational data storage, indexing, referential integrity, and complex aggregations.

### AI Layer
- **Tech:** Vercel AI SDK + Google Gemini (`gemini-2.5-flash`)
- **Responsibilities:** Streaming text generation, structured JSON extraction for offer analysis, and autonomous advisory capabilities.

### Authentication Layer
- **Tech:** NextAuth.js
- **Responsibilities:** OAuth handshakes (Google, GitHub), credential hashing (bcrypt), session management (JWT), and route protection.

---

## 🔍 Low Level Design (LLD)

### Auth Module
- **Routes:** `/api/auth/[...nextauth]`, `/login`, `/signup`
- **Responsibilities:** Securely authenticating users and managing sessions.

### Offers Module
- **Routes:** `/api/offers`, `/api/insights/negotiation`
- **Responsibilities:** Storing candidate offers and calculating compensation percentiles.

### Advisor Module
- **Routes:** `/api/advisor/chat`, `/api/advisor/conversations`
- **Responsibilities:** Managing conversational history and streaming AI responses.

### Levels Module
- **Routes:** `/api/levels`, `/api/levels/intelligence`
- **Responsibilities:** Aggregating data to map equivalent levels across the industry.

### Explorer & Analytics
- **Routes:** `/api/salaries`, `/api/stats/*`
- **Responsibilities:** Complex DB queries grouping compensation data by role, level, and location.

---

## 🗄️ Database Design

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o{ CompensationSubmission : submits
    User ||--o{ SavedComparison : saves
    User ||--o{ AdvisorConversation : initiates

    Company ||--o{ Level : defines
    Company ||--o{ CompensationEntry : contains

    RoleFamily ||--o{ CompensationEntry : categorizes
    Location ||--o{ CompensationEntry : geographically_bounds

    Level ||--o{ CompensationEntry : scopes
    Level ||--o{ Offer : scopes

    Candidate ||--o{ Offer : receives
    Offer ||--o{ NegotiationInsight : generates

    AdvisorConversation ||--o{ AdvisorMessage : contains
```

---

## 🔌 API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | POST/GET | Handles OAuth and credential login. |
| `/api/user/profile` | GET/PUT | Fetches and updates the authenticated user's profile. |
| `/api/levels/intelligence`| GET | Returns cross-company level mapping matrices. |
| `/api/salaries` | GET | Retrieves paginated and filtered compensation entries. |
| `/api/offers` | POST | Submits a new job offer for AI analysis. |
| `/api/advisor/chat` | POST | Streams AI responses for the compensation advisor. |
| `/api/companies` | GET | Retrieves company directory and metadata. |
| `/api/stats/global` | GET | Returns macro-level compensation statistics. |

---

## 🔐 Authentication Flow

```mermaid
graph TD
    A[Google/GitHub Login] --> B[NextAuth Provider]
    B --> C{User Record Exists?}
    C -->|No| D[Create User in Database]
    C -->|Yes| E[Generate Secure Session JWT]
    D --> E
    E --> F{Onboarding Complete?}
    F -->|No| G[Redirect to /onboarding/profile]
    F -->|Yes| H[Redirect to /dashboard]
```

---

## 🚀 Profile Completion Flow

```mermaid
graph TD
    A[New Account Created] --> B[Redirect to Onboarding Wizard]
    B --> C[Fetch Google/GitHub Avatar & Name]
    C --> D[User Inputs Experience & Company]
    D --> E[API: PUT /api/user/profile]
    E --> F[Set onboardingCompleted = true]
    F --> G[Redirect to Dashboard]
```

---

## 🤖 AI Advisor Flow

```mermaid
graph TD
    A[User Submits Question] --> B[API: /api/advisor/chat]
    B --> C[Fetch Conversation Context]
    C --> D[Inject DB Data Context]
    D --> E[Vercel AI SDK]
    E --> F[Google Gemini API]
    F --> G[Stream Response chunks]
    G --> H[UI Rendering]
    H --> I[Save to DB]
```

---

## 📈 Level Intelligence Flow

```mermaid
graph TD
    A[Raw Compensation Data] --> B[Prisma Aggregation]
    B --> C[Calculate Median Total Comp]
    C --> D[Rank Levels by Compensation]
    D --> E[Cross-Company Alignment Matrix]
    E --> F[UI: Enterprise Level Ladder]
```

---

## 🛠️ Technology Stack

**Frontend:** Next.js 14, React, TypeScript, TailwindCSS, Shadcn UI, Framer Motion, Recharts  
**Backend:** Next.js API Routes, Node.js, Prisma, Zod  
**Database:** PostgreSQL (Neon/Supabase)  
**AI & ML:** Google Gemini 2.5 Flash, Vercel AI SDK  
**Authentication:** NextAuth.js (v4), bcryptjs  
**Deployment:** Vercel (Edge Network & Serverless)

---

## 📦 Microservice Mapping (Future Roadmap)

If the platform scales beyond the Modular Monolith, it will decompose into:

```mermaid
graph LR
    Gateway[API Gateway] --> Auth[Auth Service]
    Gateway --> Comp[Compensation Service]
    Gateway --> AI[AI & Insights Service]
    
    Auth --> UserDB[(User DB)]
    Comp --> CompDB[(Comp DB)]
    AI --> Redis[(Cache)]
    AI --> Gemini[Gemini API]
```

---

## 🛡️ Security
- **Authentication:** HTTP-only cookies, JWT encryption.
- **Authorization:** Middleware route protection, API boundary checks.
- **Input Validation:** Strict Zod schema parsing on all POST/PUT requests.
- **AI Safety:** System prompt injection barriers, output sanitization.

---

## ⚡ Performance
- **Caching:** Next.js Data Cache (`force-cache`, `revalidate`), React query caching.
- **Database:** Prisma connection pooling, indexed foreign keys (`@@index`), optimized relation loading.
- **UI:** Lazy loaded charts, deferred component hydration.

---

## 🚀 Installation & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/your-org/compensation-intelligence-system.git
cd compensation-intelligence-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/compensation_db"
AUTH_SECRET="your-32-char-secret-key"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your_google_oauth_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_secret"
GITHUB_CLIENT_ID="your_github_oauth_id"
GITHUB_CLIENT_SECRET="your_github_oauth_secret"

GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```
Access the application at `http://localhost:3000`.

---

## 📊 Feature Inventory Status

| Module | Status |
|--------|--------|
| Authentication | ✅ Implemented |
| Dashboard | ✅ Implemented |
| Salary Explorer | ✅ Implemented |
| Companies | ✅ Implemented |
| Locations | ✅ Implemented |
| Levels | ✅ Implemented |
| Analytics | ✅ Implemented |
| Offers | ✅ Implemented |
| AI Advisor | ✅ Implemented |
| Profile | ✅ Implemented |
| Settings | ✅ Implemented |
| Saved Items | ⚠️ Partial |
| Billing | ❌ Missing |

---

## 📜 License
Proprietary / Closed Source. All rights reserved.
