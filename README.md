# Bitter! — Q&A Platform

A Stack Overflow-inspired Q&A web application built with **Angular 20** and **Bootstrap 5**. Users can ask questions, post answers and comments, vote on content, and manage their profiles.
This project is hosted and can be visited [here](https://angular-bitter.branislav.dev/).
## Tech Stack

- **Angular 20** — standalone components with lazy-loaded routes
- **Bootstrap 5** — responsive layout and UI components
- **Font Awesome** — icons
- **RxJS** — reactive data flow and HTTP handling

## Project Structure

The application is organized into **feature modules** that encapsulate distinct parts of the site. Each module groups its own components, services, interfaces, and pipes, keeping related functionality together and boundaries clear.

```
src/app/
├── home/              # HomeModule — landing page, tag filtering, search results
│   ├── components/
│   └── pages/
│       ├── main/           # Main question feed with filtering & search
│       └── tags-page/      # Browse all tags
│
├── questions/         # QuestionsModule — everything related to questions
│   ├── components/
│   │   ├── home-question/          # Single question card in the feed
│   │   └── home-question-wrapper/  # Question list wrapper
│   ├── pages/
│   │   ├── ask-question/           # Ask a new question (auth-guarded)
│   │   ├── edit-user-question/     # Edit own question (auth-guarded)
│   │   ├── list-user-questions/    # View own questions (auth-guarded)
│   │   └── question-single/        # Full question view with votes
│   ├── interfaces/     # IQuestion, IQuestionSingle, Tag, etc.
│   ├── pipes/          # UploadedAgoPipe — relative time display
│   └── services/       # QuestionsService, TagsService
│
├── comments/          # CommentsModule — answers, comments, nested replies
│   ├── components/
│   │   ├── comments/       # General comments section
│   │   └── top-answer/     # Top answer + all answers section
│   ├── interfaces/     # Comment, TopComment, Answer
│   └── services/       # CommentsService, CommentUtilsService
│
├── users/             # UsersModule — authentication & user management
│   ├── components/
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── user-page/       # Profile settings (auth-guarded)
│   │   └── top-users-page/  # Top contributors leaderboard
│   ├── guard/          # AuthGuard — route protection
│   ├── interceptors/   # JWT interceptor for HTTP requests
│   ├── interface/      # User, TopUser
│   └── services/       # AuthService, UserService
│
├── shared/            # SharedModule — cross-cutting concerns
│   ├── components/
│   │   ├── layout/          # Reusable page layout wrapper
│   │   └── flash-message/   # Flash notification popup
│   ├── services/       # FlashMessageService, VotingService
│   └── styles/         # Shared SCSS (voting button styles)
│
├── components/        # App-level shell components
│   ├── header/         # Top navigation bar with search
│   ├── footer/         # Site footer
│   ├── sidenav/        # Side navigation
│   └── aside-home/     # Right sidebar
│
├── app.routes.ts      # Route definitions with lazy loading
├── app.config.ts      # App configuration & providers
└── app.ts             # Root component
```

### Why Modules?

Angular modules (`@NgModule`) were used to **encapsulate** each feature area of the website:

- **HomeModule** groups the main feed and tags browsing pages
- **QuestionsModule** encapsulates question CRUD, voting, and display
- **CommentsModule** encapsulates the commenting and answering system
- **UsersModule** encapsulates authentication, registration, and profile management
- **SharedModule** re-exports Angular Material modules and provides shared services/components used across the app

This modular approach keeps each part of the site self-contained, makes the codebase easier to navigate, and enforces clear separation of concerns between features.

## Features

- **Question feed** with filtering (newest, answered, unanswered) and tag-based browsing
- **Full-text search** across questions
- **Question detail page** with voting, answers, comments, and nested replies
- **User authentication** — JWT-based login/register with route guards
- **Profile management** — update name, username, email, and password
- **Ask & edit questions** with category and tag selection
- **Voting system** — upvote/downvote on questions, answers, and comments
- **Flash notifications** — non-authenticated users see a popup instead of sending requests to the server
- **Top users leaderboard** ranked by reputation
- **Lazy-loaded routes** for optimized bundle size

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
ng serve
```

Navigate to `http://localhost:4200/`. The app reloads automatically on file changes.

## Build

```bash
ng build
```

Build artifacts are stored in the `dist/` directory.

## Environment

API URL and other settings are configured in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)
