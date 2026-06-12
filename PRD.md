---

# PRD - Company Profile Konsultan IT

## Project Overview

### Nama Project

**TechNova Consulting**

### Deskripsi

Website company profile modern untuk perusahaan konsultan IT yang menyediakan layanan pengembangan perangkat lunak, transformasi digital, cloud solutions, dan cybersecurity.

Website terdiri dari:

1. Public Website (Frontend)
2. Admin CMS Dashboard (Backend)

---

# Tujuan Bisnis

* Meningkatkan kredibilitas perusahaan
* Menampilkan layanan dan portofolio
* Menghasilkan leads melalui form kontak
* Memudahkan admin mengelola konten website

---

# User Roles

## Visitor

Dapat:

* Melihat profil perusahaan
* Melihat layanan
* Melihat portofolio
* Membaca artikel
* Mengirim pesan

---

## Admin

Dapat:

* Login
* Mengelola layanan
* Mengelola proyek
* Mengelola artikel
* Mengelola tim
* Mengelola pesan masuk

---

# Sitemap Frontend

## Home

Section:

### Hero

* Headline
* CTA Button

### Company Stats

* 50+ Clients
* 100+ Projects
* 10 Years Experience

### Services Preview

* Web Development
* Mobile App
* Cloud Solutions
* Cyber Security

### Featured Projects

### Testimonials

### Contact CTA

---

## About Us

* Company Story
* Vision
* Mission
* Core Values

---

## Services

List seluruh layanan.

Detail:

* Judul
* Deskripsi
* Gambar
* Benefit

---

## Portfolio

Grid proyek.

Setiap proyek memiliki:

* Thumbnail
* Nama Project
* Client
* Kategori
* Teknologi

---

## Portfolio Detail

* Banner
* Deskripsi
* Challenge
* Solution
* Results
* Gallery

---

## Blog

Daftar artikel.

---

## Blog Detail

* Cover Image
* Content
* Author
* Date

---

## Contact

* Form kontak
* Maps
* Informasi perusahaan

---

# CMS Dashboard

## Login

Field:

* Email
* Password

Fitur:

* Remember me
* Logout

---

# Dashboard Overview

Widget:

* Total Projects
* Total Services
* Total Articles
* Total Messages

Recent Activity

---

# Module 1 - Services

## List Services

Table:

| Nama | Status | Updated |
| ---- | ------ | ------- |

Actions:

* Create
* Edit
* Delete

---

## Service Data

Field:

* Title
* Slug
* Description
* Icon
* Banner Image
* Status

---

# Module 2 - Portfolio

## List Projects

Actions:

* Create
* Edit
* Delete

---

## Project Data

Field:

* Project Name
* Client Name
* Category
* Technology Stack
* Thumbnail
* Gallery Images
* Challenge
* Solution
* Results
* Featured Project
* Status

---

# Module 3 - Blog

## Article Data

Field:

* Title
* Slug
* Excerpt
* Content
* Featured Image
* Author
* Tags
* Publish Date
* Status

Editor:

* Rich Text Editor

---

# Module 4 - Team Management

Field:

* Name
* Position
* Photo
* Bio
* LinkedIn URL

Actions:

* Create
* Edit
* Delete

---

# Module 5 - Testimonials

Field:

* Client Name
* Company
* Position
* Photo
* Testimonial
* Rating

Actions:

* CRUD

---

# Module 6 - Contact Messages

Saat visitor mengirim form.

Data:

* Name
* Email
* Company
* Message
* Date

Actions:

* Read
* Mark as Read
* Delete

---

# Module 7 - Website Settings

Field:

### General

* Company Name
* Tagline
* Logo
* Favicon

### Contact

* Email
* Phone
* Address

### Social Media

* LinkedIn
* Instagram
* Facebook

---

# Database Tables

### users

* id
* name
* email
* password

### services

* id
* title
* slug
* description
* image

### projects

* id
* title
* slug
* client
* category
* technology
* challenge
* solution
* result

### project_images

* id
* project_id
* image

### blogs

* id
* title
* slug
* content
* image

### team_members

* id
* name
* position
* photo
* bio

### testimonials

* id
* client_name
* testimonial

### contact_messages

* id
* name
* email
* company
* message

### settings

* id
* key
* value

---

# Tech Stack (Portofolio Friendly)

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Framer Motion

### Backend

* Next.js API Routes / NestJS

### Database

* PostgreSQL

### ORM

* Prisma

### Authentication

* NextAuth / JWT

### Storage

* Cloudinary

---

### Fitur yang membuat portofolio terlihat level junior–mid developer

✅ Authentication
✅ Dashboard CMS
✅ CRUD lengkap
✅ Upload image
✅ Rich text editor
✅ Responsive design
✅ Dark mode
✅ SEO metadata
✅ Form validation
✅ Role-based access (Admin)
✅ Dashboard analytics sederhana