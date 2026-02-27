# 🤖 AI & Engineering Handbook

> **SYSTEM INSTRUCTION FOR AI ASSISTANT**:
> Whenever you (AI) generate code, perform refactoring, or answer technical questions for this project, you **MUST** read and adhere to the guidelines in this document as the "Single Source of Truth".
>
> 1. **Context Analysis**: Check the "Project Identity" section below to know the active stack.
> 2. **Adhere to Principles**: Apply "Universal Principles" to every line of code.
> 3. **Use Specific Stack**: Ignore stack sections irrelevant to the current project.
> 4. **Validation**: Ensure generated code passes the defined "Code Quality" criteria.

---

## 1. 🏗️ Project Identity (Active Configuration)

_Please adjust this section when copying the file to a new project._

| Parameter         | Value (Current Project)     | Options / Notes                               |
| :---------------- | :-------------------------- | :-------------------------------------------- |
| **Framework**     | **Next.js 16 (App Router)** | `Next.js`,                                    |
| **Language**      | **TypeScript**              | `TypeScript`,                                 |
| **Styling**       | **Tailwind CSS v4**         | `Tailwind`, `CSS Modules`, `Bootstrap`        |
| **Components**    | **Shadcn/UI**               | `Shadcn`, `Blade UI Kit`, `None`              |
| **State/Data**    | **TanStack Query v5**       | `TanStack Query`, `Redux`, `Eloquent`, `Gorm` |
| **Auth**          | **NextAuth.js v4**          | `NextAuth`,                                   |
| **Communication** | **Indonesian (Bahasa)**     | `English`, `Indonesian`                       |

---

## 2. 💎 Universal Principles (All Projects)

These principles apply to **all** programming languages and frameworks (Next.js, Laravel, Go, Astro).

### General Philosophy

1.  **KISS (Keep It Simple, Stupid)**: Simple solutions are better than complex clever ones.
2.  **DRY (Don't Repeat Yourself)**: Extract repetitive logic into functions/helpers/components.
3.  **YAGNI (You Aren't Gonna Need It)**: Don't build features "just in case". Build what is needed now.
4.  **Self-Documenting Code**: Variable and function names must explain their purpose. Comments are only for explaining "WHY", not "WHAT".

### Security First

- **Never Trust User Input**: Always validate input on the server side (Zod for TS, FormRequest for Laravel).
- **No Secrets in Code**: Never hardcode API Keys, Tokens, or Passwords. Use `.env`.
- **Authorization**: Always check user permissions before performing sensitive actions (Middleware/Policies).

### Git Conventions

Commit message format: `type(scope): description`

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code changes without changing features (cleanup)
- `docs`: Documentation changes
- `style`: Formatting (spaces, semicolons)

---

## 3. 🛠️ Stack-Specific Guidelines

_AI must select the appropriate guidelines based on "Project Identity" above._

### 🟦 Next.js & React (Frontend/Fullstack)

_Applies if Framework = Next.js / Astro / React_

1.  **App Router Structure**:
    - Use `page.tsx` only for receiving data and composing components.
    - Complex business logic must reside in `hooks/` or `lib/`.
2.  **Server vs Client**:
    - Default to **Server Component**.
    - Use `"use client"` only if `useState`, `useEffect`, or event handlers (`onClick`) are needed.
3.  **Styling (Tailwind)**:
    - Use the `cn()` helper for conditional classes.
    - Avoid manual string concatenation (`className={"btn " + variant}`).
4.  **Data Fetching**:
    - Use **TanStack Query** for client data.
    - Use `fetch` or ORM directly in Server Components.

### 🟥 Laravel (Backend/Monolith)

_Applies if Framework = Laravel_

1.  **Architecture**:
    - **Fat Models, Skinny Controllers**: Move query logic to Scopes or Service Classes.
    - Use **Service Pattern** for complex business logic (more than just CRUD).
2.  **Type Hinting**:
    - Always use Return Type Declarations (`: string`, `: void`, `: View`).
3.  **Eloquent**:
    - Avoid N+1 queries. Always use `with()` for eager loading relationships.
    - Use `FormRequest` for validation, do not validate in Controllers.

### 🩵 Golang (Backend/API)

_Applies if Framework = Fiber / Gin / Echo_

1.  **Error Handling**:
    - Do not ignore errors (`_`). Always handle: `if err != nil { return err }`.
    - Wrap errors with context: `fmt.Errorf("failed to fetch user: %w", err)`.
2.  **Project Layout**:
    - Follow `cmd/`, `internal/`, `pkg/` standards.
    - `internal/` for private application code.
3.  **Concurrency**:
    - Use `context` to manage timeouts and goroutine cancellation.
    - Avoid mutable global state (race conditions).

### 🚀 Astro (Content/Hybrid)

_Applies if Framework = Astro_

1.  **Islands Architecture**:
    - Default components are static (0 JS).
    - Use `client:load` or `client:visible` only on interactive components.
2.  **Type Safety**:
    - Define prop types using TypeScript interfaces in component frontmatter (`---`).

---

## 4. 📝 Development Workflow

### Standard Commands

Adjust according to the project's `package.json` or `Makefile`:

- **Dev**: `npm run dev` / `php artisan serve` / `go run cmd/main.go`
- **Build**: `npm run build` / `go build -o bin/app`
- **Lint/Format**: `npm run lint` / `pint` / `golangci-lint run`

### Definition of Done (DoD)

A feature is considered done if:

1.  [ ] Code runs according to specifications.
2.  [ ] No linting/formatting errors.
3.  [ ] No `console.log` or debug code left behind.
4.  [ ] Responsive on mobile (for UI).
5.  [ ] Validated with diverse data inputs (happy path & edge cases).
