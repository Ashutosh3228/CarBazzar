# CarBazaar

## Buy. Sell. Drive.

CarBazaar is a modern car buying and selling marketplace planned as a full-stack MERN application.

**Current stage: Phase 1 — Documentation and Architecture**

> This repository currently contains project documentation only. Application coding must begin only after explicit approval to start Phase 2.

## Planned Technology

- React.js + Vite + JavaScript
- Tailwind CSS
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- Axios
- Email/Mobile OTP verification
- Git + GitHub

## Documentation

| File | Purpose |
|---|---|
| [01_PROJECT_OVERVIEW](docs/01_PROJECT_OVERVIEW.md) | Project purpose and architecture |
| [02_FEATURE_REQUIREMENTS](docs/02_FEATURE_REQUIREMENTS.md) | Complete feature list |
| [03_USER_ROLES](docs/03_USER_ROLES.md) | Guest, customer and admin permissions |
| [04_AUTHENTICATION_FLOW](docs/04_AUTHENTICATION_FLOW.md) | Authentication lifecycle |
| [05_OTP_VERIFICATION](docs/05_OTP_VERIFICATION.md) | Email/mobile OTP design |
| [06_DATABASE_DESIGN](docs/06_DATABASE_DESIGN.md) | MongoDB schema plan |
| [07_API_DOCUMENTATION](docs/07_API_DOCUMENTATION.md) | Planned REST API |
| [08_FRONTEND_PAGES](docs/08_FRONTEND_PAGES.md) | Frontend page specifications |
| [09_UI_UX_DESIGN](docs/09_UI_UX_DESIGN.md) | Visual and responsive design |
| [10_ADMIN_PANEL](docs/10_ADMIN_PANEL.md) | Admin dashboard |
| [11_CAR_LISTING_FLOW](docs/11_CAR_LISTING_FLOW.md) | Listing lifecycle |
| [12_SELL_CAR_FLOW](docs/12_SELL_CAR_FLOW.md) | Sell-car workflow |
| [13_SEARCH_FILTER_FLOW](docs/13_SEARCH_FILTER_FLOW.md) | Search, filtering and pagination |
| [14_SECURITY_REQUIREMENTS](docs/14_SECURITY_REQUIREMENTS.md) | Security requirements |
| [15_PROJECT_STRUCTURE](docs/15_PROJECT_STRUCTURE.md) | Planned code structure |
| [16_ENVIRONMENT_VARIABLES](docs/16_ENVIRONMENT_VARIABLES.md) | Environment configuration |
| [17_TESTING_PLAN](docs/17_TESTING_PLAN.md) | Test strategy |
| [18_DEPLOYMENT_PLAN](docs/18_DEPLOYMENT_PLAN.md) | Future deployment |
| [19_GITHUB_WORKFLOW](docs/19_GITHUB_WORKFLOW.md) | Git workflow |
| [20_DEVELOPMENT_ROADMAP](docs/20_DEVELOPMENT_ROADMAP.md) | Development phases |
| [21_TEAM_TASK_ASSIGNMENT](docs/21_TEAM_TASK_ASSIGNMENT.md) | Team task assignment and issue matrix |
| [22_TEAM_GIT_WORKFLOW](docs/22_TEAM_GIT_WORKFLOW.md) | 4-member Git & GitHub development workflow |

## Team Members & Responsibilities

| Member | Branch | Primary Responsibility |
|---|---|---|
| **Ashutosh** | `feature/ashutosh-auth` | **Authentication + User Management + Backend Foundation** (Express, MongoDB, JWT, bcrypt, OTP lifecycle, security middleware) |
| **Pradnya** | `feature/pradnya-ui` | **Frontend + UI/UX + Home + Car Browsing** (React/Vite, Tailwind CSS, Navbar, Footer, Car Cards, Browse Cars, UI states) |
| **Sakshi** | `feature/sakshi-marketplace` | **Car Marketplace + Sell Car + Listings + Buyer/Seller Features** (Sell car form, image upload, My Listings, Favorites, Inquiries) |
| **Prashant** | `feature/prashant-admin` | **Admin Panel + Notifications + QA + Testing** (Admin dashboard, moderation, brands, notifications, security & regression testing) |

## Team Development Workflow

1. Each member works on a separate feature branch.
2. No direct development on main.
3. Members commit and push to their branches.
4. Completed work is submitted through Pull Requests.
5. Another member reviews the Pull Request.
6. Approved work is merged into main.
7. Everyone pulls the latest main before continuing.
8. Final integration and testing happen before deployment.

## Phase 1 Acceptance

- Documentation complete
- Architecture reviewed
- No application source code
- Ready for GitHub documentation commit

## Planned Application

The eventual application will allow verified customers to browse cars, search and filter listings, view car details, sell cars, manage listings, save favorites and contact sellers. Admins will manage users, brands, listings, approvals and reports.

