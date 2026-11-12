# ICT Information System Blueprint 2026

## Technology Stacks

---

## Backend

| Category                   | Technology                                       |
| -------------------------- | ------------------------------------------------ |
| Backend Framework          | Laravel 13                                       |
| Backend API Architecture   | REST API                                         |
| API Authentication         | Laravel Sanctum (token based)                    |
| Storage                    | Laravel Storage, S3                              |
| Email Service (MFA)        | Office 365 or Gmail SMTP                         |
| SMS Service                | Semaphore or Globe                               |
| PDF                        | DomPDF, PDFparser, tcPDF                         |
| Push Notification          | Reverb                                           |
| Error Monitoring           | Sentry (not used)                                |
| Testing (Unit and Feature) | Pest                                             |
| API Testing                | Laravel OpenAPI - Scramble                       |
| Local Server               | Laravel Herd, Laragon                            |
| DB Management              | TablePlus, DBaver and Navicat / MySQL Workbench) |
| MySQL DB Server            | DBngin or Laragon or MySQL (Standalone)          |

### IDE Extensions

| Extension         | Tool                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Intellisense      | PHP Intelephense                                                                              |
| Formatting        | bmewburn                                                                                      |
| Code Style Fixer  | Laravel Pint                                                                                  |
| Git Hooks         | Laravel CaptainHook (to ensure no bad code pushed — pre-commit, post-commit & commit message) |

---

## Frontend

|Category|Technology|
|---|---|
|Frontend|React (TypeScript)|
|Bundler|Vite|
|Package Manager|npm|
|Frontend Router|react-router-dom|
|Form Validation|React Hook Form + Zod/Yup|
|State Management|Zustand, TanStack Query|
|HTTP Client|Axios|
|UI Framework|MUI, Shadcn + Tailwind CSS (MUI is not currently used)|
|Data Tables|TanStack Table|
|Error Monitoring|Sentry|
|Push Notification|Laravel Echo|
|Testing (Unit)|Vitest, happy-dom|
|PDF|ReactToPrint (react-pdf) — currently used|
|PDF (deprecated)|ReactPDFViewer|
|Icons|lucide-react (MDI listed in blueprint)|
|Charts|ApexCharts (react-apexcharts)|
|Runtime|Node|
|Rich Text Editor|Lexical & Tiptap|
|DOM to Image Export|html-to-image, html2canvas|
|Toast Notification|Sonner|
|Theme Switching|next-themes|
|Utility Library|Lodash|
|PWA Support|vite-plugin-pwa, Workbox|
|Git Hooks|Husky (pre-commit, post-commit & commit message)|

### IDE Extensions

|Extension|Tool|
|---|---|
|Lint|ESLint|
|Formatting|Prettier|

---

## Mobile Framework

|Category|Technology|
|---|---|
|Frontend (Mobile)|React Native (TypeScript)|
|Mobile Runtime/Framework|Expo|
|Frontend Router|Expo Router|
|Form Validation|React Hook Form|
|State Management|Zustand, TanStack Query|
|HTTP Client|Axios|
|UI Framework|React Native Paper|
|Push Notifications|Firebase Cloud Messaging|
|WebSocket|Laravel Echo|
|Map|MapBox or Google Maps|
|Camera|Expo Camera Module|
|Icons|Expo Icons|
|App DB (within Device)|SQLite|
|Charts|Native Chart Kit|
|Package Manager|Expo & npm|
|Bundler|Metro|
|Builder|EAS|

---

## Infrastructure

|Category|Technology|
|---|---|
|On-premise Server|Windows IIS|
|Database|MySQL|
|Cache / Queue|Redis|
|Repository|GitHub Organization|
|Containerization|Laravel Sail (Backend), Docker (Frontend)|
|CI/CD|GitHub Actions|

---

## API Versioning

All endpoints are prefixed with `/api/v1/`.

|Domain|Base Path|
|---|---|
|Example 1|`/api/v1/example-1`|
|Example 2|`/api/v1/example-2`|
|Departments|`/api/v1/departments`|

---

## Project Structure & Conventions

### Backend Directory Layout

The Laravel backend follows a layered architecture using the Repository Pattern for data access, Service Classes for business logic orchestration, Controllers for request handling, and Traits for reusable model or controller functionality. Controllers remain thin, delegating to services and models or controllers contains domain-specific reusable behavior in traits.

|Directory|Purpose|
|---|---|
|`app/Http/Controllers/V1/`|Versioned API controllers grouped by domain (Auth, Employee, Organization, etc.)|
|`app/Http/Requests/`|Form Request classes for input validation, grouped by domain (Auth, Employee, Organization, etc.)|
|`app/Http/Resources/`|API Resource transformers (JSON shaping - optional)|
|`app/Http/Middleware/`|Custom middleware (role checks, etc.)|
|`app/Models/`|Eloquent models with relationships, casts, and scopes|
|`app/Services/`|Business logic classes (EmployeeService, UserService, etc.)|
|`app/Traits/`|Reusable pieces of behavior for Models or Controllers|
|`database/migrations/`|Versioned database schema changes|
|`database/seeders/`|Reference data and test data seeders|
|`database/factories/`|Model factories for testing|
|`routes/api.php`|All API route definitions|

---

### Frontend Directory Layout

|Directory|Purpose|
|---|---|
|`src/app/routes/<domain>/`|Route-level page components & router config|
|`src/assets/images/`|Static images (logos, photos)|
|`src/components/auth/`|Permission/auth gate components|
|`src/components/buttons/`|Reusable button components|
|`src/components/common/`|Generic reusable components (modals, etc.)|
|`src/components/data-display/`|Stat cards, display widgets|
|`src/components/editor/`|Rich-text editor (Lexical) + hooks|
|`src/components/error/`|Error boundary, error fallback pages|
|`src/components/feedback/`|Confirm dialogs, status badges|
|`src/components/file/`|File upload components|
|`src/components/form/`|Form shell, field components, form utils|
|`src/components/inputs/`|Search bar, filters, rich-text-editor input|
|`src/components/layout/AppShell/`|App shell, sidebar, topbar, nav|
|`src/components/overlay/`|Side panes, overlays|
|`src/components/pwa/`|PWA install prompts|
|`src/components/table/`|DataTable, pagination, table types|
|`src/components/tabs/`|Tab components|
|`src/components/ui/`|Shadcn/ui base primitives|
|`src/config/`|Env parsing, app-wide constants/permissions|
|`src/context/`|React context providers (Auth, PWA)|
|`src/features/<domain>/access/`|Permission/role-based access hooks|
|`src/features/<domain>/api/`|API service functions + TanStack Query hooks|
|`src/features/<domain>/components/`|Feature components, organized per [Atomic Design tiers](#component-architecture-atomic-design)|
|`src/features/<domain>/constants/`|Zod schemas, option lists|
|`src/features/<domain>/data/`|Mock data (dev/demo)|
|`src/features/<domain>/hooks/`|Feature-specific hooks|
|`src/features/<domain>/lib/`|Feature-local helper modules|
|`src/features/<domain>/provider/`|Feature-scoped React context providers|
|`src/features/<domain>/stores/`|Feature-scoped Zustand stores|
|`src/features/<domain>/types/`|Feature types|
|`src/features/<domain>/utils/`|Feature utilities|
|`src/features/<domain>/index.ts`|Public barrel export|
|`src/hooks/`|Cross-cutting custom hooks|
|`src/lib/axios.ts`|Single shared Axios instance|
|`src/lib/permissions/`|Permission check helpers|
|`src/lib/utils.ts`|`cn()` and shared helpers|
|`src/providers/`|App-wide providers (Query, PWA, Notifications)|
|`src/stores/`|Cross-cutting Zustand stores (auth, ui, role, user, workspace)|
|`src/testing/`|Vitest setup and test docs|
|`src/types/`|Shared API envelope types|
|`src/utils/`|Cross-cutting utilities|

---

### Component Architecture (Atomic Design)

Feature-level UI **MUST** be organized using Atomic Design tiers inside `src/features/<domain>/components/`. This keeps components easy to locate by scope (a single primitive vs. a full view) and prevents feature folders from becoming a flat, unbounded list of files.

|Tier|Folder|Definition|Example|
|---|---|---|---|
|Atoms|`components/atoms/`|Smallest domain-specific UI pieces; no composition of other domain components|`OrgBreadcrumbs.tsx`, `OrgTreeLegend.tsx`|
|Molecules|`components/molecules/`|Composed widgets combining atoms and/or `ui/` primitives; own local state/behavior|`DepartmentFormModal.tsx`, `OrgTreeNode.tsx`|
|Organisms|`components/organisms/`|Full sections/views assembled from molecules; typically wired to hooks/queries|`OrgExplorer.tsx`, `OfficeDetailView.tsx`|
|Templates|`components/templates/`|Layout skeletons that arrange organisms for a page, without page-level data fetching|Used when a feature has multiple pages sharing one layout|

Rules:

- Every feature's `components/` directory **MUST** use these four subfolders once it exceeds a handful of files. A feature may omit a tier it doesn't need (e.g. no `templates/` if the feature has a single page), but **MUST NOT** substitute ad hoc folder names (e.g. `fields/`, `steps/`, `tabs/`) in place of the atomic tiers.
- Global, cross-feature primitives stay in `src/components/ui/` (Shadcn primitives — the app-wide "atoms" layer) and `src/components/{buttons,form,table,inputs,...}/` (shared molecules), and are imported into feature atoms/molecules rather than duplicated.
- Route-level page components (`src/app/routes/<domain>/`) are the "pages" layer — they compose templates/organisms and own data fetching; they **MUST NOT** contain atom- or molecule-level markup inline.
- Each feature **MUST** re-export its public components through `src/features/<domain>/index.ts` regardless of which atomic tier they live in.

---

### Naming Conventions

#### Database

|Convention|Rule|
|---|---|
|Table names|`snake_case`, plural (e.g., `employees`, `salary_grades`)|
|Foreign keys|`{table_singular}_id` (e.g., `employee_id`, `department_id`)|
|Timestamps|All tables include `created_at` and `updated_at`|
|Soft deletes|Use `deleted_at` on master tables (employees, positions, departments, etc.)|
|Boolean flags|Prefix with `is_` (e.g., `is_active`, `is_filled`, `is_lwop`)|

#### PHP / Laravel

|Type|Convention|
|---|---|
|Models|PascalCase, singular (`Employee`, `PlantillaItem`)|
|Controllers|PascalCase + Controller suffix (`EmployeeController`)|
|Services|PascalCase + Service suffix (`EmployeeService`)|
|Requests|Action + Model + Request (`StoreEmployeeRequest`, `UpdateEmployeeRequest`)|
|Resources|Model + Resource (`EmployeeResource`, `EmployeeDetailResource`)|
|Policies|Model + Policy (`EmployeePolicy`)|

#### TypeScript / React

|Type|Convention|
|---|---|
|Components|PascalCase (`EmployeeListPage.tsx`, `FilterBar.tsx`)|
|Hooks|camelCase with `use` prefix (`useEmployeeStore`, `useAuthStore`)|
|API files|camelCase (`employees.ts`, `organization.ts`)|
|Types/Interfaces|PascalCase (`Employee`, `EmployeeDetail`, `ApiResponse<T>`)|
|Stores|camelCase + Store suffix (`authStore.ts`, `employeeStore.ts`)|

---

## Backend API Guidelines

### Response Envelope

All controllers must use the `ApiResponse` trait to guarantee a uniform JSON response structure for success, error, and paginated responses across all endpoints. The envelope wraps every response — both success and error — in a predictable shape that the frontend can rely on without guessing.

|Response Type|Structure|HTTP Codes|
|---|---|---|
|Success|`{ data: T, message: string, errors: null }`|200, 201|
|Error|`{ data: null, message: string, errors: object\|null }`|401, 403, 404, 422, 429, 500|
|Paginated|`{ data: T[], meta: { current_page, last_page, per_page, total }, message, errors: null }`|200|

---

### Repository Pattern thru Service Classes

Controllers **MUST** be thin. All business logic lives in Service classes:

- **EmployeeService** — Employee CRUD, employee ID generation, name change tracking
- **MovementService** — Process movements, apply state changes, plantilla updates
- **OrganizationService** — Department/Division/Section management
- **DocumentService** — File upload, versioning, expiry alerts

All multi-step operations **MUST** be wrapped in `DB::transaction()` for data integrity.

---

### Backend Validation Standards

Input validation is the first line of defense. Every request that creates or modifies data **MUST** be validated before reaching the service layer. Laravel Form Request classes are the only acceptable mechanism — never validate inside controllers or services.

#### General Principles

1. Every POST, PUT, and PATCH endpoint **MUST** have a dedicated Form Request class (e.g., `StoreEmployeeRequest`, `UpdateEmployeeRequest`).
2. Validation rules **MUST** mirror the database constraints exactly — if a column is `VARCHAR(100)`, the rule must include `max:100`.
3. Use the `authorize()` method in Form Requests for simple role checks.
4. Return validation errors in the standard envelope format: `{ message: "Validation failed", errors: { field: [messages] } }`.
5. Never trust client-side validation alone. The backend is the source of truth — duplicate every critical rule server-side.

#### Data Type Rules

|Data Type|Required Rules|Example|
|---|---|---|
|String fields|`string, max:{db_length}`, trim whitespace|`last_name => ['required', 'string', 'max:100']`|
|Email fields|`email`, unique where applicable|`email_address => ['nullable', 'email', 'unique:employees,email_address']`|
|Date fields|date format, before/after constraints|`date_of_birth => ['required', 'date', 'before:today']`|
|Enum fields|`in:` with exact valid values|`civil_status => ['required', 'in:Single,Married,Widowed,Separated,Annulled']`|
|Integer fields|`integer`, between or min/max|`salary_grade => ['integer', 'between:1,33']`|
|Boolean fields|`boolean`|`is_active => ['boolean']`|
|Foreign keys|`exists:{table},{column}`|`department_id => ['nullable', 'exists:departments,id']`|
|File uploads|`file, max:{kb}, mimes:{types}`|`file => ['required', 'file', 'max:10240', 'mimes:pdf,jpg,jpeg,png,docx']`|
|Phone numbers|`string, max:20`, regex pattern|`mobile_number => ['nullable', 'string', 'max:20']`|
|Arrays (nested)|`array`, min/max, nested `.*` rules|`addresses => ['nullable', 'array', 'min:1']`|

#### Nested Object Validation

When creating employees, related data (e.g. addresses) is submitted as nested objects. Validate these with dot-notation rules:

```php
'addresses.*.type'             => ['required', 'in:Permanent,Present']
'addresses.*.barangay'         => ['required', 'string']
'addresses.*.city_municipality' => ['required', 'string']
'addresses.*.province'         => ['required', 'string']
```

#### Update vs. Create Validation

Update requests **SHOULD** use separate Form Request classes (`UpdateEmployeeRequest`) where rules differ from creation:

- Unique rules must use the ignore parameter to exclude the current record: `unique:employees,email_address,{id}`
- Fields that are required on create **MAY** be optional on update (use `sometimes` rule)
- The `employee_id` field must **NEVER** be updatable — exclude it on Form Request validation and from `$fillable` or add it on `$guarded`.

#### Error Response Format

Laravel automatically returns 422 responses for validation failures. The response **MUST** follow the standard envelope:

- **HTTP Status:** 422 Unprocessable Entity
- **Body:** `{ data: null, message: "Validation failed", errors: { field_name: ["error message"] } }`
- **Multiple errors:** Each field can have multiple error messages returned as an array
- **Nested errors:** Dot-notation keys (e.g., `addresses.0.barangay`) map to specific array items

> ⚠️ Never expose internal details (SQL errors, stack traces, model class names) in validation error messages. Use human-readable messages only.

---

## Frontend Guidelines

### State Management

Use Zustand for all client-only states and TanStack Query for server-side states.

|State|Store|Purpose|Persistence|
|---|---|---|---|
|TanStack Query + Zustand|`authStore`|User authentication, token, role checks|localStorage (via persist middleware)|
|TanStack Query|`modelStore` (e.g. `employeeStore`)|Model list, selected model, filters, pagination|None (fetched from API)|
|Zustand|`uiStore`|Sidebar state, toasts, modals|None|

---

### API Integration

All HTTP communication goes through a single Axios instance configured in `src/api/axios.ts`:

- Automatic Bearer token injection via request interceptor
- Global 401 handling: auto-logout and redirect to `/login`
- Global error handling: 403 (Access Denied toast), 422 (field error mapping), 429 (rate limit toast), 500 (server error toast)
- `withCredentials` set to `false` (token-based auth, not cookie-based)

---

### Routing & Access Control

All routes except `/login` are wrapped in a `ProtectedRoute` component that checks `isAuthenticated`. Role-restricted routes use a `roles` prop:

|Route|Component|Roles|
|---|---|---|
|`/login`|`LoginPage`|Public|
|`/`|`DashboardPage`|All authenticated|
|`/employees`|`EmployeeListPage`|All authenticated|
|`/employees/new`|`AddEmployeePage`|e.g. Admin, Staff|
|`/employees/:id`|`EmployeeProfilePage`|All authenticated (scoped by policy)|
|`/employees/:id/edit`|`EditEmployeePage`|e.g. Admin, Staff|
|`/organization`|`OrgChartPage`|All authenticated|
|`/plantilla`|`PlantillaPage`|All authenticated|
|`/reports`|`ReportsPage`|e.g. Admin, Staff, Head|
|`/admin/users`|`UsersPage`|e.g. Admin|

---

### Form Standards

- All forms use React Hook Form with Zod schemas for validation
- Multi-step forms for complex entities (e.g. Add Employee spans Personal, Employment, Government IDs, Addresses)
- Error messages map to individual fields using `setError` from React Hook Form
- Submit buttons show loading state and disable during submission

---

### Frontend Validation Standards

Client-side validation provides immediate feedback and reduces unnecessary API calls. However, it is a UX convenience only — the backend remains the authoritative validation layer. Every rule enforced on the frontend **MUST** also be enforced on the backend.

#### General Principles

1. Use Zod schemas as the single source of truth for client-side validation. Every form **MUST** have a corresponding Zod schema.
2. Zod schemas **MUST** mirror the backend Form Request rules as closely as possible to avoid mismatched validation.
3. Integrate Zod with React Hook Form via `@hookform/resolvers/zod` for seamless error handling.
4. Display field-level errors inline (below the input) immediately on blur and on submit.
5. Display server-side validation errors (422 responses) by mapping them to form fields using `setError` from React Hook Form.
6. Never rely solely on HTML5 built-in validation (`required`, `pattern` attributes). Always use Zod for consistent behavior.

#### Zod Schema Standards

|Field Type|Zod Rule|Example|
|---|---|---|
|Required string|`z.string().min(1, message).max(limit)`|`last_name: z.string().min(1, 'Last name is required').max(100)`|
|Optional string|`z.string().max(limit).nullable().optional()`|`middle_name: z.string().max(100).nullable().optional()`|
|Email|`z.string().email(message)`|`email: z.string().email('Enter a valid email')`|
|Password|`z.string().min(8, message)`|`password: z.string().min(8, 'Minimum 8 characters')`|
|Enum / Select|`z.enum([values])`|`civil_status: z.enum(['Single', 'Married', 'Widowed', ...])`|
|Date|`z.string().date()` or `z.coerce.date()`|`date_of_birth: z.string().min(1, 'Required')`|
|Integer range|`z.number().int().min(a).max(b)`|`salary_grade: z.number().int().min(1).max(33)`|
|Foreign key (select)|`z.number().positive()` or `z.null()`|`department_id: z.number().positive().nullable()`|
|File upload|Custom: check size + type|Validate `file.size <= 10MB` and `file.type` in allowed list|
|Phone number|`z.string().max(20).optional()`|`mobile_number: z.string().max(20).optional()`|

#### Server Error Mapping

When the backend returns a 422 response, the frontend **MUST** map errors back to form fields so users see exactly which field failed and why:

- **Parse the errors object:** Iterate over the errors record from the API response (`Record<string, string[]>`)
- **Map to setError:** For each field key, call `setError(fieldName, { message: errors[field][0] })` to show the first error
- **Handle nested fields:** Server returns dot-notation keys (e.g., `addresses.0.barangay`). Map these to the corresponding array field indices in React Hook Form
- **Global errors:** If an error key does not match any form field, display it as a form-level error using `setError('root', { message })`
- **Toast for non-field errors:** HTTP 403 (Access Denied), 429 (Rate Limited), and 500 (Server Error) should display toast notifications, not field errors

#### Multi-Step Form Validation

The Add Employee form spans multiple steps (e.g. Personal Info, Employment, Government IDs, Addresses). Validation strategy:

- Define one master Zod schema for the entire form, then use `.pick()` or `.partial()` to create per-step sub-schemas
- Validate the current step's fields on "Next" button click before allowing navigation to the next step
- On final submit, validate the complete schema and only then POST to the API
- Preserve form state across steps using React Hook Form's built-in state (do not reset between steps)
- Show a summary/review step before final submission so users can verify all data

#### Real-Time Validation UX

- **Validation mode:** Use `mode: 'onBlur'` in `useForm()` config so fields validate when the user leaves them, not on every keystroke
- **Re-validation mode:** Use `reValidateMode: 'onChange'` so once an error is shown, it clears as soon as the user fixes it
- **Error display:** Show error text in red below the input field. Use `aria-invalid` and `aria-describedby` for accessibility
- **Disabled submit:** Disable the submit button while `isSubmitting` is true. Show a spinner or "Saving..." text
- **Success feedback:** On successful submission, show a success toast and navigate to the appropriate page (e.g., employee profile)

#### File Upload Validation

File uploads (e.g. 201 Documents, Profile Photos) require special handling since Zod does not natively validate File objects:

- Validate file size client-side: reject files over 10MB before uploading
- Validate MIME type client-side: only allow `pdf`, `jpg`, `jpeg`, `png`, `docx`
- Show a preview for image files (JPG, PNG) before upload
- Use `FormData` for the API request with `Content-Type: multipart/form-data`
- Display upload progress using Axios's `onUploadProgress` callback
- Handle the server's 422 response for file validation failures (e.g., corrupted file, actual MIME mismatch)

---

## Security Implementation

### Authentication Flow

The system uses Laravel Sanctum with Personal Access Tokens (Bearer tokens):

1. User submits credentials to `POST /api/v1/auth/login`
2. Server validates credentials and checks `is_active` flag
3. Server issues a Sanctum Personal Access Token (24-hour expiration)
4. Frontend stores token in Zustand (persisted to localStorage)
5. All subsequent requests include `Authorization: Bearer {token}`
6. On logout, token is revoked server-side via `DELETE /api/v1/auth/logout`

#### Rate Limiting

Login endpoint is rate-limited: **5 attempts per IP**, with a **5-minute lockout window**. On exceeding the limit, the API returns HTTP 429 with retry-after information.

---

### Input Security

#### SQL Injection Prevention

- Always use Eloquent ORM — never raw SQL with user input
- If raw queries are absolutely necessary, use parameterized bindings only

#### XSS Prevention

- API returns JSON only — no HTML rendering in Laravel
- Frontend: never use `dangerouslySetInnerHTML` with user-supplied data
- React's default escaping handles output sanitization

#### Mass Assignment Protection

All models **MUST** explicitly define mass assignment protection using `$fillable` or `$guarded`. System-managed and sensitive fields such as `user_id`, `created_at`, `updated_at`, and `deleted_at` must never be included in `$fillable` and should be protected using `$guarded`.

---

### Data Encryption

Any information like Government identifier fields (e.g. GSIS, PAG-IBIG, PhilHealth, TIN, PRC) **MUST** be encrypted at rest using Laravel's encrypted cast. Since encrypted fields cannot use SQL `LIKE`, store a SHA-256 hash for uniqueness checks.

> _For the prototype, encryption may be deferred. Mark fields with `// TODO: Encrypt in production`._

---

### File Upload Security

- Store files outside `public/` directory — use `storage/app/private`
- Generate random filenames on upload (UUID + extension) — never preserve original filename
- Serve files through authorized controller endpoints only (never direct URL access)
- Validate MIME types server-side: `pdf`, `jpg`, `jpeg`, `png`, `docx`
- Enforce 10MB file size limit

---

### CORS Configuration

`allowed_origins` **MUST** be restricted to the frontend domain only.

- Development: `http://localhost:5173`
- Production: the actual deployed frontend URL

---

### Production Security Checklist

- `APP_DEBUG=false` in production `.env`
- `APP_KEY` is unique and never committed to version control
- All API routes require `auth:sanctum` middleware (except login/forgot-password)
- Token expiration configured (24 hours default)
- Rate limiting active on login and forgot-password
- CORS restricted to production frontend domain
- HTTPS enforced (Nginx or load balancer)
- Database password is strong and stored in `.env` only
- `.env` is in `.gitignore`
- Audit logging active on all sensitive models
- Scramble docs disabled or auth-gated in production

---

## DevOps & Deployment

### Docker Compose Services

|Service|Image / Build|Port|Purpose|
|---|---|---|---|
|`app`|`backend/Dockerfile` (PHP 8.3 FPM)|9000 (internal)|Laravel application server|
|`webserver`|`nginx:1.25-alpine`|8000:80|Reverse proxy to PHP-FPM|
|`db`|`mysql:8.0`|3306:3306|Primary database|
|`redis`|`redis:7-alpine`|6379:6379|Cache, queue, session driver|
|`frontend`|`frontend/Dockerfile` (Node 20)|5173:5173|Vite dev server|

---

### Quick Start

1. Clone the repository and `cd` into the project root
2. Copy environment file: `cp backend/.env.example backend/.env`
3. Start all services: `docker compose up -d`
4. Generate app key: `docker compose exec app php artisan key:generate`
5. Run migrations and seed: `docker compose exec app php artisan migrate --seed`
6. Access:
    - API: `http://localhost:8000/api/v1`
    - Frontend: `http://localhost:5173`
    - Docs: `http://localhost:8000/docs/api`

---

### CI/CD Pipeline

#### Pull Request Checks (`ci.yml`)

Triggered on PRs to `main` and `develop` branches:

- **Backend:** Setup PHP 8.3, install Composer deps, run migrations on test DB, run PestPHP tests in parallel, Laravel Pint (PSR-12)
- **Frontend:** Setup Node 20, `npm ci`, lint, type-check, production build

#### Deployment (`deploy.yml`)

Triggered on push to `main`:

- Build production Docker images (multi-stage, optimized)
- Push images to container registry
- SSH to production server, pull images, restart services
- Run migrations and cache config

---

### Environment Variables

|Variable|Dev Value|Production Notes|
|---|---|---|
|`APP_ENV`|`local`|Set to `production`|
|`APP_DEBUG`|`true`|**MUST** be `false` in production|
|`APP_KEY`|(generated)|Unique per environment, never in VCS|
|`DB_HOST`|`db`|Docker service name or production DB host|
|`DB_PASSWORD`|`secret`|Strong password in production|
|`CACHE_DRIVER`|`redis`|Keep redis|
|`CORS_ALLOWED_ORIGINS`|`http://localhost:5173`|Restrict to production frontend URL|
|`VITE_API_URL`|`http://localhost:8000/api/v1`|Production API URL|

---

### Required Packages

#### Backend (Composer)

|Package|Purpose|
|---|---|
|`laravel/sanctum`|API authentication|
|`dedoc/scramble`|Auto-generated API documentation|
|`maatwebsite/excel`|Excel/CSV export|
|`barryvdh/laravel-dompdf`|PDF generation|
|`owen-it/laravel-auditing`|Audit trail (optional)|
|`pestphp/pest` + `pest-plugin-laravel`|Testing (dev)|

#### Frontend (npm)

|Package|Purpose|
|---|---|
|`zustand`, `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`|State + forms|
|`axios`, `react-router-dom`|HTTP + routing|
|`@tanstack/react-table`|Data tables|
|`react-apexcharts`|Charts and analytics|
|`@mdi/font`|Icon library|
|`shadcn/ui` components|`button`, `input`, `label`, `card`, `table`, `badge`, `dialog`, `form`, `select`, `tabs`|

---

## Coding Standards & Best Practices

### PHP / Laravel Standards

- Follow PSR-12 coding style
- Use strict types: `declare(strict_types=1)` in all PHP files
- Always use type hints for parameters and return types
- **Controllers:** thin — validate, authorize, delegate to service, return response
- **Services:** contain all business logic, wrapped in transactions where needed
- **Models:** define `$fillable`/`$guarded`, `$casts`, relationships, scopes — no business logic
- **Policies:** handle all authorization checks — never check roles in controllers directly
- **Form Requests:** all validation rules — never validate in controllers
- **API Resources:** shape all JSON output — never return raw models
- Use Eloquent relationships and eager loading — avoid N+1 queries

---

### TypeScript / React Standards

- Strict TypeScript: enable `strict` mode in `tsconfig.json`
- No `any` types — define proper interfaces for all data structures
- Functional components only — no class components
- Use custom hooks to encapsulate data fetching and business logic
- Colocate component-specific types with the component file
- Use Zod schemas that mirror backend validation for client-side validation
- Handle loading, error, and empty states for every data-driven component
- Use `React.memo` and `useMemo`/`useCallback` judiciously for performance

---

### Git Workflow

- **PR process:** Feature branch → development (testing) → staging (pre-production) → main (production)
- **Code review:** All PRs require at least one approval before merge

#### Branch Naming

```
feat/name-of-feature
fix/name-of-fix
```

#### Commit Message Format

```
feat: describe what is the feature to be created
fix: describe fix no.1; describe fix no.2;
style: describing the change of style
refactor: rewrite/restructure code, however does not change any behavior
chore: miscellaneous commit, does not belong above
docs: describe document related commits
test: describe test scenarios created
```

---

### Testing Requirements

- **Backend:** PestPHP for feature tests (API endpoint tests) and unit tests (service logic), implement also Laravel Pint.
- **Frontend:** Vitest for unit tests, React Testing Library for component tests.
- **Minimum coverage:** All CRUD operations, all movement types, all authorization scenarios.
- **CI enforcement:** Tests must pass on every PR before merge.

---

## Software Development Life Cycle

### Waterfall Model

The Waterfall Model is a traditional software development methodology that follows a linear, phase-by-phase approach, where each phase must be completed before moving to the next. It does not allow backtracking and permits only minimal changes once a phase is completed. The model is simple, well-structured, and easy to manage, offering high predictability and clearly defined milestones throughout the development process.

```
Requirements
  └── Design
        └── Development
              └── Testing
                    └── Deploying
                          └── Maintenance
```

---

### SDLC Phases

|Phase|Activities|Output|Deployment|Key Personnels|
|---|---|---|---|---|
|Requirements Gathering|Conduct stakeholder meetings to identify system requirements. Analyze existing processes and workflows. Prepare the Digitalization Plan and data gathering instruments. Perform technical feasibility assessment and document functional and non-functional requirements.|Digitalization Plan, Data Gathering Forms, Minutes of Meetings||Project Manager/Assistant, UI/UX Designers|
|Design|Develop system architecture and database design. Create UI/UX wireframes and prototypes using design tools. Conduct design review meetings and incorporate feedback. Secure approval of the proposed system design.|UI/UX Designs (Figma), Entity Relationship Diagram, Minutes of Meetings, Certificate of Design Acceptance||UI/UX Designers, Backend Developer, Project Manager/Assistant|
|Development|Set up development environments and repositories. Develop frontend and backend modules based on approved designs. Implement APIs and database structures. Conduct code reviews and monitor development progress. Prepare progress reports for project tracking.|Project Monitoring Tool, Progress Report|Local Environment|Developers (Frontend, Backend, FullStack, Migration, etc.), QA Testers, Project Manager/Assistant|
|Testing|Conduct unit and integration testing to ensure system functionality. Perform internal alpha testing with the QA team. Facilitate beta testing with selected process owners. Conduct User Acceptance Testing (UAT) and document identified issues for resolution.|Alpha (QA, Internal Team), Beta (Specified Process Owners), User Acceptance Testing (Process Owners)|Test Site|QA Testers, Project Manager/Assistant, DevOps|
|Deployment|Prepare the staging environment and deploy the system for final verification. Conduct user training and provide system documentation. Perform system launching and rollout activities. Provide initial technical support during deployment.|User's Training, Launching, Certificate of Acceptance|Staging Site|DevOps|
|Maintenance|Monitor system performance and availability in the production environment. Provide technical support and resolve reported issues. Implement system updates, security patches, and approved enhancements.||Production Site|DevOps, Developers (Frontend, Backend, FullStack, Migration, etc.)|