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
