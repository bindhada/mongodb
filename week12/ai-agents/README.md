# Week 12 AI Agents — hand-in package

## Included
- `compose.yml`: SonarQube + n8n Docker Compose setup from the current Week 11 setup.
- `ANSWERS.md`: written answers and submission checklist.
- `prompt.md`: structured system prompt.
- `workflows/my-first-agent.json`: importable Chat Trigger + AI Agent + OpenRouter + Simple Memory starter.
- `screenshots/`: intentionally empty; add genuine screenshots from your own n8n executions.

## Import the workflow
1. Open n8n at http://localhost:5678 and sign in.
2. Open **Workflows** and choose **Import from File**.
3. Select `workflows/my-first-agent.json`.
4. Open **OpenRouter Chat Model**, create/select your OpenRouter credential, and save.
5. Save the workflow. Open the chat panel and test a message.
6. If n8n reports a node version mismatch, let the editor update the node version and save.

## Important
This JSON is a starter workflow, not evidence of a successful run. Connect your own OpenRouter credential and execute it. The assignment's OpenWeatherMap and Open-Meteo tools are described in `ANSWERS.md`; configure and test those in n8n before claiming Exercise 3 or 4 is complete.

## Preserve your existing Docker data
Do not run `docker compose down -v`. That would delete named volumes. The supplied Compose file retains the SonarQube and n8n named volumes. If your repository's root compose file contains other required services, merge the n8n service into it rather than replacing those services.
