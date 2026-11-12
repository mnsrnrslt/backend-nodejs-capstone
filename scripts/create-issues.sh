#!/usr/bin/env bash
# Creates labels and 10 user stories in your GitHub repo.
# Requires GitHub CLI: https://cli.github.com  ->  run `gh auth login` first.
# Run from the repo root:  bash scripts/create-issues.sh
set -e

echo "Creating labels..."
gh label create "new"            --color "0E8A16" --description "New story"                 --force
gh label create "backlog"        --color "1D76DB" --description "Ready for development"     --force
gh label create "icebox"         --color "BFDADC" --description "Not prioritized yet"       --force
gh label create "technical debt" --color "D93F0B" --description "Internal developer work"   --force

story() {
  # $1 = title, $2 = role, $3 = need, $4 = benefit, $5 = given, $6 = when, $7 = then, $8 = label
  gh issue create --title "$1" --label "$8" --body "**As a** $2

**I need** $3

**So that** $4

### Details and Assumptions
* GiftLink web application (React + Express + MongoDB)

### Acceptance Criteria

\`\`\`gherkin
Given $5
When $6
Then $7
\`\`\`"
}

echo "Creating user stories..."

story "View list of available gifts" \
  "user" "to see all gifts that are available" "I can find something useful for free" \
  "I am on the main page" "the page loads" "I see a list of gifts with name, image, condition and date" \
  "backlog"

story "View gift details" \
  "user" "to open a gift and see its full details" "I can decide whether I want it" \
  "I am logged in and on the main page" "I click on a gift" "I see its category, condition, age and description" \
  "backlog"

story "Register an account" \
  "new user" "to register with my name, email and password" "I can use all GiftLink features" \
  "I am on the register page" "I submit valid details" "my account is created and I am logged in" \
  "backlog"

story "Log in" \
  "registered user" "to log in with my email and password" "I can access my account" \
  "I have an account" "I enter correct credentials" "I am logged in and redirected to the main page" \
  "backlog"

story "Search gifts by category and condition" \
  "user" "to filter gifts by name, category, condition and age" "I find relevant items quickly" \
  "I am on the search page" "I choose filters and press Search" "only matching gifts are shown" \
  "new"

story "Update profile name" \
  "logged-in user" "to change my display name" "my profile stays up to date" \
  "I am on my profile page" "I edit my name and save" "the new name is shown in the navbar" \
  "new"

story "Comment on a gift" \
  "user" "to leave comments on a gift" "I can ask the owner questions" \
  "I am on the gift details page" "I submit a comment" "the comment appears under the gift" \
  "icebox"

story "Sentiment analysis of comments" \
  "gift owner" "comments to be analyzed for sentiment" "I can quickly see positive or negative feedback" \
  "a comment is submitted" "it is sent to the sentiment service" "a positive, neutral or negative label is returned" \
  "icebox"

story "Set up CI linting pipeline" \
  "developer" "a GitHub Actions workflow that lints the code and builds the client" "errors are caught before deployment" \
  "code is pushed to main" "the workflow runs" "lint and build jobs finish successfully" \
  "technical debt"

story "Containerize and deploy the application" \
  "developer" "Dockerfiles and Kubernetes/Code Engine deployment" "the app runs in the cloud" \
  "the images are built" "I deploy them" "the frontend, backend and database are reachable" \
  "technical debt"

echo "Done. Open the Issues tab of your repository."
