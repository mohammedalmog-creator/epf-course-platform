# HSSE Browser Verification

- `/modules/3` is registered and, for an unauthenticated visitor, redirects to the custom `/login` page.
- The custom login screen renders ALMOG branding and shows all three course labels: Early Production Facilities, Wellhead Maintenance, and Oilfield HSSE.
- Authenticated lesson, quiz, exam, and certificate rendering is additionally covered by the database integrity and source-level tests; a browser session with an authenticated trainee is required for visual verification of those protected screens.

- With an authenticated trainee session, `/modules/3` renders the HSSE title, English subtitle, 18 numbered module cards, safety-green branding, module images, and bottom actions for the comprehensive exam and certificate.

- Authenticated `/module/40001` renders six lessons and the module quiz entry.
- Authenticated `/lesson/41001` renders the specific Arabic lesson title and objective, the HSSE visual, a hazards-and-controls table, a practical case, a verification question, and completion/next-lesson controls.
- The module detail currently shows a stale `70%+` certificate message and a hardcoded `دورة EPF` label; these require correction before final delivery.

- After correction, `/module/40001` shows the Arabic HSSE course label and the 90%+ certificate requirement.
- `/quiz/40001` loads the HSSE module quiz, shows `1/10`, presents an English question with four answer options, and keeps the quiz entry operational.

- `/course-exam/3` renders the correct HSSE title, 100-question exam rule, mixed MCQ/true-false format, per-question timer, 90% pass threshold, one-week failure lockout, and immediate course certificate rule.

- `/course-certificate/3` is registered and, before exam completion, correctly shows that the HSSE certificate requires passing the comprehensive exam at 90% or higher and links back to the final exam.

- A temporary issued HSSE course certificate was opened through the actual public route `/verify/CE-3-7830001-MTJ58YJR`. The page rendered `شهادة صحيحة ومعتمدة`, the trainee name, `الشهادة الشاملة للكورس`, `الأمن والسلامة في الحقول النفطية (Oilfield HSSE)`, score `95.00%`, one attempt, issue date, and the verification code.
- The temporary certificate, exam attempt, and trainee fixture were deleted from the database after verification; no test account remains.
