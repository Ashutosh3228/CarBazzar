# 21 — Team Task Assignment & Issue Matrix

## Project Identity
- **Project Name:** CarBazaar
- **Tagline:** Buy. Sell. Drive.
- **Repository:** `https://github.com/Ashutosh3228/CarBazzar.git`
- **Development Model:** 4-Member Distributed Workflow (4 Independent Laptops)

---

## 1. Team Roster & Module Ownership

| Member | GitHub Username | Role & Primary Responsibility | Dedicated Feature Branch |
|---|---|---|---|
| **Ashutosh** | `@Ashutosh3228` | **Backend Foundation, Authentication & Security** | `feature/ashutosh-auth` |
| **Pradnya** | `@pradnya1107` | **Frontend Architecture, UI/UX, Home & Car Browsing** | `feature/pradnya-ui` |
| **Sakshi** | `@SakshiBhokare99` | **Car Marketplace, Sell Car, Listings & Inquiries** | `feature/sakshi-marketplace` |
| **Prashant** | `@Prashant-dev323` | **Admin Dashboard, Notifications, Moderation & QA** | `feature/prashant-admin` |

---

## 2. Development Phases & Milestones

The project roadmap is segmented into 10 distinct sequential and concurrent phases:

1. **Phase 1 - Setup:** Documentation, repository preparation, workflow rules, issue creation (Milestone 1).
2. **Phase 2 - Backend & Database:** Node.js/Express bootstrap, MongoDB connection, configuration, User model, security headers (Milestone 2).
3. **Phase 3 - Authentication:** JWT token service, bcrypt hashing, registration, login, OTP lifecycle, password recovery, auth middleware (Milestone 3).
4. **Phase 4 - Frontend:** React/Vite initialization, Tailwind CSS, design tokens, Axios service layer, Navbar, Footer, Home page, Auth UI (Milestone 4).
5. **Phase 5 - Marketplace:** Car schema, Listing CRUD APIs, image upload handler, Sell Car form, My Listings, Favorites, Inquiries (Milestone 5).
6. **Phase 6 - Search & Listings:** Multi-facet search/filtering/sorting/pagination backend APIs, Browse Cars page, Car Details gallery (Milestone 6).
7. **Phase 7 - Admin Panel:** Admin moderation APIs, Dashboard UI, Listing inspection/approval/rejection, Brand CRUD, Notifications (Milestone 7).
8. **Phase 8 - Integration:** Cross-module coordination, frontend-backend API contract alignment, state synchronization (Milestone 8).
9. **Phase 9 - Testing:** Authentication QA, Marketplace QA, Admin QA, Security audit (OWASP), Responsive testing, Regression testing (Milestone 9).
10. **Phase 10 - Deployment:** Cloud hosting configuration (Vercel, Render/Railway, MongoDB Atlas), environment variable injection, production release (Milestone 10).

---

## 3. Shared Responsibilities & Cross-Member Dependencies

```
                    ┌───────────────────────────────┐
                    │      Ashutosh (Backend)       │
                    └──────────────┬────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Pradnya (UI)    │      │ Sakshi (Market)  │      │ Prashant (Admin) │
│ - Auth Forms     │      │ - Car Schemas    │      │ - Admin APIs     │
│ - Axios Client   │      │ - Sell Car Form  │      │ - Moderation UI  │
│ - Browse Pages   │      │ - Filter Connect │      │ - Full QA Suites │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

1. **Authentication Integration (Ashutosh + Pradnya):**
   - Ashutosh exposes `/api/auth/*` endpoints and client-side AuthContext.
   - Pradnya hooks Login, Signup, OTP Verification, and Password Reset UI into the AuthContext and Axios interceptors.
2. **Marketplace Integration (Ashutosh + Sakshi):**
   - Ashutosh provides base database connection, user models, and auth middleware.
   - Sakshi builds Car, Favorite, and Inquiry models and endpoints, connecting with Pradnya's Car Cards and Browse page.
3. **Admin & Moderation Integration (Ashutosh + Prashant):**
   - Ashutosh provides role-based authorization middleware (`restrictTo('admin')`).
   - Prashant builds Admin endpoints, Dashboard UI, Brand management, and Notification dispatchers.
4. **Search & Filter Co-ownership (Pradnya + Sakshi):**
   - Sakshi implements backend multi-facet search/filter/sort API (`GET /api/cars`).
   - Pradnya designs the SearchBar, FilterPanel, and Browse Cars UI, and Sakshi connects query params with the live API.
5. **Final Integration & System QA (All 4 Members):**
   - All four members participate in PR code reviews, conflict resolution, end-to-end user journey validation, and pre-deployment smoke tests.

---

## 4. Master GitHub Issue Tracking Matrix

### Ashutosh (`feature/ashutosh-auth`)
*Focus: Backend Foundation, Authentication, OTP Engine, Security Middleware*

| Issue ID | Title | Priority | Milestone | Dependencies | Labels |
|---|---|---|---|---|---|
| **#1** | `[Backend] Setup Express Server & API Foundation` | High | Phase 2 | None | `backend`, `high-priority` |
| **#2** | `[Database] Setup MongoDB Connection & Mongoose Configuration` | High | Phase 2 | #1 | `backend`, `database`, `high-priority` |
| **#3** | `[Config] Environment Configuration & Validation Setup` | Medium | Phase 2 | #1 | `backend`, `security`, `medium-priority` |
| **#4** | `[Auth] Create User Model & Schema Validations` | High | Phase 2 | #2 | `database`, `authentication`, `high-priority` |
| **#5** | `[Auth] Implement Password Hashing with bcrypt & Security Standards` | High | Phase 3 | #4 | `backend`, `authentication`, `security`, `high-priority` |
| **#6** | `[Auth] Implement JWT Token Generation & Verification Utilities` | High | Phase 3 | #3 | `backend`, `authentication`, `security`, `high-priority` |
| **#7** | `[Auth] Implement Authentication & Authorization Middleware` | High | Phase 3 | #6 | `backend`, `authentication`, `security`, `high-priority` |
| **#8** | `[Auth] Implement User Registration API` | High | Phase 3 | #5 | `backend`, `authentication`, `high-priority` |
| **#9** | `[Auth] Implement User Login & Logout APIs` | High | Phase 3 | #7 | `backend`, `authentication`, `high-priority` |
| **#10** | `[OTP] Implement OTP Model, Generation, and Expiration Strategy` | High | Phase 3 | #2 | `backend`, `otp`, `database`, `high-priority` |
| **#11** | `[OTP] Implement OTP Verification & Resend API Endpoints` | High | Phase 3 | #10 | `backend`, `otp`, `authentication`, `high-priority` |
| **#12** | `[Auth] Implement Forgot Password & Reset Password APIs` | High | Phase 3 | #11 | `backend`, `authentication`, `high-priority` |
| **#13** | `[Auth] Implement User Profile & Change Password APIs` | Medium | Phase 3 | #9 | `backend`, `authentication`, `medium-priority` |
| **#14** | `[Security] Implement Security Middleware (CORS, Rate Limiting, Helmet, Error Handler)` | High | Phase 2 | #1 | `backend`, `security`, `high-priority` |
| **#15** | `[Auth] Integrate Frontend Authentication State & Protected Route Handling` | High | Phase 3 | #9 | `frontend`, `authentication`, `integration`, `high-priority` |
| **#59** | `[Integration] Full-Stack Frontend and Backend End-to-End Integration` *(Shared Lead)* | High | Phase 8 | All Features | `integration`, `high-priority` |
| **#60** | `[Deployment] Production Environment Setup & Deployment Strategy Execution` *(Shared Lead)* | High | Phase 10 | #59 | `deployment`, `high-priority` |

---

### Pradnya (`feature/pradnya-ui`)
*Focus: Frontend Architecture, Tailwind CSS, Home Page, Car Browsing, UI/UX Components*

| Issue ID | Title | Priority | Milestone | Dependencies | Labels |
|---|---|---|---|---|---|
| **#16** | `[Frontend] Setup React/Vite Project & Directory Structure` | High | Phase 4 | None | `frontend`, `high-priority` |
| **#17** | `[Frontend] Configure Tailwind CSS & Design System Tokens` | High | Phase 4 | #16 | `frontend`, `high-priority` |
| **#18** | `[Frontend] Configure Axios Client & API Service Layer` | High | Phase 4 | #16 | `frontend`, `integration`, `high-priority` |
| **#19** | `[Frontend] Build Responsive Navbar & Logo Integration` | Medium | Phase 4 | #17 | `frontend`, `medium-priority` |
| **#20** | `[Frontend] Build Global Footer Component` | Low | Phase 4 | #17 | `frontend`, `low-priority` |
| **#21** | `[Frontend] Build Reusable Car Card & Brand Card Components` | Medium | Phase 4 | #17 | `frontend`, `medium-priority` |
| **#22** | `[Frontend] Build Home Page & Hero Section` | High | Phase 4 | #19 | `frontend`, `high-priority` |
| **#23** | `[Frontend] Build Home Featured Cars & Popular Brands Sections` | Medium | Phase 4 | #21 | `frontend`, `medium-priority` |
| **#24** | `[Search] Build Search UI Component` | High | Phase 6 | #19 | `frontend`, `search`, `high-priority` |
| **#25** | `[Search] Build Filter & Sorting UI Panel` | High | Phase 6 | #21 | `frontend`, `search`, `high-priority` |
| **#26** | `[Frontend] Build Browse Cars Page with Server Pagination` | High | Phase 6 | #25 | `frontend`, `search`, `high-priority` |
| **#27** | `[Frontend] Build Car Details Page & Gallery UI` | High | Phase 6 | #21 | `frontend`, `marketplace`, `high-priority` |
| **#28** | `[Frontend] Build Login & Signup Pages UI` | High | Phase 4 | #17 | `frontend`, `authentication`, `high-priority` |
| **#29** | `[Frontend] Build OTP Verification & Password Reset UI` | High | Phase 4 | #28 | `frontend`, `authentication`, `otp`, `high-priority` |
| **#30** | `[Frontend] Implement Global UI States (Loading, Empty, Error, Toast Notifications)` | Medium | Phase 4 | #17 | `frontend`, `medium-priority` |

---

### Sakshi (`feature/sakshi-marketplace`)
*Focus: Car Marketplace, Sell Car Flow, Image Uploads, My Listings, Favorites, Inquiries*

| Issue ID | Title | Priority | Milestone | Dependencies | Labels |
|---|---|---|---|---|---|
| **#31** | `[Marketplace] Create Car Model & Database Schema` | High | Phase 5 | Ashutosh #2 | `database`, `marketplace`, `backend`, `high-priority` |
| **#32** | `[Marketplace] Implement Car Listing CRUD APIs` | High | Phase 5 | #31 | `backend`, `marketplace`, `high-priority` |
| **#33** | `[Marketplace] Implement Car Image Upload & Validation Handling` | High | Phase 5 | #32 | `backend`, `marketplace`, `high-priority` |
| **#34** | `[Marketplace] Build Sell Car Page & Listing Form UI` | High | Phase 5 | Pradnya #17 | `frontend`, `marketplace`, `high-priority` |
| **#35** | `[Marketplace] Build My Listings Management Page (Edit, Delete, Status)` | High | Phase 5 | #34 | `frontend`, `marketplace`, `high-priority` |
| **#36** | `[Marketplace] Create Favorite Model & Favorites CRUD APIs` | Medium | Phase 5 | #31 | `backend`, `database`, `marketplace`, `medium-priority` |
| **#37** | `[Marketplace] Build Favorites Page & Wishlist Toggle UI` | Medium | Phase 5 | Pradnya #21 | `frontend`, `marketplace`, `medium-priority` |
| **#38** | `[Marketplace] Create Inquiry Model & Buyer/Seller Inquiry APIs` | High | Phase 5 | #31 | `backend`, `database`, `marketplace`, `high-priority` |
| **#39** | `[Marketplace] Build Buyer Inquiry Modal & Seller Inquiries Dashboard UI` | High | Phase 5 | Pradnya #27 | `frontend`, `marketplace`, `high-priority` |
| **#40** | `[Search] Implement Backend Search, Multi-Facet Filters, & Pagination API` | High | Phase 6 | #31 | `backend`, `search`, `high-priority` |
| **#41** | `[Marketplace] Integrate Frontend Search & Filter with Backend Marketplace APIs` | High | Phase 6 | Pradnya #26 | `frontend`, `backend`, `search`, `integration`, `high-priority` |
| **#42** | `[Marketplace] Complete End-to-End Buyer and Seller Experience Flow` | High | Phase 5 | #41 | `marketplace`, `integration`, `high-priority` |

---

### Prashant (`feature/prashant-admin`)
*Focus: Admin Panel, Moderation, Brands, Notifications, Quality Assurance & Security Audit*

| Issue ID | Title | Priority | Milestone | Dependencies | Labels |
|---|---|---|---|---|---|
| **#43** | `[Admin] Implement Admin Backend APIs (Dashboard Stats, Moderation, User Control)` | High | Phase 7 | Ashutosh #7 | `backend`, `admin`, `high-priority` |
| **#44** | `[Admin] Build Admin Dashboard & Statistics Overview UI` | High | Phase 7 | #43 | `frontend`, `admin`, `high-priority` |
| **#46** | `[Admin] Build Admin Listing Moderation UI (Approve, Reject, Status)` | High | Phase 7 | #44 | `frontend`, `admin`, `high-priority` |
| **#47** | `[Admin] Build Admin User Management & Role Control UI` | Medium | Phase 7 | #44 | `frontend`, `admin`, `medium-priority` |
| **#48** | `[Admin] Create Brand Model & Brand Management CRUD APIs` | Medium | Phase 7 | Ashutosh #2 | `backend`, `database`, `admin`, `medium-priority` |
| **#49** | `[Admin] Build Brand Management UI in Admin Panel` | Medium | Phase 7 | #48 | `frontend`, `admin`, `medium-priority` |
| **#50** | `[Notification] Create Notification Model & API Integration` | Medium | Phase 7 | Ashutosh #2 | `backend`, `database`, `notification`, `medium-priority` |
| **#51** | `[Notification] Build Notification Bell UI & Alert Feeds` | Medium | Phase 7 | #50 | `frontend`, `notification`, `medium-priority` |
| **#52** | `[QA] Comprehensive Authentication & OTP Verification Testing` | High | Phase 9 | Ashutosh #9 | `testing`, `authentication`, `otp`, `high-priority` |
| **#53** | `[QA] Test Marketplace Listing Lifecycle & Image Handling` | High | Phase 9 | Sakshi #35 | `testing`, `marketplace`, `high-priority` |
| **#54** | `[QA] Test Search, Filters, Sorting, and Server Pagination` | Medium | Phase 9 | Sakshi #41 | `testing`, `search`, `medium-priority` |
| **#55** | `[QA] Test Admin Moderation, Brand Management, and Role Authorization` | High | Phase 9 | #46 | `testing`, `admin`, `security`, `high-priority` |
| **#56** | `[QA] Perform Security Testing (OWASP, JWT, Data Validation, Secrets)` | High | Phase 9 | Ashutosh #14 | `testing`, `security`, `high-priority` |
| **#57** | `[QA] Responsive Design Testing Across Devices (Mobile, Tablet, Desktop)` | Medium | Phase 9 | Pradnya #22 | `testing`, `frontend`, `medium-priority` |
| **#58** | `[QA] End-to-End Integration & Regression Testing for Final Release` | High | Phase 9 | All Features | `testing`, `integration`, `high-priority` |

---

## 5. Execution Rules for Team Members

1. **Work Only on Assigned Issues:** Each member must focus strictly on the issues assigned to them.
2. **Branch Discipline:** Commit only to your designated branch (`feature/<name>-<module>`). Do NOT commit directly to `main`.
3. **Reference Issues in Commits & PRs:** Always mention the Issue ID in your commit messages and Pull Request description (e.g., `feat: build search bar component (closes #24)`).
4. **Pull Requests for All Merges:** Never merge into `main` directly. Open a PR, assign a teammate for review, resolve feedback, and merge only after approval.
5. **No Secret Commits:** Do not push `.env`, API keys, or JWT secrets to GitHub. Always use `.env.example` templates.
