import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";

const COURSE_ID = 3;
const MODULE_ID_BASE = 40000;
const LESSON_ID_BASE = 41000;
const QUIZ_ID_BASE = 420000;
const EXAM_ID_BASE = 430000;
const source = readFileSync(new URL("../content/oilfield-security-safety-course-company-ready.md", import.meta.url), "utf8");

const moduleHeadings = [...source.matchAll(/^# الوحدة[^\n]+/gm)].map((match) => match[0].replace(/^# /, "").trim());
const moduleSections = source.split(/^# الوحدة[^\n]+/gm).slice(1);
const lessonPattern = /^\|\s*(\d+)\.(\d+)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/gm;
const arabicToEnglish = [
  "HSSE Management and Safety Culture",
  "Hazard Identification and Risk Analysis",
  "Personal Protective Equipment and Work Environment",
  "Permit to Work and Isolation",
  "Process Safety and Well Integrity",
  "H2S, Toxic and Asphyxiating Gases",
  "Fire, Explosion and Hazardous Areas",
  "Emergency Response and First Aid",
  "Physical and Cyber Security",
  "Environment, Spills and Waste",
  "Incident Investigation and Performance Indicators",
  "Capstone Project and Career Preparation",
  "Company and Client-Site Interface Management",
  "Competence, Medical Fitness and Authorization",
  "Service Equipment, Workshops and Quality Safety",
  "Transport, Journey Management and Remote Sites",
  "Occupational Health, Human Factors and Fatigue",
  "Subcontractor Management and Business Continuity",
];
const verifiedVisuals = {
  culture: "/manus-storage/hsse-culture_fa944e04.png",
  risk: "/manus-storage/hsse-risk-analysis_af127334.png",
  emergency: "/manus-storage/hsse-emergency_aac5ae3b.png",
  environmentSecurity: "/manus-storage/hsse-environment-security_f667446f.png",
  operations: "/manus-storage/hsse-operations_662a690a.png",
};
const moduleImageUrls = [
  verifiedVisuals.culture,
  verifiedVisuals.risk,
  verifiedVisuals.culture,
  verifiedVisuals.operations,
  verifiedVisuals.operations,
  verifiedVisuals.emergency,
  verifiedVisuals.emergency,
  verifiedVisuals.emergency,
  verifiedVisuals.environmentSecurity,
  verifiedVisuals.environmentSecurity,
  verifiedVisuals.risk,
  verifiedVisuals.culture,
  verifiedVisuals.operations,
  verifiedVisuals.operations,
  verifiedVisuals.operations,
  verifiedVisuals.operations,
  verifiedVisuals.environmentSecurity,
  verifiedVisuals.culture,
];

const moduleDetails = [
  { focus: "نظام HSSE وثقافة السلامة", hazards: "التطبيع مع الانحرافات، ضعف الإبلاغ، ضغط الإنتاج، وفقدان الثقة في حق إيقاف العمل", controls: "القيادة المرئية، الحوار المفتوح، الإبلاغ العادل، ومراجعة الدروس المستفادة", evidence: "سجل Toolbox Talk، بطاقة ملاحظة آمنة، وتوثيق إغلاق الإجراء", scenario: "يرى الفني حاجزاً مفقوداً قبل بدء الخدمة ويقرر إيقاف العمل والتصعيد بدل تجاوز الخطر" },
  { focus: "تحديد المخاطر وتحليلها", hazards: "خطر غير معروف، ضابط غير كافٍ، أو تغير في نطاق المهمة", controls: "JSA وHAZID وBowtie وتسلسل السيطرة على الخطر", evidence: "نموذج تقييم مخاطر موقع ومراجعة جماعية قبل المهمة", scenario: "تغيرت ظروف الموقع بعد الاجتماع؛ يعاد تقييم المهمة ولا يكتفى بالتوقيع السابق" },
  { focus: "معدات الوقاية وبيئة العمل", hazards: "التعرض الكيميائي، الضوضاء، السقوط، إصابات اليد، وخط النار", controls: "اختيار PPE حسب الخطر، التفتيش، التهوية، الحواجز، وبيئة عمل مرتبة", evidence: "قائمة فحص PPE وسجل التعرض وفحص مكان العمل", scenario: "يكتشف العامل أن القفاز غير مناسب للمادة الكيميائية فيستبدله قبل التعامل معها" },
  { focus: "تصاريح العمل والعزل", hazards: "طاقة مخزنة، ضغط، كهرباء، حركة ميكانيكية، أو بدء غير مقصود", controls: "PTW، LOTO، العزل الموجب، التحقق المستقل، والتسليم بين الورديات", evidence: "تصريح موقع، سجل عزل، واختبار عدم وجود طاقة", scenario: "لا يتطابق رقم المعدة مع التصريح؛ يوقف الفريق المهمة حتى تصحيح الوثيقة والتحقق" },
  { focus: "سلامة العمليات وسلامة الآبار", hazards: "فقدان الاحتواء، فشل حاجز بئر، إنذار متجاوز، أو تغيير غير مُدار", controls: "سلامة الحواجز، الإنذارات، إدارة التغيير، وحدود التشغيل الآمن", evidence: "سجل اختبار الحواجز، مراجعة MOC، وسجل إنذارات", scenario: "يظهر مؤشر ضغط غير متوقع؛ يعزل الفريق المنطقة ويصعد الحالة قبل اتخاذ أي إجراء" },
  { focus: "H₂S والغازات السامة والخانقة", hazards: "التسمم، نقص الأكسجين، أو اشتعال سحابة غاز", controls: "كواشف معايرة، اتجاه الريح، مناطق تجمع، تنفس طوارئ وتدريب معتمد", evidence: "سجل فحص الكاشف، اختبار إنذار الغاز، وسجل تدريب", scenario: "ينطلق إنذار الغاز؛ يتجه العامل عكس اتجاه الريح إلى نقطة التجمع ولا يعود لجلب معدات" },
  { focus: "الحريق والانفجار والمناطق الخطرة", hazards: "مصدر إشعال، تسرب هيدروكربوني، كهرباء غير مناسبة، أو شرارة", controls: "منع مصادر الاشتعال، تصنيف المنطقة، كشف وتسرب، وأنظمة إطفاء", evidence: "فحص معدات كهربائية، تصريح أعمال ساخنة، وسجل اختبار الإطفاء", scenario: "يرفض المشرف تشغيل أداة غير معتمدة داخل منطقة خطرة حتى استبدالها بمعدة مصنفة" },
  { focus: "الطوارئ والإسعافات الأولية", hazards: "تأخر الإنقاذ، اتصال غير واضح، أو تدخل يتجاوز كفاءة المسعف", controls: "خطة طوارئ، إنذار، إخلاء، تجمع، اتصال، وإسعاف ضمن حدود التدريب", evidence: "تمرين طوارئ، سجل حضور، وتقرير ما بعد التمرين", scenario: "بعد حادث سقوط، يؤمن الفريق المكان ويطلب الاستجابة المختصة ولا يحرك المصاب إلا وفق الإجراء" },
  { focus: "الأمن المادي والسيبراني", hazards: "دخول غير مصرح، سرقة، عبث بالمعدات، أو تسرب معلومات تشغيلية", controls: "التحقق من الهوية، التحكم بالوصول، حماية الأجهزة والحسابات، والإبلاغ", evidence: "سجل الزوار، مراجعة الصلاحيات، وتقرير حادث أمني", scenario: "تصل رسالة تطلب كلمة مرور؛ لا يفتح الموظف الرابط ويبلغ أمن المعلومات" },
  { focus: "البيئة والانسكابات والنفايات", hazards: "تلوث التربة أو المياه، نفايات غير مصنفة، أو تسرب غير مبلغ عنه", controls: "احتواء المصدر، تصنيف النفايات، حماية المصارف، والإبلاغ البيئي", evidence: "سجل النفايات، نموذج انسكاب، وفحص منطقة التخزين", scenario: "يلاحظ تسرباً صغيراً؛ يوقف المصدر إن كان آمناً ويحتويه ويبلغ قبل اتساع الأثر" },
  { focus: "التحقيق ومؤشرات الأداء", hazards: "تكرار الحادث، لوم الأفراد، أو إغلاق إجراء دون تحقق", controls: "حفظ الأدلة، تحليل الأسباب، إجراءات قابلة للقياس، وتحقق من الفاعلية", evidence: "تقرير تحقيق، سجل إجراءات، ومؤشر إغلاق متحقق", scenario: "لا يكتفي الفريق بعبارة خطأ العامل؛ يبحث عن ظروف العمل والحواجز والقرارات المؤثرة" },
  { focus: "المشروع النهائي والاستعداد لسوق العمل", hazards: "خطة غير مترابطة، نقص طوارئ، أو عرض غير مدعوم بالأدلة", controls: "Wellsite HSE Plan وJSA ومصفوفة الكفاءة ومراجعة الزملاء", evidence: "ملف مشروع، عرض شفهي، ونموذج تقييم", scenario: "يبني المتدرب خطة لمهمة صيانة رأس بئر ويربط كل خطر بضابط ومسؤول ودليل تحقق" },
  { focus: "الشركة وموقع العميل وإدارة الواجهات", hazards: "اختلاف الإجراءات، فجوة مسؤولية، أو بدء العمل قبل Client Induction", controls: "Bridging Document، مصفوفة مسؤوليات، تعريف الموقع، وتسليم الخدمة", evidence: "سجل induction، وثيقة ربط موقعة، ومحضر تسليم", scenario: "يختلف إجراء العزل بين الشركة والعميل؛ تستخدم وثيقة الربط ولا يختار العامل الإجراء من تلقاء نفسه" },
  { focus: "الكفاءة والصلاحية الطبية والتفويض", hazards: "شخص غير مؤهل، شهادة منتهية، أو تكليف خارج حدود الصلاحية", controls: "مصفوفة كفاءة، تحقق من الشهادات، لياقة طبية، وإشراف وتفويض", evidence: "مصفوفة كفاءة، سجل تدريب، وتقييم ملاحظة عملية", scenario: "لا يسمح المشرف لموظف جديد بالعمل المستقل حتى يثبت الكفاءة ويحصل على التفويض" },
  { focus: "معدات الخدمة والورش وسلامة الجودة", hazards: "خرطوم تالف، ضغط اختبار، أداة غير معايرة، أو معدة معيبة", controls: "فحص قبل الاستخدام، تصنيف ضغط، مناطق عزل، معايرة، وإدارة عيوب", evidence: "سجل معدات، شهادة معايرة، وبطاقة عزل معدة", scenario: "تظهر تشققات في خرطوم؛ يوسم خارج الخدمة ويُبعد عن منطقة العمل ولا يعاد استخدامه" },
  { focus: "النقل وإدارة الرحلات والمواقع البعيدة", hazards: "تصادم، حمولة غير مثبتة، إرهاق، فقدان اتصال، أو تعطل في منطقة نائية", controls: "Journey Management، فحص مركبة، قيادة دفاعية، اتصال وخطة تعطل", evidence: "خطة رحلة، فحص مركبة، وسجل اتصال", scenario: "يتغير الطقس أثناء الرحلة؛ يوقف السائق الرحلة في مكان آمن ويبلغ غرفة التحكم" },
  { focus: "الصحة المهنية والسلوك البشري والإرهاق", hazards: "حرارة، ضوضاء، مواد مؤثرة، قلة نوم، تنمر أو ضغط نفسي", controls: "برنامج صحة مهنية، فترات راحة، إدارة إرهاق، سياسة سلوك ودعم نفسي", evidence: "مراقبة تعرض، سجل ورديات، وإحالة سرية عند الحاجة", scenario: "يصرح العامل بأنه غير لائق للقيادة بسبب الإرهاق؛ يرفع الأمر دون عقوبة ويعاد توزيع المهمة" },
  { focus: "المقاولون الفرعيون واستمرارية الخدمة", hazards: "قدرة غير مثبتة، ضعف إشراف، فقدان مورد حرج، أو توقف الخدمة", controls: "تأهيل المقاول، إشراف، بدائل، خطة طوارئ، وتدقيق وإغلاق عقد", evidence: "سجل تأهيل، تقييم أداء، وخطة استمرارية", scenario: "يتعثر مقاول فرعي في متطلب HSE؛ يوقف نطاقه ويُفعّل التصعيد وخطة البديل" },
];

const moduleDescriptions = [
  "Build a common HSSE language, safety culture, stop-work confidence, and learning from major incidents.",
  "Use hazard identification, JSA, HAZID, Bowtie, hierarchy of controls, and Toolbox Talks.",
  "Select, inspect, and use PPE while controlling line-of-fire, hand, ergonomic, and environmental exposure risks.",
  "Understand permit boundaries, energy isolation, verification, handover, and restart controls.",
  "Connect occupational safety with process safety, well barriers, containment, alarms, and management of change.",
  "Recognize toxic, flammable, and oxygen-deficient atmospheres and respond only within authorized training.",
  "Prevent ignition, control fire and explosion hazards, and understand hazardous-area equipment interfaces.",
  "Apply initial emergency actions, communications, evacuation, muster, first aid boundaries, and recovery learning.",
  "Protect people, facilities, information, SCADA interfaces, credentials, and third-party access.",
  "Control spills, produced water, waste streams, environmental reporting, and resource protection.",
  "Investigate incidents fairly, preserve evidence, identify root and contributing factors, and track actions.",
  "Integrate learning into a wellsite HSE plan, capstone deliverable, career evidence, and interview preparation.",
  "Work safely at client locations through induction, bridging documents, responsibility matrices, and handover.",
  "Match people to tasks through competency matrices, certificates, medical fitness, supervision, and authorization.",
  "Control service equipment, workshops, tools, hoses, pressure testing, calibration, defects, and change.",
  "Plan journeys, vehicle checks, loads, fatigue controls, communications, lone work, and roadside emergencies.",
  "Manage occupational exposure, heat, fatigue, medication, respectful behavior, mental health, and human error.",
  "Qualify subcontractors, supervise third parties, maintain continuity, audit records, and close contracts.",
];

function parseModules() {
  const modules = [];
  for (let index = 0; index < moduleSections.length && index < 18; index += 1) {
    const rows = [...moduleSections[index].matchAll(lessonPattern)];
    const number = index + 1;
    const titleAr = moduleHeadings[index].replace(/^الوحدة\s+[^:]+:\s*/, "");
    const lessons = rows.map((row, lessonIndex) => ({
      number: Number(row[2]),
      titleAr: row[3].trim(),
      outcome: row[4].trim(),
      order: lessonIndex + 1,
    }));
    modules.push({ number, titleAr, titleEn: arabicToEnglish[index], description: moduleDescriptions[index], detail: moduleDetails[index], imageUrl: moduleImageUrls[index], lessons });
  }
  return modules;
}

function lessonMarkdown(module, lesson) {
  const detail = module.detail;
  const evidence = lesson.number % 2 === 0 ? "قائمة تحقق موقعة وسجل توعية" : "ملاحظة ميدانية وتوثيق إغلاق";
  const decision = lesson.number % 3 === 0 ? "أوقف المهمة، احمِ الأشخاص، واطلب مراجعة المشرف قبل الاستمرار" : "تحقق من الضابط، ناقش التغيير مع الفريق، وسجل القرار في نموذج المهمة";
  return `# ${lesson.titleAr}\n\n![رسم توضيحي لموضوع الدرس](${module.imageUrl})\n\n**الزمن التقديري:** 30 دقيقة\n\n## الهدف التعليمي\n\n${lesson.outcome}\n\n## سياق الدرس\n\nيركز هذا الدرس على **${detail.focus}** داخل عمل شركة الخدمات النفطية، وعلى ما يجب أن يراه الموظف ويتحقق منه قبل وأثناء وبعد المهمة. يجب تطبيق المحتوى مع إجراء الشركة وتصريح العمل وتعليمات العميل وتقييم المخاطر الخاص بالمهمة.\n\n## المخاطر والضوابط\n\n| العنصر | التطبيق في هذا الدرس |\n|---|---|\n| الخطر النموذجي | ${detail.hazards} |\n| الضوابط الأساسية | ${detail.controls} |\n| دليل التحقق المطلوب | ${evidence}، إضافة إلى ${detail.evidence} |\n\n## حالة تطبيقية\n\n**السيناريو:** ${detail.scenario}.\n\n**قرار الموظف:** ${decision}.\n\n**سؤال التحقق:** ما الحاجز الذي يجب التأكد من فعاليته أولاً عند تنفيذ «${lesson.titleAr}»؟ اذكر الخطر، والضابط، ومن يملك صلاحية إعادة بدء العمل.\n\n## تطبيق ميداني\n\nقبل بدء المهمة، يراجع المتدرب نطاق العمل، الأشخاص المشاركين، المعدات، مصادر الطاقة، التداخلات، وسيناريو الطوارئ. إذا تغيرت الظروف أو فُقد حاجز حرج، يوقف العمل ويصعّد الأمر وفق سلسلة المسؤوليات المعتمدة.\n\n## الخلاصة\n\nالممارسة الآمنة تبدأ بفهم المهمة، ثم تحديد المخاطر، ثم اختيار الضوابط الأقوى، ثم التحقق من فعاليتها، ثم الإبلاغ والتعلم من النتائج.\n\n> **تنبيه:** المرجع الملزم هو قانون الدولة وإجراء الشركة وإجراء العميل وخطة الطوارئ الخاصة بالموقع. هذا الدرس لا يمنح تفويضاً للعمل الحرج دون تدريب عملي وتقييم كفاءة.`;
}

function moduleQuizQuestions(module, moduleIndex) {
  return Array.from({ length: 10 }, (_, index) => {
    const lesson = module.lessons[index % module.lessons.length];
    const correct = index % 4;
    const options = [
      { id: "a", textAr: "تجاهل الخطر إذا كان العمل مستعجلاً", textEn: "Ignore the hazard when the work is urgent" },
      { id: "b", textAr: "التحقق من المخاطر والضوابط قبل متابعة المهمة", textEn: "Verify hazards and controls before continuing the task" },
      { id: "c", textAr: "الاعتماد على معدات الوقاية وحدها", textEn: "Rely on personal protective equipment alone" },
      { id: "d", textAr: "نقل المسؤولية إلى فريق آخر دون إخطار", textEn: "Transfer responsibility without notification" },
    ];
    if (index % 4 === 1) options.reverse();
    const correctOptionId = options[correct]?.id ?? "b";
    return {
      id: QUIZ_ID_BASE + moduleIndex * 10 + index + 1,
      moduleId: MODULE_ID_BASE + module.number,
      questionTextAr: `ما الإجراء الأكثر أماناً عند تطبيق موضوع الدرس «${lesson.titleAr}»؟`,
      questionTextEn: `Which action best demonstrates safe application of the lesson "${module.titleEn}"?`,
      optionsJson: JSON.stringify(options),
      correctOptionId,
      explanationAr: "يجب التحقق من الخطر والضوابط والتواصل قبل استمرار المهمة، مع إيقاف العمل عند فقدان السيطرة.",
      explanationEn: "The worker must verify the hazard and controls, communicate with the responsible people, and stop when control is lost.",
      order: index + 1,
    };
  });
}

function finalExamQuestions(modules) {
  const lessons = modules.flatMap((module) => module.lessons.map((lesson) => ({ module, lesson })));
  return Array.from({ length: 100 }, (_, index) => {
    const item = lessons[index % lessons.length];
    if (index % 5 === 0) {
      return {
        id: EXAM_ID_BASE + index + 1,
        courseId: COURSE_ID,
        questionType: "true_false",
        questionTextAr: `صح أم خطأ: يجب تطبيق ضوابط درس «${item.lesson.titleAr}» وفق إجراء الموقع وتقييم المخاطر قبل تنفيذ المهمة.`,
        questionTextEn: `True or False: The controls related to "${item.lesson.titleAr}" must be applied through the site procedure and task risk assessment before work begins.`,
        optionsJson: JSON.stringify([{ id: "T", textAr: "صح", textEn: "True" }, { id: "F", textAr: "خطأ", textEn: "False" }]),
        correctOptionId: "T",
        explanationAr: "المحتوى العام لا يلغي إجراء الموقع أو التقييم الخاص بالمهمة.",
        explanationEn: "General training content does not replace the site procedure or task-specific risk assessment.",
        difficulty: "hard",
        timeLimitSeconds: 90,
        order: index + 1,
      };
    }
    const options = [
      { id: "a", textAr: "البدء فوراً دون مراجعة", textEn: "Start immediately without review" },
      { id: "b", textAr: "التحقق من المهمة والمخاطر والحواجز والاتصال", textEn: "Verify the task, hazards, barriers, and communication" },
      { id: "c", textAr: "إخفاء التغيير عن العميل", textEn: "Hide the change from the client" },
      { id: "d", textAr: "إلغاء التوثيق لتوفير الوقت", textEn: "Cancel documentation to save time" },
    ];
    return {
      id: EXAM_ID_BASE + index + 1,
      courseId: COURSE_ID,
      questionType: "mcq",
      questionTextAr: `ما القرار المهني الأفضل في سيناريو مرتبط بـ «${item.module.titleAr}»؟`,
      questionTextEn: `What is the most professional decision in a scenario related to "${item.module.titleEn}"?`,
      optionsJson: JSON.stringify(options),
      correctOptionId: "b",
      explanationAr: "القرار الآمن يربط نطاق العمل بالمخاطر والحواجز والاتصال والتوثيق.",
      explanationEn: "A safe decision connects the work scope with hazards, barriers, communication, and documentation.",
      difficulty: index % 3 === 0 ? "expert" : "hard",
      timeLimitSeconds: 90,
      order: index + 1,
    };
  });
}

async function main() {
  const modules = parseModules();
  const lessonCount = modules.reduce((total, module) => total + module.lessons.length, 0);
  if (modules.length !== 18 || lessonCount !== 91) {
    throw new Error(`Curriculum parse mismatch: expected 18 modules/91 lessons, got ${modules.length}/${lessonCount}`);
  }
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    for (const module of modules) {
      const moduleId = MODULE_ID_BASE + module.number;
      await connection.execute(
        `INSERT INTO modules (id, course_id, module_number, title_ar, title_en, description_ar, description_en, duration, \`order\`, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE course_id=VALUES(course_id), module_number=VALUES(module_number), title_ar=VALUES(title_ar), title_en=VALUES(title_en), description_ar=VALUES(description_ar), description_en=VALUES(description_en), duration=VALUES(duration), \`order\`=VALUES(\`order\`), image_url=VALUES(image_url)`,
          [moduleId, COURSE_ID, module.number, module.titleAr, module.titleEn, module.description, module.description, "أسبوع واحد", module.number, module.imageUrl],
      );
      for (const lesson of module.lessons) {
        const lessonId = LESSON_ID_BASE + (module.number - 1) * 100 + lesson.number;
        await connection.execute(
          `INSERT INTO lessons (id, module_id, lesson_number, title_ar, title_en, content_markdown, estimated_minutes, \`order\`, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE module_id=VALUES(module_id), lesson_number=VALUES(lesson_number), title_ar=VALUES(title_ar), title_en=VALUES(title_en), content_markdown=VALUES(content_markdown), estimated_minutes=VALUES(estimated_minutes), \`order\`=VALUES(\`order\`), image_url=VALUES(image_url)`,
          [lessonId, moduleId, lesson.number, lesson.titleAr, `${module.titleEn} — Lesson ${lesson.number}`, lessonMarkdown(module, lesson), 30, lesson.order, module.imageUrl],
        );
      }
    }

    for (const module of modules) {
      const moduleIndex = module.number - 1;
      for (const question of moduleQuizQuestions(module, moduleIndex)) {
        await connection.execute(
          `INSERT INTO quiz_questions (id, module_id, question_text_ar, question_text_en, options_json, correct_option_id, explanation_ar, explanation_en, \`order\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE module_id=VALUES(module_id), question_text_ar=VALUES(question_text_ar), question_text_en=VALUES(question_text_en), options_json=VALUES(options_json), correct_option_id=VALUES(correct_option_id), explanation_ar=VALUES(explanation_ar), explanation_en=VALUES(explanation_en), \`order\`=VALUES(\`order\`)`,
          [question.id, question.moduleId, question.questionTextAr, question.questionTextEn, question.optionsJson, question.correctOptionId, question.explanationAr, question.explanationEn, question.order],
        );
      }
    }

    for (const question of finalExamQuestions(modules)) {
      await connection.execute(
        `INSERT INTO course_exam_questions (id, course_id, question_type, question_text_ar, question_text_en, options, correct_option_id, explanation_ar, explanation_en, difficulty, time_limit_seconds, \`order\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE course_id=VALUES(course_id), question_type=VALUES(question_type), question_text_ar=VALUES(question_text_ar), question_text_en=VALUES(question_text_en), options=VALUES(options), correct_option_id=VALUES(correct_option_id), explanation_ar=VALUES(explanation_ar), explanation_en=VALUES(explanation_en), difficulty=VALUES(difficulty), time_limit_seconds=VALUES(time_limit_seconds), \`order\`=VALUES(\`order\`)`,
        [question.id, question.courseId, question.questionType, question.questionTextAr, question.questionTextEn, question.optionsJson, question.correctOptionId, question.explanationAr, question.explanationEn, question.difficulty, question.timeLimitSeconds, question.order],
      );
    }
    console.log(`HSSE course seeded: ${modules.length} modules, ${lessonCount} lessons, ${modules.length * 10} module questions, 100 exam questions`);
    process.exitCode = 0;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
