# Agent Instructions

This project is a **Trello Task Tracker Dashboard**.

## Project Conventions
- **TypeScript**: Use strict typing.
- **Styling**: Tailwind CSS with custom themes.
- **Backend**: Node.js/Express acts as a Trello API proxy/normalizer.
- **Design**: The UI should remain "Sleek" and professional.

## Theme Implementation
- Themes are managed via a `data-theme` attribute on the `<html>` element.
- Define theme variables in `src/index.css`.

## Trello Integration
- All Trello data fetching must happen server-side for security.
- Use the `TRELLO_API_KEY` and `TRELLO_TOKEN` environment variables.
