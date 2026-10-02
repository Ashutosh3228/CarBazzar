# 19 — GitHub Workflow

## Phase 1 Repository Contents

Only documentation and project metadata should be pushed:

```text
README.md
docs/
.gitignore
```

## Initial Commands

From the project root:

```bash
git init
git add README.md docs .gitignore
git commit -m "docs: add CarBazaar project documentation"
```

Create a GitHub repository named:

```text
CarBazaar
```

Then connect it:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CarBazaar.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Verify

```bash
git remote -v
git status
git log --oneline -1
```

Open the GitHub repository and confirm the README and `docs/` folder are visible.

## Important

Never commit:

```text
.env
node_modules/
credentials
API keys
passwords
JWT secrets
```

Application coding starts only after explicit approval for Phase 2.
