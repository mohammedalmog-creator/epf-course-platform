/**
 * Add 30 more exam questions per course to reach 100 total
 * EPF course (id=1): 30 more questions
 * Wellhead course (id=2): 30 more questions
 */
import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ─── EPF Additional Questions (30) ────────────────────────────────────────────
const epfExtra = [
  // Advanced process engineering
  { type: 'mcq', ar: 'ما هو معدل التدفق الحجمي للغاز في منشأة EPF النموذجية؟', options: ['1-5 MMSCFD', '10-50 MMSCFD', '100-500 MMSCFD', '1000+ MMSCFD'], correct: '1', time: 45 },
  { type: 'true_false', ar: 'يمكن استخدام الفاصل الثنائي الطور لفصل الغاز والسائل والماء في نفس الوقت.', options: ['صح', 'خطأ'], correct: '1', time: 30 },
  { type: 'mcq', ar: 'ما هو الغرض الرئيسي من وحدة إزالة الرطوبة من الغاز (Gas Dehydration Unit)؟', options: ['رفع ضغط الغاز', 'منع تكوين الهيدرات وتآكل الأنابيب', 'فصل الغاز عن النفط', 'قياس تدفق الغاز'], correct: '1', time: 45 },
  { type: 'mcq', ar: 'ما هو المادة الأكثر استخداماً في وحدات إزالة الرطوبة بالامتصاص الكيميائي؟', options: ['الميثانول', 'ثلاثي إيثيلين غليكول (TEG)', 'الأمونيا', 'كلوريد الكالسيوم'], correct: '1', time: 45 },
  { type: 'true_false', ar: 'نقطة الندى (Dew Point) هي درجة الحرارة التي يبدأ عندها الغاز بالتكثف.', options: ['صح', 'خطأ'], correct: '0', time: 30 },
  { type: 'mcq', ar: 'في نظام معالجة المياه المصاحبة، ما هو الهدف من وحدة CPI (Corrugated Plate Interceptor)؟', options: ['تسخين المياه', 'فصل قطرات النفط من المياه', 'إضافة مواد كيميائية', 'ضخ المياه للحقن'], correct: '1', time: 45 },
  { type: 'mcq', ar: 'ما هو الضغط النموذجي لهواء الأدوات (Instrument Air) في منشآت النفط والغاز؟', options: ['10-20 bar', '7-10 bar', '1-3 bar', '50-100 bar'], correct: '1', time: 40 },
  { type: 'true_false', ar: 'يجب أن يكون هواء الأدوات (Instrument Air) خالياً تماماً من الرطوبة والزيوت.', options: ['صح', 'خطأ'], correct: '0', time: 30 },
  { type: 'mcq', ar: 'ما هو نوع الضاغط الأكثر استخداماً لضغط الغاز في منشآت EPF؟', options: ['الضاغط الترددي (Reciprocating)', 'الضاغط الطاردي المركزي (Centrifugal)', 'الضاغط الحلزوني (Screw)', 'الضاغط الدوراني (Rotary)'], correct: '1', time: 45 },
  { type: 'mcq', ar: 'ما هو الغرض من نظام الحرق (Flare System) في منشآت النفط والغاز؟', options: ['توليد الكهرباء', 'التخلص الآمن من الغازات الزائدة والطوارئ', 'تسخين السوائل', 'قياس إنتاج الغاز'], correct: '1', time: 40 },
  // Advanced safety and instrumentation
  { type: 'mcq', ar: 'ما هو الفرق بين نظام ESD (Emergency Shutdown) ونظام PSD (Process Shutdown)؟', options: ['ESD أسرع من PSD', 'ESD يوقف المنشأة كاملة بينما PSD يوقف جزءاً محدداً', 'لا فرق بينهما', 'PSD للطوارئ و ESD للصيانة'], correct: '1', time: 50 },
  { type: 'true_false', ar: 'يمكن تجاوز (Bypass) نظام الإغلاق الطارئ (ESD) أثناء التشغيل العادي دون أي قيود.', options: ['صح', 'خطأ'], correct: '1', time: 35 },
  { type: 'mcq', ar: 'ما هو مبدأ عمل جهاز قياس التدفق بالفارق الضغطي (Differential Pressure Flowmeter)؟', options: ['قياس السرعة المغناطيسية', 'قياس فرق الضغط عبر عائق في الأنبوب', 'قياس الكثافة بالموجات فوق الصوتية', 'قياس الحرارة الناتجة عن التدفق'], correct: '1', time: 50 },
  { type: 'mcq', ar: 'في منظومة التحكم DCS، ما هو الفرق بين الحلقة المغلقة (Closed Loop) والمفتوحة (Open Loop)؟', options: ['الحلقة المغلقة تستخدم التغذية الراجعة للتحكم التلقائي', 'الحلقة المفتوحة أكثر دقة', 'لا فرق في الأداء', 'الحلقة المغلقة للطوارئ فقط'], correct: '0', time: 50 },
  { type: 'true_false', ar: 'الكاشف الضوئي للدخان (Optical Smoke Detector) أكثر فعالية من الكاشف الأيوني في الأماكن المفتوحة.', options: ['صح', 'خطأ'], correct: '0', time: 35 },
  // Advanced thermodynamics and fluid mechanics
  { type: 'mcq', ar: 'ما هو قانون هنري (Henry\'s Law) وكيف يؤثر على عمليات الفصل؟', options: ['يصف علاقة الضغط بالحجم', 'يصف ذوبان الغاز في السائل بتناسب مع ضغطه الجزئي', 'يصف تدفق السوائل اللزجة', 'يصف انتقال الحرارة بالحمل'], correct: '1', time: 55 },
  { type: 'mcq', ar: 'ما هو معامل الانكماش Z-factor في معادلة حالة الغاز الحقيقي؟', options: ['نسبة كثافة الغاز للهواء', 'معامل تصحيح انحراف الغاز الحقيقي عن المثالي', 'معدل تدفق الغاز', 'ضغط الغاز الجزئي'], correct: '1', time: 55 },
  { type: 'true_false', ar: 'زيادة درجة الحرارة تزيد من لزوجة السوائل النفطية.', options: ['صح', 'خطأ'], correct: '1', time: 30 },
  { type: 'mcq', ar: 'ما هو الغرض من استخدام مبادلات الحرارة من نوع Plate Heat Exchanger في منشآت EPF؟', options: ['مقاومة الضغوط العالية جداً', 'الكفاءة العالية في انتقال الحرارة مع مساحة صغيرة', 'معالجة السوائل اللزجة جداً', 'التشغيل في درجات حرارة فوق 500 درجة'], correct: '1', time: 50 },
  { type: 'mcq', ar: 'ما هو مفهوم NPSH (Net Positive Suction Head) في تصميم المضخات؟', options: ['الضغط الكلي عند مخرج المضخة', 'الضغط المتاح عند مدخل المضخة لمنع التكهف', 'سرعة دوران المضخة', 'كفاءة المضخة الهيدروليكية'], correct: '1', time: 55 },
  // Environmental and regulatory
  { type: 'mcq', ar: 'ما هو الحد الأقصى المسموح به لتركيز H2S في الهواء وفق معايير OSHA؟', options: ['50 ppm', '10 ppm', '1 ppm', '0.1 ppm'], correct: '1', time: 45 },
  { type: 'true_false', ar: 'يُعدّ غاز H2S أثقل من الهواء ويميل إلى التجمع في الأماكن المنخفضة.', options: ['صح', 'خطأ'], correct: '0', time: 30 },
  { type: 'mcq', ar: 'ما هو الغرض من نظام معالجة المياه المصاحبة قبل الحقن أو التصريف؟', options: ['رفع درجة حرارة المياه', 'إزالة الزيوت والمواد الصلبة لتلبية معايير البيئة', 'إضافة مواد كيميائية للمياه', 'تبريد المياه فقط'], correct: '1', time: 45 },
  { type: 'mcq', ar: 'ما هو معيار API 650 المستخدم في صناعة النفط والغاز؟', options: ['تصميم الضواغط', 'تصميم وبناء خزانات التخزين الفولاذية', 'تصميم المضخات الطاردة المركزية', 'معايير السلامة في الحفر'], correct: '1', time: 45 },
  { type: 'true_false', ar: 'يمكن تخزين النفط الخام في خزانات مفتوحة (Open Top Tanks) دون أي مشاكل بيئية.', options: ['صح', 'خطأ'], correct: '1', time: 30 },
  // Advanced operations
  { type: 'mcq', ar: 'ما هو مفهوم "Turndown Ratio" في تصميم المعدات؟', options: ['نسبة الكفاءة الحرارية', 'نسبة الحد الأدنى للتشغيل إلى الطاقة الاسمية', 'معدل تدهور الأداء', 'نسبة الضغط عند الإغلاق'], correct: '1', time: 50 },
  { type: 'mcq', ar: 'ما هو الغرض من اختبار PSSR (Pre-Startup Safety Review)؟', options: ['اختبار كفاءة المعدات', 'التحقق من سلامة المنشأة قبل التشغيل الأولي', 'قياس إنتاج البئر', 'فحص جودة النفط'], correct: '1', time: 45 },
  { type: 'true_false', ar: 'يجب إجراء اختبار الضغط (Pressure Test) لجميع الأنظمة الضاغطة قبل التشغيل الأول.', options: ['صح', 'خطأ'], correct: '0', time: 30 },
  { type: 'mcq', ar: 'ما هو الفرق بين "Commissioning" و"Start-up" في منشآت النفط والغاز؟', options: ['لا فرق بينهما', 'Commissioning هو التحقق من تركيب المعدات وStart-up هو بدء التشغيل الفعلي بالسوائل', 'Start-up يسبق Commissioning', 'Commissioning للمعدات الكهربائية فقط'], correct: '1', time: 55 },
  { type: 'mcq', ar: 'ما هو معدل تدهور أداء مبادل الحرارة بسبب الترسبات (Fouling Factor) وكيف يؤثر على التصميم؟', options: ['يزيد من كفاءة المبادل', 'يقلل من معامل انتقال الحرارة ويستلزم تصميم مساحة إضافية', 'لا تأثير له على التصميم', 'يزيد من سرعة التدفق'], correct: '1', time: 55 },
];

// ─── Wellhead Additional Questions (30) ───────────────────────────────────────
const wellheadExtra = [
  // Advanced wellhead engineering
  { type: 'mcq', ar: 'ما هو الغرض من صمام الأمان تحت السطح (SSSV - Sub-Surface Safety Valve)؟', options: ['قياس ضغط البئر', 'إغلاق البئر تلقائياً عند حدوث تسرب في السطح', 'تنظيم معدل الإنتاج', 'منع تدفق الماء للبئر'], correct: '1', time: 50 },
  { type: 'true_false', ar: 'يمكن تركيب SSSV على عمق أقل من 100 متر تحت السطح في جميع الآبار.', options: ['صح', 'خطأ'], correct: '1', time: 35 },
  { type: 'mcq', ar: 'ما هو الفرق بين رأس البئر من نوع "Spool" ونوع "Compact"؟', options: ['لا فرق في الأداء', 'Compact أصغر حجماً وأخف وزناً ومناسب للمساحات المحدودة', 'Spool أحدث تقنياً', 'Compact للآبار البرية فقط'], correct: '1', time: 50 },
  { type: 'mcq', ar: 'ما هو معيار API 6A المستخدم في صناعة رؤوس الآبار؟', options: ['معيار الحفر والإنتاج لمعدات رأس البئر والشجرة الميتة', 'معيار الصمامات الصناعية', 'معيار خطوط الأنابيب', 'معيار مضخات الحقن'], correct: '0', time: 45 },
  { type: 'true_false', ar: 'تُصنف رؤوس الآبار وفق درجات ضغط محددة تُعرف بـ "Pressure Ratings" وفق معيار API 6A.', options: ['صح', 'خطأ'], correct: '0', time: 30 },
  { type: 'mcq', ar: 'ما هو الغرض من "Tubing Hanger" في رأس البئر؟', options: ['تعليق وتثبيت أنبوب الإنتاج داخل رأس البئر', 'قياس درجة حرارة البئر', 'التحكم في معدل الإنتاج', 'منع تسرب الغاز'], correct: '0', time: 45 },
  // Advanced maintenance and inspection
  { type: 'mcq', ar: 'ما هو الفرق بين اختبار الضغط الهيدروستاتيكي والهوائي لرأس البئر؟', options: ['لا فرق في النتائج', 'الهيدروستاتيكي أكثر أماناً لأن الماء غير قابل للانضغاط', 'الهوائي أكثر دقة', 'الهيدروستاتيكي للمعادن فقط'], correct: '1', time: 50 },
  { type: 'mcq', ar: 'ما هو مفهوم "Wireline Operations" في صيانة الآبار؟', options: ['تركيب خطوط الأنابيب السطحية', 'إجراء عمليات داخل البئر باستخدام سلك معدني رفيع', 'قياس إنتاج البئر', 'حفر آبار جديدة'], correct: '1', time: 45 },
  { type: 'true_false', ar: 'يمكن إجراء عمليات Wireline على الآبار الحية (Live Wells) دون إغلاقها.', options: ['صح', 'خطأ'], correct: '0', time: 35 },
  { type: 'mcq', ar: 'ما هو الغرض من "Christmas Tree Simulator" في تدريب مهندسي الصيانة؟', options: ['محاكاة عمليات الصيانة والطوارئ بشكل آمن', 'قياس إنتاج البئر', 'تصميم رؤوس آبار جديدة', 'اختبار مواد الصمامات'], correct: '0', time: 40 },
  // Corrosion and materials
  { type: 'mcq', ar: 'ما هو نوع التآكل الأكثر شيوعاً في رؤوس الآبار البحرية؟', options: ['التآكل الكيميائي بالأحماض', 'التآكل الكلفاني (Galvanic Corrosion) بسبب اختلاف المعادن', 'التآكل الحراري', 'التآكل الميكانيكي فقط'], correct: '1', time: 50 },
  { type: 'mcq', ar: 'ما هو الغرض من نظام الحماية الكاثودية (Cathodic Protection) في المنشآت البحرية؟', options: ['تقوية هيكل المنصة', 'منع التآكل الكيميائي بتحويل المعدن لكاثود', 'تبريد المعدات', 'قياس سماكة المعدن'], correct: '1', time: 50 },
  { type: 'true_false', ar: 'يُستخدم الفولاذ المقاوم للصدأ (Stainless Steel) دائماً في جميع مكونات رأس البئر.', options: ['صح', 'خطأ'], correct: '1', time: 30 },
  { type: 'mcq', ar: 'ما هو معيار NACE MR0175 المستخدم في صناعة النفط والغاز؟', options: ['معيار مقاومة التشقق الإجهادي الكبريتي (SSC) للمعادن', 'معيار الطلاء الواقي', 'معيار اختبار الضغط', 'معيار تصميم الصمامات'], correct: '0', time: 50 },
  { type: 'mcq', ar: 'ما هو الغرض من اختبار NDT (Non-Destructive Testing) في صيانة رأس البئر؟', options: ['قياس إنتاج البئر', 'فحص سلامة المكونات دون تدميرها', 'تنظيف رأس البئر', 'تركيب صمامات جديدة'], correct: '1', time: 40 },
  // Offshore specific
  { type: 'mcq', ar: 'ما هو الفرق الرئيسي بين رأس البئر البري (Onshore) والبحري (Offshore) من حيث التصميم؟', options: ['لا فرق في التصميم', 'رأس البئر البحري مصمم لمقاومة البيئة البحرية والضغوط الهيدروستاتيكية', 'رأس البئر البري أكثر تعقيداً', 'رأس البئر البحري أصغر حجماً دائماً'], correct: '1', time: 50 },
  { type: 'mcq', ar: 'ما هو نظام BOP (Blowout Preventer) ومتى يُستخدم؟', options: ['نظام لقياس الإنتاج', 'نظام لمنع الانفجار غير المتحكم به أثناء الحفر', 'نظام لضخ المياه', 'نظام لتنظيف البئر'], correct: '1', time: 45 },
  { type: 'true_false', ar: 'يجب اختبار BOP بشكل دوري وفق جدول زمني محدد حتى في أوقات التشغيل العادي.', options: ['صح', 'خطأ'], correct: '0', time: 30 },
  { type: 'mcq', ar: 'ما هو الغرض من "Subsea Christmas Tree" في آبار المياه العميقة؟', options: ['تركيب على قاع البحر للتحكم في إنتاج البئر عن بُعد', 'قياس درجة حرارة قاع البحر', 'حماية البئر من الأسماك', 'تنظيف خطوط الأنابيب'], correct: '0', time: 50 },
  { type: 'mcq', ar: 'ما هو الفرق بين "Dry Tree" و"Wet Tree" في آبار النفط البحرية؟', options: ['Dry Tree على المنصة والWet Tree تحت الماء', 'Dry Tree للغاز والWet Tree للنفط', 'لا فرق في الموقع', 'Dry Tree أقدم تقنياً'], correct: '0', time: 50 },
  // Advanced procedures
  { type: 'mcq', ar: 'ما هو إجراء "Hot Tapping" ومتى يُستخدم في صيانة رأس البئر؟', options: ['تسخين رأس البئر قبل الصيانة', 'إجراء ثقب في خط ضغط حي دون إيقاف التشغيل', 'اختبار درجة حرارة الصمامات', 'تركيب أجهزة قياس جديدة'], correct: '1', time: 55 },
  { type: 'mcq', ar: 'ما هو الغرض من "Pressure Integrity Test" بعد إصلاح رأس البئر؟', options: ['قياس إنتاج البئر بعد الإصلاح', 'التحقق من عدم وجود تسربات وسلامة الإصلاح', 'تنظيف المعدات المُصلحة', 'معايرة أجهزة القياس'], correct: '1', time: 45 },
  { type: 'true_false', ar: 'يمكن إجراء أعمال اللحام على رأس البئر أثناء التشغيل دون الحاجة لإجراءات خاصة.', options: ['صح', 'خطأ'], correct: '1', time: 30 },
  { type: 'mcq', ar: 'ما هو "Valve Seat" ولماذا يُعدّ من أهم مكونات الصمام؟', options: ['الجزء الخارجي للصمام', 'السطح الذي يلامسه عنصر الإغلاق لمنع التسرب', 'مقبض تشغيل الصمام', 'جهاز قياس موضع الصمام'], correct: '1', time: 45 },
  { type: 'mcq', ar: 'ما هو الفرق بين "Hard Seat" و"Soft Seat" في الصمامات؟', options: ['Hard Seat من معدن والSoft Seat من مطاط/بوليمر', 'Hard Seat للضغوط المنخفضة', 'Soft Seat أكثر متانة', 'لا فرق في الأداء'], correct: '0', time: 45 },
  // Regulatory and standards
  { type: 'mcq', ar: 'ما هو معيار API 14C المستخدم في تحليل أنظمة السلامة لمنشآت الإنتاج؟', options: ['معيار الحفر', 'معيار تحليل وتصميم أنظمة السلامة لمنشآت الإنتاج السطحية', 'معيار خزانات التخزين', 'معيار الصمامات'], correct: '1', time: 50 },
  { type: 'mcq', ar: 'ما هو الغرض من "Safety Case" في المنشآت البحرية؟', options: ['حقيبة الإسعافات الأولية', 'وثيقة تثبت إدارة المخاطر وسلامة المنشأة', 'نظام الإنذار المبكر', 'بروتوكول الإخلاء'], correct: '1', time: 50 },
  { type: 'true_false', ar: 'يجب أن تكون جميع صمامات رأس البئر قادرة على الإغلاق الكامل تحت أقصى ضغط تشغيلي.', options: ['صح', 'خطأ'], correct: '0', time: 30 },
  { type: 'mcq', ar: 'ما هو الفرق بين "Fail Safe Open" و"Fail Safe Closed" في الصمامات؟', options: ['لا فرق في حالات الطوارئ', 'FSO يفتح عند فقدان الطاقة وFSC يغلق عند فقدان الطاقة', 'FSO للغاز وFSC للسوائل', 'FSC أقدم تقنياً'], correct: '1', time: 50 },
  { type: 'mcq', ar: 'ما هو مفهوم "Integrity Management" في صيانة رأس البئر؟', options: ['إدارة الموارد البشرية', 'نظام منهجي لضمان سلامة وموثوقية رأس البئر طوال دورة حياته', 'إدارة الإنتاج اليومي', 'نظام محاسبة التكاليف'], correct: '1', time: 55 },
];

// ─── Insert function ───────────────────────────────────────────────────────────
async function insertQuestions(questions, courseId) {
  let inserted = 0;
  const [existing] = await conn.execute('SELECT MAX(`order`) as maxOrder FROM course_exam_questions WHERE course_id = ?', [courseId]);
  let orderStart = (existing[0].maxOrder || 0) + 1;

  for (const q of questions) {
    const optionsJson = JSON.stringify(q.options);
    await conn.execute(
      `INSERT INTO course_exam_questions 
       (course_id, question_type, question_text_ar, question_text_en, options, correct_option_id, time_limit_seconds, difficulty, \`order\`, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'expert', ?, NOW())`,
      [courseId, q.type, q.ar, q.ar, optionsJson, q.correct, q.time, orderStart++]
    );
    inserted++;
  }
  return inserted;
}

console.log('Adding 30 more questions to each course...');
const epfCount = await insertQuestions(epfExtra, 1);
console.log(`✓ EPF course: +${epfCount} questions`);
const wellheadCount = await insertQuestions(wellheadExtra, 2);
console.log(`✓ Wellhead course: +${wellheadCount} questions`);

// Verify final counts
const [epfTotal] = await conn.execute('SELECT COUNT(*) as cnt FROM course_exam_questions WHERE course_id=1');
const [wellheadTotal] = await conn.execute('SELECT COUNT(*) as cnt FROM course_exam_questions WHERE course_id=2');
console.log(`\nFinal counts:`);
console.log(`  EPF exam questions: ${epfTotal[0].cnt}`);
console.log(`  Wellhead exam questions: ${wellheadTotal[0].cnt}`);

await conn.end();
console.log('\nDone!');
