# 22 — Team Git & GitHub Development Workflow

## Overview

The CarBazaar project follows a professional **4-member distributed Git/GitHub development workflow**. The team works across four independent laptops, ensuring isolated development, strict code review, continuous integration, and high code quality.

---

## 1. Architectural Workflow Diagram

```text
                GitHub Repository (origin)
                           |
                         main (protected/stable)
                           |
       -----------------------------------------------------
       |                         |                         |
       ↓                         ↓                         ↓
 Ashutosh Laptop           Pradnya Laptop            Sakshi Laptop
feature/ashutosh-auth     feature/pradnya-ui    feature/sakshi-marketplace
       |                         |                         |
       -----------------------------------------------------
                                 |
                          Prashant Laptop
                       feature/prashant-admin
                                 |
                                 ↓
                     Pull Requests (feature -> main)
                                 |
                       Peer Code Review (1+ approval)
                                 |
                         Automated Checks
                                 |
                           Merge to main
                                 |
                    Local main update (git pull)
                                 |
                        Final Integration
                                 |
                    Final QA & Regression Testing
                                 |
                         Cloud Deployment
```

---

## 2. Dedicated Feature Branches

Each team member is assigned a specific personal feature branch:

| Member | Laptop / Environment | Dedicated Branch Name | Module Ownership |
|---|---|---|---|
| **Ashutosh** | Laptop 1 | `feature/ashutosh-auth` | Backend Foundation, Auth, OTP, Security |
| **Pradnya** | Laptop 2 | `feature/pradnya-ui` | Frontend, Tailwind, UI/UX, Home, Search UI |
| **Sakshi** | Laptop 3 | `feature/sakshi-marketplace` | Marketplace, Listings, Favorites, Inquiries |
| **Prashant** | Laptop 4 | `feature/prashant-admin` | Admin Panel, Notifications, QA & Testing |

> **IMPORTANT RULE:** Team members create their own branches locally on their respective laptops. Nobody should create or touch another member's local branch unless explicitly collaborating.

---

## 3. Step-by-Step Developer Guide

### STEP 1 — Clone Repository
Each member clones the repository onto their own laptop from the official GitHub URL:

```bash
git clone https://github.com/Ashutosh3228/CarBazzar.git
cd CarBazzar
```

---

### STEP 2 — Ensure Local `main` is Up-to-Date
Before branching out, make sure you are on `main` and have pulled the latest upstream changes:

```bash
git checkout main
git pull origin main
```

---

### STEP 3 — Create Your Personal Feature Branch
Create and switch to your assigned feature branch:

- **Ashutosh:**
  ```bash
  git checkout -b feature/ashutosh-auth
  ```
- **Pradnya:**
  ```bash
  git checkout -b feature/pradnya-ui
  ```
- **Sakshi:**
  ```bash
  git checkout -b feature/sakshi-marketplace
  ```
- **Prashant:**
  ```bash
  git checkout -b feature/prashant-admin
  ```

---

### STEP 4 — Push Feature Branch to GitHub
Set the upstream tracking branch and publish your branch to GitHub:

- **Ashutosh:**
  ```bash
  git push -u origin feature/ashutosh-auth
  ```
- **Pradnya:**
  ```bash
  git push -u origin feature/pradnya-ui
  ```
- **Sakshi:**
  ```bash
  git push -u origin feature/sakshi-marketplace
  ```
- **Prashant:**
  ```bash
  git push -u origin feature/prashant-admin
  ```

---

### STEP 5 — Work Only on Your Branch
- Develop features exclusively inside your assigned branch.
- **Never develop directly on `main`.**
- Do not modify files assigned to another member's module without prior coordination.

---

### STEP 6 — Commit Frequently with Conventional Messages
Make small, logical, and self-contained commits. Always write meaningful commit messages following standard conventional commit guidelines.

#### Good Commit Message Examples:
```text
feat: add user registration API (closes #8)
feat: implement JWT token signing utility (closes #6)
feat: build responsive navbar and logo integration (closes #19)
feat: create car marketplace schema and indexes (closes #31)
feat: build admin listing moderation drawer (closes #46)
fix: correct OTP expiration timestamp calculation (fixes #10)
docs: update API endpoints table in documentation
test: add test suite for customer registration validation
```

#### Meaningless Commits to AVOID:
```text
❌ update
❌ test
❌ changes
❌ final
❌ final2
❌ new code
❌ asdasd
❌ fix bug
```

---

### STEP 7 — Stage and Push Your Work
Check status, stage changed files, commit, and push to origin:

```bash
git status
git add .
git commit -m "feat: implement sell car form validation (closes #34)"
git push
```

---

### STEP 8 — Keep Your Branch Updated with `main`
Regularly pull upstream changes from `main` into your feature branch to prevent diverging too far:

```bash
# 1. Fetch the latest commits from origin
git fetch origin

# 2. Merge origin/main into your current feature branch
git merge origin/main
```

If conflicts occur during the merge:
1. Git will flag conflicting files with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
2. Open each conflicting file, resolve the conflict, and save.
3. Test that the code compiles and runs cleanly.
4. Stage and commit the resolution:
   ```bash
   git add <resolved-files>
   git commit -m "chore: resolve merge conflicts with origin/main"
   git push
   ```
> **CAUTION:** Never use `git push --force` or `git push -f`!

---

### STEP 9 — Open a Pull Request (PR)
When a task or group of related issues is complete and verified:

1. Push your latest branch commits to GitHub.
2. Go to the GitHub repository: `https://github.com/Ashutosh3228/CarBazzar`.
3. Click **Pull requests** > **New pull request**.
4. Set the comparison:
   - **Base:** `main`
   - **Compare:** `feature/<your-branch>`
5. Fill out the CarBazaar PR Template:
   - **Description:** Summary of what was built or fixed.
   - **Related Issue:** Link the issue ID (e.g., `Closes #8`).
   - **Changes Made:** Bulleted list of new modules, files, or utilities.
   - **Testing:** Describe test steps performed and attach screenshots/logs.
   - **Checklist:** Verify all items are checked.
6. Request a review from at least one teammate.

---

### STEP 10 — Peer Code Review
No Pull Request may be self-merged or merged immediately.

Teammate Review Checklist:
- **Code Quality:** Clean formatting, no dead code, readable variable and function names.
- **Functionality:** Meets the acceptance criteria defined in the linked issue.
- **Security:** No hardcoded secrets, no raw password/OTP logging, input sanitization present.
- **UI/UX:** Responsive on mobile and desktop, states (loading, empty, error) handled properly.
- **Error Handling:** Graceful try/catch, standardized error responses.
- **Git Cleanliness:** No `.env` files or temporary build artifacts included.

If changes are requested:
1. The author addresses the feedback directly on their local branch.
2. Commit and push the updates:
   ```bash
   git add .
   git commit -m "fix: address code review comments regarding OTP expiration"
   git push
   ```
3. GitHub automatically updates the open Pull Request with the new commits.

---

### STEP 11 — Approval & Merge
Once the reviewer approves the Pull Request:
1. Click **Merge pull request** on GitHub (standard merge commit or squash and merge as agreed).
2. Confirm the merge.
3. Keep the feature branch active on GitHub for ongoing tasks in the same module.

---

### STEP 12 — Synchronize After Merge
After ANY teammate's PR is merged into `main`, ALL team members must update their local environments:

```bash
# 1. Switch to local main and pull the merged code
git checkout main
git pull origin main

# 2. Switch back to your personal feature branch and merge the fresh main
git checkout feature/your-branch
git merge main

# 3. Push the synced branch to origin
git push
```

Now continue developing your remaining issues on top of the latest combined code!

---

## 4. Main Branch Protection & Development Rules

`main` is the production-ready source of truth. The following rules are mandatory:

| Rule | Description |
|---|---|
| ❌ **No Direct Pushing** | Never run `git push origin main` for feature work. All code enters `main` via PRs. |
| ❌ **No Direct Development** | Never write new application code while checked out on `main`. |
| ❌ **No Force Pushes** | Never execute `git push --force` or `git push -f` against `main` or shared branches. |
| ❌ **No History Rewriting** | Do not rebase published commits or alter shared commit history. |
| ❌ **No Branch Deletion** | Do not delete another team member's feature branch. |
| ❌ **No Secrets or Credentials** | Never commit `.env`, private keys, database passwords, or JWT secrets. |
| ✅ **Mandatory Peer Review** | Every PR requires at least one review and approval before merging. |
| ✅ **Continuous Sync** | Pull `main` into your feature branch before opening a PR. |

---

## 5. Conflict Resolution Protocol

When two team members modify touching lines in shared files (e.g. `App.jsx`, `routes/index.js`):

1. **Do not panic:** Merge conflicts are a normal part of teamwork.
2. **Fetch and Merge `origin/main`:**
   ```bash
   git fetch origin
   git merge origin/main
   ```
3. **Inspect Conflicted Files:**
   Open the conflicting file in your IDE. You will see markers:
   ```text
   <<<<<<< HEAD (Your local changes)
   const routes = [ ... ];
   =======
   const routes = [ ... ]; // Changes merged into main from teammate
   >>>>>>> origin/main
   ```
4. **Coordinate with the Author:** Talk to the teammate who wrote the conflicting change to understand the intended behavior.
5. **Resolve & Remove Markers:** Combine both sets of changes cleanly and delete all Git conflict marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).
6. **Test the Application:** Ensure the code compiles, linters pass, and there are no runtime crashes.
7. **Commit the Resolution:**
   ```bash
   git add <resolved-file>
   git commit -m "chore: resolve merge conflicts with origin/main"
   git push origin <your-feature-branch>
   ```

---

## 6. Final Integration & Release Process

When all assigned module issues are finished across the four branches:

1. **Freeze Feature Work:** All members push their latest tested commits.
2. **Open Final Module PRs:**
   - `feature/ashutosh-auth` ➔ `main`
   - `feature/pradnya-ui` ➔ `main`
   - `feature/sakshi-marketplace` ➔ `main`
   - `feature/prashant-admin` ➔ `main`
3. **Conduct Multi-Peer Review:** Team reviews each PR systematically in dependency order:
   - Order: Foundation/Auth (#59) ➔ UI Core ➔ Marketplace ➔ Admin.
4. **Merge Approved PRs:** Merge each module into `main` on GitHub.
5. **Pull Consolidated `main` on All Laptops:**
   ```bash
   git checkout main
   git pull origin main
   ```
6. **Full System Integration Testing (Phase 8 & 9):**
   - Run both `client/` and `server/`.
   - Execute user journeys: Guest browsing, registration, OTP verification, car listing submission, admin approval, searching, filtering, favorites, buyer inquiry, notification delivery.
7. **Fix Integration Defect Patches:** Address any cross-module discrepancies via small targeted fix PRs.
8. **Final Sign-off:** Prashant (QA Lead) and Ashutosh (Tech Lead) perform final regression check.
9. **Deployment (Phase 10):** Deploy database to MongoDB Atlas, backend to Render/Railway, and frontend to Vercel.
