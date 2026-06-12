# DESIGN SYSTEM & ARCHITECTURE BLUEPRINT (design.md)
**Project Name:** TechNova Consulting - Company Profile & CMS Dashboard  
**Framework Target:** Next.js (App Router), TypeScript, Tailwind CSS, Ant Design (AntD v5), Framer Motion  
**Document Version:** 1.0.0  

---

## 1. BRANDING & VISUAL IDENTITY SYSTEM

### 1.1 Color Palette
To project an elite, reliable, and cutting-edge IT consulting image, the visual system adapts a refined dark-mode-first aesthetic inspired by top-tier modern tech landing pages (e.g., Tokboost ID architecture), combined with clean, high-contrast light configurations for the back-office CMS dashboard.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PRIMARY & ACCENTS (IT Consulting Vibe)                                      │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│ Cyan Accent       │ Electric Indigo   │ Deep Slate (Bg)   │ Soft Gray (Text)│
│ #06B6D4           │ #4F46E5           │ #0F172A           │ #94A3B8         │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

* **Primary Accent:** `#06B6D4` (Tailwind `cyan-500`) - Represents technology, high-speed delivery, and clean interactions.
* **Secondary Accent:** `#4F46E5` (Tailwind `indigo-600`) - Represents deep engineering competence, intelligence, and system robustness.
* **Dark Background Surface:** `#0F172A` (Tailwind `slate-900`) & `#020617` (Tailwind `slate-950`).
* **Light Dashboard Surface:** `#FFFFFF` (Main cards) & `#F8FAFC` (Tailwind `slate-50` background).
* **Semantic Status Colors (AntD Customization Mapping):**
    * Success: `#10B981` (Emerald-500)
    * Warning: `#F59E0B` (Amber-500)
    * Error: `#EF4444` (Red-500)
    * Info: `#3B82F6` (Blue-500)

### 1.2 Typography System
* **Primary Typeface:** `Inter`, Sans-serif (via `next/font/google`)
* **Display/Heading Typeface:** `Plus Jakarta Sans` or `Clash Display` (Clean, premium geometric appearance for headers).
* **Scale Specification:**
    * `h1` (Hero Headline): `36pt` to `48pt`, Bold (700/800), tracking tight (`-0.02em`).
    * `h2` (Section Titles): `24pt` to `30pt`, SemiBold (600), tracking tight.
    * `h3` (Component Headers): `16pt` to `18pt`, Medium (500).
    * `body` (Main Text Content): `10.5pt` (`14px` to `16px`), Regular (400), leading relaxed (`1.6`).
    * `caption/small`: `9pt` (`12px`), Medium (500) or Regular, for metadata, badges, and table headers.

### 1.3 Design Language, Shadows & Layout Foundations
* **Border Radii:** Consistent use of `8px` (`rounded-lg`) for interactive structural elements (Buttons, Form inputs, AntD Dropdowns) and `12px` to `16px` (`rounded-xl` / `rounded-2xl`) for content blocks like Portfolio Cards and CMS widgets.
* **Shadow Configuration:**
    * `Elevation-Low` (Cards): `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)`
    * `Elevation-High` (Modals/Popovers): `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`
* **Interactive Micro-Interactions (Framer Motion Defaults):**
    * Card Hover state: Scale `1.02`, Y-axis translation `-4px`, transition `duration: 0.3, ease: "easeOut"`.
    * Button Active state: Scale `0.96`, transition `duration: 0.1`.

---

## 2. FRONTEND PUBLIC WEBSITE LAYOUT & STRUCTURE

The public-facing website features a seamless single-page feeling layout with modular routes utilizing full-viewport sections, fluid responsive grids, and subtle background gradient glowing mesh orbs.

### 2.1 Navigation Layout Structure
* **Header Bar:** Fixed top position (`sticky top-0`), glassmorphism backdrop blurs (`bg-slate-900/80 backdrop-blur-md`). Left side features the `TechNova` typography logo with a cyan icon mark. Right side contains localized text links, a Theme Switcher toggle (Sun/Moon icon), and a high-contrast CTA link button (`Get Free Consultation`).
* **Footer Structure:** 4-column layout (`Company Info`, `Services Quicklinks`, `Latest Insights`, `Legal Info`) with social links at the base. Bottom row houses the copyright text.

### 2.2 Wireframe Blueprint & Section Tokens

#### [Home Route: `/`]
1.  **Hero Grid Section:** 2-Column asymmetric block.
    * *Left Box (60% width):* Stacked eyebrow text (`Transforming Enterprises`), Master H1 Header with text gradients (`Indigo-to-Cyan`), descriptive body text block, and secondary button adjacent to primary neon-shadowed button.
    * *Right Box (40% width):* Abstract 3D-like structural SVG layout or real-time interactive animated canvas showing core networks.
2.  **Company Stats Banner:** Low-height grid layout partitioned by subtle vertical split lines (`border-slate-800`). Emphasized large numerical values (`50+`, `100+`) utilizing numeric font weights.
3.  **Services Preview Container:** 4-Column flexible card layout (`sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4`). Cards feature an overlay border stroke that glows neon cyan on mouse proximity.
4.  **Featured Projects Flex Container:** Alternate left/right row positioning for high-profile projects, followed by an elegant grid block for remaining items.
5.  **Testimonials Carousel:** Centered quote layout featuring avatar components, enterprise company badges, and a custom dot-pagination system.

#### [Portfolio & Details Routes: `/portfolio` & `/portfolio/[slug]`]
* **`/portfolio`:** Top-level multi-select interactive filtering pill navigation bar (`All`, `Cloud`, `Web Dev`, `Cybersecurity`). Grid transition animations powered by Framer Motion's `<AnimatePresence>` to flawlessly animate item sorting.
* **`/portfolio/[slug]`:** Double-column layout block. Left side acts as a scroll-locked sticky container displaying structural project metadata (Client Name, Industry, Timeline, Tech Stack tags). Right side flows dynamically containing full Case Study blocks (`Challenge`, `Solution`, `Results`, image gallery showcases).

#### [Contact Route: `/contact`]
* Split-pane arrangement. Left side hosts immediate direct office details (Interactive click-to-email links, phone connections, structured corporate address block, embedded map canvas). Right side houses the contact generation interface using client-validated input components.

---

## 3. ADMIN CMS DASHBOARD WORKSPACE DESIGN

The administrative dashboard transitions seamlessly to a high-efficiency layout designed for rapid data management, dense readable tables, and frictionless content generation workflows.

### 3.1 Dashboard Layout Framework (Ant Design Layout Engine)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR MENU   │  TOP BAR (Breadcrumbs, Quick-Search, User Profile Dropdown)│
│  (Collapsible)  ├───────────────────────────────────────────────────────────┤
│                 │  CORE DATA APP SURFACE (White canvas base, slate-50 bg)   │
│  - Overview     │                                                           │
│  - Services     │  ┌──────────────────────────────┐ ┌────────────────────┐  │
│  - Portfolio    │  │ Form Fields / Filters        │ │ AntD Table Records │  │
│  - Blog / Team  │  │ [Text] [Dropdown] [Search]   │ │ [Checkbox] [Edit]  │  │
│  - Messages     │  └──────────────────────────────┘ └────────────────────┘  │
│  - Settings     │                                                           │
└─────────────────┴───────────────────────────────────────────────────────────┘
```

* **Navigation Mechanism (`AntD <Sider>`):** Collapsible sidebar configured with a dark navy background theme (`theme="dark"`), using unified icons matching each functional module.
* **Header Section (`AntD <Header>`):** Clean white strip containing breadcrumb indicators (`Dashboard > Services > Edit`), universal instant search bar, notification center bell for new incoming messages, and account details popover menu.
* **Main Container (`AntD <Content>`):** Enclosed in responsive wrapper padding (`p-6` or `24px`), built over a light grey background tint (`#F8FAFC`) to maximize content item visual contrast.

### 3.2 Key System Module Layout Specifications

#### Module 1 & 2: Services & Portfolio Management Tables
* **Control Row:** Horizontal header cluster providing global text query input fields, multi-select categorical filtering dropdown components, and a primary call-to-action button anchored to the right border (`+ Add New Item`).
* **Data Representation System (`AntD <Table>`):**
    * Dense layout style with custom columns. Status strings rendered using structural badge components (`AntD <Badge>`) utilizing color definitions (Green = Published, Yellow = Draft).
    * Right-most column locked to provide record interaction options (`Edit` pencil button trigger, `Delete` trash icon wrapped in an individual validation alert popover container `<Popconfirm>`).

#### Module 3: Content Editing Workspace (Blog Module)
* **Workspace Splitting:** 2-Column form configuration grid.
    * *Primary Column (70% Canvas Width):* Full title input field, automated slug generation preview ticker, and a Rich Text Editor zone (e.g., TipTap or React-Quill) running over an extensive toolbar setup.
    * *Secondary Metadata Column (30% Canvas Width):* Dropzone wrapper box for high-resolution file handling, scheduling calendar date-pickers, structural categorization tag systems, and status selector pills.

#### Module 6: Inbound Leads Interface (Contact Messages)
* Split layout design featuring a Master-Detail architecture configuration. Left listing panel presents incoming items ordered chronologically. Clicking an item populates the right main reading pane with complete payload content block displays (Sender identity, corporate association, detailed text block), accompanied by functional toggle controls (`Mark as Read`, `Direct Email Reply`).

---

## 4. DESIGN-TO-CODE DATA STRUCTURE & COMPONENT MAPPING

To maintain an uncompromised standard of execution during frontend development, this section details exactly how data structures interface directly with specialized presentation components.

### 4.1 UI Component to Database Field Component Matrix

| UI Presentation Layer Feature | Target AntD / Tailwind Component | Underlying Prisma Model Source Fields | Validation Rules & UX Enhancements |
| :--- | :--- | :--- | :--- |
| **Hero Stats Cards** | `AntD <Card>`, `<Statistic>` | Calculations compiled across `projects`, `services`, `blogs` tables | Number counts dynamically trigger animated increment transitions via Counter components. |
| **Services Grid** | Custom Grid + Tailwind hover animations | `services.title`, `services.description`, `services.image` | Fallback icon asset displays if source image URLs are missing. |
| **Portfolio Showcase Grid** | Framer Motion `<motion.div>` dynamic layouts | `projects.title`, `projects.client`, `projects.technology`, `projects.image` | Seamless inline layout adjustments when changing portfolio tags. |
| **Rich Text Engine** | Embedded custom `TipTap` rich text field | `blogs.content`, `projects.challenge`, `projects.solution` | Automatically generates clean HTML strings. Client-side sanitization strips unsafe tags. |
| **Status Indicators** | `AntD <Badge status="...">`, `AntD <Tag>` | Multiple instances: `status` string fields across tables | Consistent status color mapping (Green for live items, Amber for drafts). |
| **Administrative Tables** | `AntD <Table>` with pagination hooks | Row datasets pulled via specialized REST or server action payloads | Columns feature native sorting capabilities and built-in scroll controls for smaller viewports. |

### 4.2 Comprehensive System Route & Token Blueprint
Developers should follow this path map when scaffolding pages in the Next.js App Router workspace:

```
src/
├── app/
│   ├── (public)/                 # Public website route group
│   │   ├── page.tsx              # Home Route with Hero, Stats, Previews
│   │   ├── about/
│   │   │   └── page.tsx          # Corporate Profile, Core Values
│   │   ├── services/
│   │   │   └── page.tsx          # Full Services Directory Canvas
│   │   ├── portfolio/
│   │   │   ├── page.tsx          # Interactive Filterable Portfolio Grid
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Deep Case Study Layout
│   │   ├── blog/
│   │   │   ├── page.tsx          # Article Streams with Tag Filtering
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Standard Article Reading Template
│   │   └── contact/
│   │       └── page.tsx          # High-Conversion Forms & Contact Map
│   │
│   ├── admin/                    # Secured back-office workspace route group
│   │   ├── login/
│   │   │   └── page.tsx          # Centered Form with Client Authentication
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # System KPI Metrics Overview
│   │   │   ├── services/
│   │   │   │   ├── page.tsx      # Services Management Table View
│   │   │   │   └── [id]/page.tsx # Unified Creation & Update Document Workspace
│   │   │   ├── portfolio/
│   │   │   │   ├── page.tsx      # Project Showcases Control Grid
│   │   │   │   └── [id]/page.tsx # Multifile Drag-and-Drop Form Workspace
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx      # Articles Data Registry Table
│   │   │   │   └── [id]/page.tsx # Rich Text Editor Canvas Interface
│   │   │   ├── team/
│   │   │   │   └── page.tsx      # Team Profiles Management Interface
│   │   │   ├── messages/
│   │   │   │   └── page.tsx      # Lead Inbox Master-Detail Workspace
│   │   │   └── settings/
│   │   │       └── page.tsx      # Global Corporate Profile Variable Configurator
│   │   └── layout.tsx            # Protected Workspace Layout Frame (Sidebar Wrapper)
│   └── layout.tsx                # Universal Application Provider Frame (AntD, NextAuth)
```

---

## 5. TECHNICAL INTERACTION & PRODUCTION REFINEMENT

### 5.1 Interactive Form Validation Architecture
* **Validation Rules Engine:** All interface forms (Inbound contact request lines, CMS management canvas interfaces) run on top of robust validation schema handlers (`Zod`), integrated into client controllers via React Hook Form frameworks.
* **User Notification Framework (`AntD message` / `<Notification>`):**
    * Form submission triggered $ightarrow$ Disable target interaction button elements, show active state animations.
    * Operation resolves successfully $ightarrow$ Close input overlays, reset input vectors, pop floating success notices.
    * Server error encountered $ightarrow$ Dynamic highlight border tracking lines wrap offending input fields, notify with warning prompts.

### 5.2 Enterprise Portfolio Polish (Mid-Developer Targets)
* **Adaptive SEO Generation Ecosystem:** Client-facing detail views (`/blog/[slug]`, `/services/[slug]`) implement async structural schema parsing pipelines (`generateMetadata()`). This dynamically populates OpenGraph tags, semantic title headers, description fields, and content snippet assets derived directly from the PostgreSQL instance.
* **Media Pipeline Optimization:** Content asset paths do not point to native absolute local media buffers. Image payloads pass to CDN pipelines (Cloudinary) via specialized processing bridges (`next/image`), applying automatic size reductions, multi-device width scaling, and modern WebP compression.
* **Optimistic UI Updates & Skeleton Buffers:** High-frequency administrative operations (like updating service statuses or deleting messages) use optimistic state updates to update the UI instantly, while loading placeholders (`AntD <Skeleton>`) shield initial layout loads from layout shift issues.
