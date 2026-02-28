# Project TODO

## Bugs to Fix
- [x] Fix certificate download button not working on certificate page
- [x] Add certificate download functionality to dashboard (currently missing despite text saying it's available)

## New Issues
- [x] Fix certificate download button on /certificate/1 page - button doesn't trigger download

## Critical Issues
- [x] Certificate download still not working - investigate and fix permanently

## Deployment Issues
- [x] Published site at https://epfcourse-t3xikgmn.manus.space not accessible - needs republishing with latest fixes

## New Features
- [x] Add ALMOG logo to certificate PDF design

## Quiz UI Issues
- [x] Align quiz answers to the right (RTL) for Arabic text
- [x] Randomize answer order so correct answer is not always in second position

## Quiz UI Enhancement
- [x] Move green checkmark icon to the right side of correct answers (RTL layout)

## Quiz UI Fix - Correct Alignment
- [x] Align entire answer text with checkmark together on the right side (not separate)

## Quiz English Translation
- [x] Add English text fields to database schema (textEn, explanationEn for questions; textEn for options)
- [x] Migrate database schema
- [x] Translate all quiz questions and options to English and update DB
- [x] Update Quiz UI to display English text

## Critical Bug - Quiz Correct Answer Validation
- [x] Fix: correct answers being marked as wrong - mismatched correct_option_id in database (21 out of 42 questions fixed)

## Wellhead Maintenance Course
- [x] Seed 12 wellhead modules and 18 lessons into database
- [x] Add 61 bilingual (AR+EN) quiz questions for all 12 modules
- [x] Add course selection page (EPF + Wellhead)
- [x] Update navigation to support multiple courses
- [x] Update getModules API to filter by courseId
- [x] Test all modules and quizzes end-to-end

## Wellhead Course - Missing Lessons Fix
- [x] Audit current lessons in DB (only 18 exist, need 57)
- [x] Add 31 missing lessons for modules 5-12 (total 49 lessons now)
- [x] Ensure each lesson has full Arabic content in EPF style

## Certificate After Quiz
- [x] Redesign Certificate.tsx with professional visual certificate preview (English)
- [x] Certificate includes course name, module name, student name, score, and date
- [x] Download PDF certificate functionality

## Professional Illustrative Images
- [x] Generate 12 professional AI images for each Wellhead module
- [x] Upload images to CDN and link to modules in database
- [x] Update Modules.tsx to display module images in cards with hover effects

## Missing Lessons & Per-Lesson Images
- [x] Added 11 missing lessons to reach 60 total (5 per module x 12 modules)
- [x] Generated 60 professional AI illustrative images for all lessons
- [x] Added image_url column to lessons table in schema and ran db:push
- [x] Uploaded 59 lesson images to CDN
- [x] Updated all lessons in DB with CDN image URLs
- [x] Updated LessonView.tsx to display lesson image at top of content

## Wellhead Course - Full Content Review
- [x] Audit all 12 modules and 60 lessons for content quality and logical sequence
  - [x] Fix any content issues found (missing content, wrong sequence, poor markdown)
  - [x] Review and replace any poor-quality or mismatched lesson images
  - [x] Verify all lesson numbers and module order are correct

## New Improvements (Feb 2026)

### Quiz Enhancements
- [x] Upgrade wellhead modules to 8 questions each (more comprehensive)
- [x] Add Arabic UI to quiz page (bilingual)
- [x] Show attempt number on quiz

### Certificate Redesign
- [x] Add attempt count on certificate (transparency)
- [x] Add unique certificate verification code (anti-forgery)
- [x] Redesign PDF: professional layout with prominent ALMOG logo
- [x] Add watermark to PDF certificate
- [x] Store attempt_count in certificates table (schema update)

### Course UI Improvements
- [x] ModuleDetail: add icons per lesson, improve layout
- [x] LessonView: add breadcrumb, sidebar lesson list, improve mark-complete button
- [x] Quiz.tsx: translate UI to Arabic, add attempt counter
- [x] Modules.tsx: add completion badges (existing)

### File Cleanup
- [x] Delete all scripts/*.mjs seed/fix files (19 files removed)
- [x] Delete ComponentShowcase.tsx (unused page)

## Home Page Redesign (Mar 2026)
- [x] Redesign Home.tsx as professional multi-course landing page for ALMOG Petroleum Services
- [x] Hero section with dark gradient background and ALMOG branding
- [x] Stats bar showing platform-wide numbers (21 units, 100+ lessons, 138+ questions, 2 courses)
- [x] Courses section showing both EPF and Wellhead courses with topics, stats, and CTAs
- [x] Features section highlighting platform benefits
- [x] Professional footer with ALMOG logo and navigation links
- [x] Sticky header with navigation links and auth buttons

## Logo & Certificate Improvements (Mar 2026)
- [x] Upload official ALMOG SVG logo to CDN
- [x] Replace old GIF logo with official SVG across all 12+ pages
- [x] Standardize logo size to h-12 across all page headers
- [x] Update header branding to two-line: company name + platform name
- [x] Convert SVG to PNG for PDF certificate generation (high quality)
- [x] Lesson completion percentage works for both courses (Modules.tsx)
- [x] EPF certificate PDF uses same professional design as Wellhead
- [x] Certificate.tsx shows attempt count and verification code for both courses

## Logo Size Enhancement (Mar 2026)
- [x] Increase logo size in all page headers (h-12 → h-16)
- [x] Increase header height from h-16 to h-20 to accommodate larger logo
- [x] Increase logo size in PDF certificate (90px → 180px wide, doubled)
- [x] Regenerate PNG logo at 800x400 high resolution for PDF
- [x] Adjust PDF Y positions to fit larger logo
- [x] Add Arabic company name to PDF certificate footer

## Admin Panel (Mar 2026)
- [x] Add admin DB helpers: list users, quiz attempts, certificates, platform stats
- [x] Add TRPCError guard in routers.ts (role check: admin only)
- [x] Add tRPC procedures: admin.getStats, admin.getUsers, admin.getQuizAttempts, admin.getCertificates, admin.getUserDetail, admin.promoteUser
- [x] Build AdminPanel.tsx with 3 tabs: Trainees, Quiz Results, Certificates + stats cards
- [x] Add user detail dialog with full history (certs, quiz attempts, lesson count)
- [x] Add promote/demote user to admin button
- [x] Register /admin route in App.tsx
- [x] Add admin nav link in Home.tsx header (visible only to admin role, amber color)

## Certificate Verification & CSV Export (Mar 2026)
- [ ] Add publicProcedure: verifyCertificate (lookup by code, return cert + user + module info)
- [ ] Build CertificateVerify.tsx: public page /verify/:code with professional verification UI
- [ ] Register /verify/:code route in App.tsx
- [ ] Add CSV export to AdminPanel: export trainees, quiz results, certificates as CSV
- [ ] Add verification URL to Certificate.tsx page and PDF footer

## Notification System & Trainee Profile (Mar 2026)
- [ ] Add phone and email fields to users table in drizzle schema
- [ ] Push DB migration for new user fields
- [ ] Add updateProfile tRPC procedure (protected)
- [ ] Build ProfileSetup.tsx onboarding page for first-login trainees
- [ ] Add redirect logic: after login, if no phone/email → redirect to /profile-setup
- [ ] Add auto-notification to admin when new user registers (via notifyOwner)
- [ ] Update admin panel to show phone and email columns for each trainee
- [ ] Update CSV export to include phone and email

## Visual Content & UI Enhancement (Mar 2026)
- [x] Add illustrative images for valve types lesson (60015) and other technical lessons
- [x] Audit all wellhead lessons and identify those needing additional visual aids
- [x] Generate professional illustrative images for identified lessons (4 valve type diagrams)
- [x] Redesign lesson content rendering: beautiful typography, cards, callouts, step indicators
- [x] Apply improved content style to all courses

## Visual Improvements Completed (Mar 2026)
- [x] Redesign LessonView.tsx with attractive dark theme, reading progress bar, better typography
- [x] Add visual hierarchy with color-coded headings, styled code blocks, tables, and blockquotes
- [x] Generate 4 professional technical diagrams for valve types (Gate, Ball, Choke, Check valves)
- [x] Embed valve type images directly in lesson 60015 content
- [x] Expand short lessons: 60023, 60024, 60025, 60026, 60028, 60029, 60031 with richer content
- [x] Add reading progress bar at top of lesson page
- [x] Improve lesson navigation with prev/next lesson titles shown in buttons
- [x] Add motivational "key takeaway" section before completion button
