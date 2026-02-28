import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config({ path: '.env.local' });

// Additional quiz questions for all 12 wellhead modules (3 new per module = 8 total each)
const newQuestions = [
  // Module 30001 - مقدمة في رأس البئر وتركيبه
  {
    moduleId: 30001,
    questionTextAr: 'ما هو الغرض الرئيسي من "شجرة عيد الميلاد" (Christmas Tree) في رأس البئر؟',
    questionTextEn: 'What is the primary purpose of the "Christmas Tree" in a wellhead?',
    options: [
      { id: 'a', textAr: 'تثبيت أعمدة الغلاف', textEn: 'To fix casing strings' },
      { id: 'b', textAr: 'التحكم في تدفق السوائل المنتجة', textEn: 'To control the flow of produced fluids' },
      { id: 'c', textAr: 'قياس ضغط التكوين', textEn: 'To measure formation pressure' },
      { id: 'd', textAr: 'حماية البئر من التآكل', textEn: 'To protect the well from corrosion' },
    ],
    correctOptionId: 'b',
    explanationAr: 'شجرة عيد الميلاد هي مجموعة الصمامات الموجودة فوق رأس أنبوب الإنتاج، وتتحكم في تدفق السوائل المنتجة من البئر.',
    explanationEn: 'The Christmas Tree is the assembly of valves above the tubing head that controls the flow of produced fluids from the well.',
    order: 7,
  },
  {
    moduleId: 30001,
    questionTextAr: 'ما هو الفرق بين رأس الغلاف (Casing Head) وبكرة الغلاف (Casing Spool)؟',
    questionTextEn: 'What is the difference between a Casing Head and a Casing Spool?',
    options: [
      { id: 'a', textAr: 'لا يوجد فرق بينهما', textEn: 'There is no difference between them' },
      { id: 'b', textAr: 'رأس الغلاف يُركَّب أولاً ويثبت الغلاف الموجّه، بينما تستوعب البكرة الأغلفة الإضافية', textEn: 'The casing head is installed first and anchors the conductor casing, while spools accommodate additional casings' },
      { id: 'c', textAr: 'رأس الغلاف للآبار البحرية فقط', textEn: 'Casing head is for offshore wells only' },
      { id: 'd', textAr: 'البكرة تُستخدم بدلاً من رأس الغلاف في الآبار العميقة', textEn: 'Spools replace casing heads in deep wells' },
    ],
    correctOptionId: 'b',
    explanationAr: 'رأس الغلاف هو أول مكوّن يُركَّب ويثبت الغلاف الموجّه، بينما تُضاف بكرات الغلاف فوقه لاستيعاب أعمدة الغلاف الإضافية.',
    explanationEn: 'The casing head is the first component installed and anchors the conductor casing, while casing spools are added above it to accommodate additional casing strings.',
    order: 8,
  },
  {
    moduleId: 30001,
    questionTextAr: 'ما هو تصنيف الضغط الأعلى المتاح وفق معيار API 6A؟',
    questionTextEn: 'What is the highest pressure rating available under API 6A standard?',
    options: [
      { id: 'a', textAr: '10,000 psi', textEn: '10,000 psi' },
      { id: 'b', textAr: '15,000 psi', textEn: '15,000 psi' },
      { id: 'c', textAr: '20,000 psi', textEn: '20,000 psi' },
      { id: 'd', textAr: '25,000 psi', textEn: '25,000 psi' },
    ],
    correctOptionId: 'c',
    explanationAr: 'يُحدد معيار API 6A تصنيفات ضغط تصل إلى 20,000 psi (20K) لمعدات رأس البئر.',
    explanationEn: 'API 6A standard defines pressure ratings up to 20,000 psi (20K) for wellhead equipment.',
    order: 9,
  },

  // Module 30002 - أنواع رؤوس الآبار البرية والبحرية
  {
    moduleId: 30002,
    questionTextAr: 'ما هو الفرق الرئيسي بين رأس البئر البري والبحري من حيث التصميم؟',
    questionTextEn: 'What is the main design difference between onshore and offshore wellheads?',
    options: [
      { id: 'a', textAr: 'رأس البئر البحري يعمل تحت الماء ويتطلب تحكماً عن بُعد', textEn: 'Offshore wellheads operate underwater and require remote control' },
      { id: 'b', textAr: 'رأس البئر البري يتحمل ضغطاً أعلى', textEn: 'Onshore wellheads handle higher pressure' },
      { id: 'c', textAr: 'رأس البئر البحري أبسط في التصميم', textEn: 'Offshore wellheads are simpler in design' },
      { id: 'd', textAr: 'لا يوجد فرق جوهري', textEn: 'There is no fundamental difference' },
    ],
    correctOptionId: 'a',
    explanationAr: 'رأس البئر البحري (Subsea Wellhead) يعمل تحت الماء على قاع البحر ويتطلب أنظمة تحكم عن بُعد (ROV) للصيانة والتشغيل.',
    explanationEn: 'Subsea wellheads operate underwater on the seabed and require remote-operated vehicle (ROV) systems for maintenance and operation.',
    order: 6,
  },
  {
    moduleId: 30002,
    questionTextAr: 'ما هو معيار API الخاص بمعدات رأس البئر تحت الماء؟',
    questionTextEn: 'What API standard specifically covers subsea wellhead equipment?',
    options: [
      { id: 'a', textAr: 'API 6A', textEn: 'API 6A' },
      { id: 'b', textAr: 'API 17D', textEn: 'API 17D' },
      { id: 'c', textAr: 'API 14A', textEn: 'API 14A' },
      { id: 'd', textAr: 'API 11D1', textEn: 'API 11D1' },
    ],
    correctOptionId: 'b',
    explanationAr: 'معيار API 17D هو المعيار الدولي الخاص بمعدات رأس البئر تحت الماء (Subsea Wellhead Equipment).',
    explanationEn: 'API 17D is the international standard specifically for subsea wellhead equipment.',
    order: 7,
  },
  {
    moduleId: 30002,
    questionTextAr: 'ما هي الميزة الرئيسية لرأس البئر أحادي المحور (Monoblock Wellhead)؟',
    questionTextEn: 'What is the main advantage of a monoblock wellhead?',
    options: [
      { id: 'a', textAr: 'تكلفة أقل وحجم أصغر مع تقليل نقاط التسرب المحتملة', textEn: 'Lower cost and smaller size with fewer potential leak points' },
      { id: 'b', textAr: 'قدرة تحمل ضغط أعلى', textEn: 'Higher pressure capacity' },
      { id: 'c', textAr: 'سهولة الصيانة الميدانية', textEn: 'Ease of field maintenance' },
      { id: 'd', textAr: 'مناسب للآبار البحرية فقط', textEn: 'Suitable for offshore wells only' },
    ],
    correctOptionId: 'a',
    explanationAr: 'رأس البئر أحادي المحور يدمج رأس الغلاف وبكرة الغلاف في وحدة واحدة، مما يُقلل الحجم والتكلفة ونقاط التسرب المحتملة.',
    explanationEn: 'A monoblock wellhead integrates the casing head and casing spool into one unit, reducing size, cost, and potential leak points.',
    order: 8,
  },

  // Module 30003 - إجراءات تركيب رأس البئر
  {
    moduleId: 30003,
    questionTextAr: 'ما هو الترتيب الصحيح لتركيب مكونات رأس البئر؟',
    questionTextEn: 'What is the correct installation sequence for wellhead components?',
    options: [
      { id: 'a', textAr: 'شجرة عيد الميلاد → رأس الغلاف → بكرة الغلاف → رأس أنبوب الإنتاج', textEn: 'Christmas Tree → Casing Head → Casing Spool → Tubing Head' },
      { id: 'b', textAr: 'رأس الغلاف → بكرة الغلاف → رأس أنبوب الإنتاج → شجرة عيد الميلاد', textEn: 'Casing Head → Casing Spool → Tubing Head → Christmas Tree' },
      { id: 'c', textAr: 'رأس أنبوب الإنتاج → رأس الغلاف → بكرة الغلاف → شجرة عيد الميلاد', textEn: 'Tubing Head → Casing Head → Casing Spool → Christmas Tree' },
      { id: 'd', textAr: 'بكرة الغلاف → رأس الغلاف → شجرة عيد الميلاد → رأس أنبوب الإنتاج', textEn: 'Casing Spool → Casing Head → Christmas Tree → Tubing Head' },
    ],
    correctOptionId: 'b',
    explanationAr: 'يبدأ التركيب من الأسفل: رأس الغلاف أولاً (يثبت الغلاف الموجّه)، ثم بكرة الغلاف، ثم رأس أنبوب الإنتاج، وأخيراً شجرة عيد الميلاد.',
    explanationEn: 'Installation starts from the bottom: casing head first (anchors conductor casing), then casing spool, then tubing head, and finally the Christmas tree.',
    order: 6,
  },
  {
    moduleId: 30003,
    questionTextAr: 'ما هو العزم الصحيح لربط مسامير الشفة (Flange Bolts) وفق معيار API؟',
    questionTextEn: 'What is the correct torque for flange bolts according to API standards?',
    options: [
      { id: 'a', textAr: 'يُحدَّد وفق جداول العزم الخاصة بحجم المسمار وتصنيف الضغط', textEn: 'Determined by torque tables specific to bolt size and pressure rating' },
      { id: 'b', textAr: 'دائماً 500 Nm لجميع الأحجام', textEn: 'Always 500 Nm for all sizes' },
      { id: 'c', textAr: 'يُحدَّد بالتجربة الميدانية فقط', textEn: 'Determined by field experience only' },
      { id: 'd', textAr: 'لا يوجد معيار محدد', textEn: 'No specific standard exists' },
    ],
    correctOptionId: 'a',
    explanationAr: 'يُحدَّد عزم ربط مسامير الشفة وفق جداول API المحددة التي تأخذ في الاعتبار حجم المسمار ودرجة المادة وتصنيف الضغط.',
    explanationEn: 'Flange bolt torque is determined by specific API tables that consider bolt size, material grade, and pressure rating.',
    order: 7,
  },
  {
    moduleId: 30003,
    questionTextAr: 'ما هو الهدف من اختبار الضغط الهيدروليكي بعد تركيب رأس البئر؟',
    questionTextEn: 'What is the purpose of hydrostatic pressure testing after wellhead installation?',
    options: [
      { id: 'a', textAr: 'التحقق من عدم وجود تسريبات في جميع الوصلات والمانعات', textEn: 'To verify there are no leaks in all connections and seals' },
      { id: 'b', textAr: 'قياس إنتاجية البئر', textEn: 'To measure well productivity' },
      { id: 'c', textAr: 'تنظيف الأنابيب الداخلية', textEn: 'To clean internal pipes' },
      { id: 'd', textAr: 'تحديد عمق البئر', textEn: 'To determine well depth' },
    ],
    correctOptionId: 'a',
    explanationAr: 'اختبار الضغط الهيدروليكي يُجرى للتحقق من سلامة جميع الوصلات والمانعات وعدم وجود أي تسريبات قبل بدء الإنتاج.',
    explanationEn: 'Hydrostatic pressure testing is performed to verify the integrity of all connections and seals and ensure no leaks exist before production begins.',
    order: 8,
  },

  // Module 30004 - صيانة رأس البئر الدورية والوقائية
  {
    moduleId: 30004,
    questionTextAr: 'ما هي الفترة الموصى بها لإجراء فحص شامل لصمامات رأس البئر؟',
    questionTextEn: 'What is the recommended interval for a comprehensive inspection of wellhead valves?',
    options: [
      { id: 'a', textAr: 'أسبوعياً', textEn: 'Weekly' },
      { id: 'b', textAr: 'شهرياً', textEn: 'Monthly' },
      { id: 'c', textAr: 'سنوياً أو وفق توصيات المصنّع', textEn: 'Annually or per manufacturer recommendations' },
      { id: 'd', textAr: 'كل 5 سنوات', textEn: 'Every 5 years' },
    ],
    correctOptionId: 'c',
    explanationAr: 'يُوصى بإجراء فحص شامل لصمامات رأس البئر سنوياً أو وفق توصيات المصنّع وظروف التشغيل.',
    explanationEn: 'A comprehensive inspection of wellhead valves is recommended annually or per manufacturer recommendations and operating conditions.',
    order: 6,
  },
  {
    moduleId: 30004,
    questionTextAr: 'ما هو الهدف من تشحيم صمامات رأس البئر بانتظام؟',
    questionTextEn: 'What is the purpose of regularly lubricating wellhead valves?',
    options: [
      { id: 'a', textAr: 'تقليل الاحتكاك وتحسين إحكام الإغلاق وإطالة عمر الصمام', textEn: 'Reduce friction, improve sealing, and extend valve life' },
      { id: 'b', textAr: 'زيادة معدل الإنتاج', textEn: 'Increase production rate' },
      { id: 'c', textAr: 'تبريد الصمام أثناء التشغيل', textEn: 'Cool the valve during operation' },
      { id: 'd', textAr: 'منع تراكم الرواسب', textEn: 'Prevent sediment buildup' },
    ],
    correctOptionId: 'a',
    explanationAr: 'التشحيم المنتظم يُقلل الاحتكاك بين الأجزاء المتحركة، يُحسّن إحكام الإغلاق، ويُطيل العمر التشغيلي للصمام.',
    explanationEn: 'Regular lubrication reduces friction between moving parts, improves sealing effectiveness, and extends the operational life of the valve.',
    order: 7,
  },
  {
    moduleId: 30004,
    questionTextAr: 'ما هو مفهوم الصيانة الوقائية (Preventive Maintenance) في سياق رأس البئر؟',
    questionTextEn: 'What is the concept of Preventive Maintenance in the context of wellheads?',
    options: [
      { id: 'a', textAr: 'إصلاح المعدات بعد تعطلها', textEn: 'Repairing equipment after it breaks down' },
      { id: 'b', textAr: 'إجراء فحوصات وصيانة دورية مجدولة لمنع الأعطال قبل حدوثها', textEn: 'Performing scheduled periodic inspections and maintenance to prevent failures before they occur' },
      { id: 'c', textAr: 'استبدال المعدات كل سنة', textEn: 'Replacing equipment every year' },
      { id: 'd', textAr: 'مراقبة المعدات دون أي تدخل', textEn: 'Monitoring equipment without any intervention' },
    ],
    correctOptionId: 'b',
    explanationAr: 'الصيانة الوقائية هي نهج استباقي يتضمن فحوصات ومهام صيانة مجدولة بانتظام لمنع الأعطال قبل حدوثها وإطالة عمر المعدات.',
    explanationEn: 'Preventive maintenance is a proactive approach involving regularly scheduled inspections and maintenance tasks to prevent failures before they occur and extend equipment life.',
    order: 8,
  },

  // Module 30005 - إجراءات السلامة في صيانة رأس البئر
  {
    moduleId: 30005,
    questionTextAr: 'ما هو الحد الأقصى المسموح به لتركيز H2S في بيئة العمل وفق معايير OSHA؟',
    questionTextEn: 'What is the maximum permissible concentration of H2S in the work environment per OSHA standards?',
    options: [
      { id: 'a', textAr: '1 ppm', textEn: '1 ppm' },
      { id: 'b', textAr: '10 ppm (كحد للتعرض لمدة 8 ساعات)', textEn: '10 ppm (as 8-hour exposure limit)' },
      { id: 'c', textAr: '50 ppm', textEn: '50 ppm' },
      { id: 'd', textAr: '100 ppm', textEn: '100 ppm' },
    ],
    correctOptionId: 'b',
    explanationAr: 'تُحدد OSHA حد التعرض المسموح به لـ H2S بـ 10 ppm لمدة 8 ساعات عمل. أما الحد الفوري للخطر على الحياة والصحة (IDLH) فهو 100 ppm.',
    explanationEn: 'OSHA sets the permissible exposure limit for H2S at 10 ppm for an 8-hour workday. The Immediately Dangerous to Life and Health (IDLH) level is 100 ppm.',
    order: 6,
  },
  {
    moduleId: 30005,
    questionTextAr: 'ما هو نظام تصاريح العمل (PTW - Permit to Work) وما أهميته؟',
    questionTextEn: 'What is the Permit to Work (PTW) system and why is it important?',
    options: [
      { id: 'a', textAr: 'نظام لمنح الموظفين إجازات العمل', textEn: 'A system for granting employee work leaves' },
      { id: 'b', textAr: 'نظام رسمي يضمن تحديد وإدارة المخاطر قبل بدء أي عمل خطر', textEn: 'A formal system ensuring hazards are identified and controlled before any hazardous work begins' },
      { id: 'c', textAr: 'نظام لتتبع ساعات العمل', textEn: 'A system for tracking work hours' },
      { id: 'd', textAr: 'نظام لتسجيل الحوادث', textEn: 'A system for recording incidents' },
    ],
    correctOptionId: 'b',
    explanationAr: 'نظام PTW هو إجراء رسمي يضمن تحديد جميع المخاطر المرتبطة بعمل معين وتطبيق الضوابط اللازمة قبل السماح بالبدء في العمل.',
    explanationEn: 'The PTW system is a formal procedure ensuring all hazards associated with a specific task are identified and appropriate controls are applied before work is permitted to begin.',
    order: 7,
  },
  {
    moduleId: 30005,
    questionTextAr: 'ما هو الإجراء الصحيح عند اكتشاف تسرب غاز في موقع رأس البئر؟',
    questionTextEn: 'What is the correct procedure when a gas leak is detected at a wellhead site?',
    options: [
      { id: 'a', textAr: 'محاولة إصلاح التسرب فوراً دون إخلاء', textEn: 'Attempt to repair the leak immediately without evacuation' },
      { id: 'b', textAr: 'إخلاء المنطقة فوراً، إيقاف مصادر الاشتعال، والإبلاغ عن الحادث', textEn: 'Immediately evacuate the area, shut off ignition sources, and report the incident' },
      { id: 'c', textAr: 'الانتظار لمعرفة حجم التسرب أولاً', textEn: 'Wait to assess the size of the leak first' },
      { id: 'd', textAr: 'الاتصال بالمورد للحصول على تعليمات', textEn: 'Contact the supplier for instructions' },
    ],
    correctOptionId: 'b',
    explanationAr: 'عند اكتشاف أي تسرب غاز، يجب إخلاء المنطقة فوراً، إيقاف جميع مصادر الاشتعال، والإبلاغ عن الحادث لفريق الاستجابة للطوارئ.',
    explanationEn: 'Upon detecting any gas leak, immediately evacuate the area, shut off all ignition sources, and report the incident to the emergency response team.',
    order: 8,
  },

  // Module 30006 - إصلاح وتشخيص أعطال رأس البئر
  {
    moduleId: 30006,
    questionTextAr: 'ما هي الطريقة الأكثر شيوعاً لتشخيص تسرب في مانعات تسرب رأس البئر؟',
    questionTextEn: 'What is the most common method for diagnosing leaks in wellhead seals?',
    options: [
      { id: 'a', textAr: 'الفحص البصري وقياس الضغط في فتحات الاختبار', textEn: 'Visual inspection and pressure measurement at test ports' },
      { id: 'b', textAr: 'تفكيك رأس البئر بالكامل', textEn: 'Complete disassembly of the wellhead' },
      { id: 'c', textAr: 'إيقاف الإنتاج لمدة 24 ساعة', textEn: 'Stopping production for 24 hours' },
      { id: 'd', textAr: 'إرسال عينات للمختبر', textEn: 'Sending samples to the laboratory' },
    ],
    correctOptionId: 'a',
    explanationAr: 'يُجرى تشخيص تسرب المانعات عبر الفحص البصري للتسريبات الظاهرة وقياس الضغط في فتحات الاختبار (Test Ports) للكشف عن تسريبات الفضاء الحلقي.',
    explanationEn: 'Seal leak diagnosis is performed through visual inspection for visible leaks and pressure measurement at test ports to detect annular space leaks.',
    order: 6,
  },
  {
    moduleId: 30006,
    questionTextAr: 'ما هو مفهوم "الإصلاح الحي" (Live Well Repair) في صيانة رأس البئر؟',
    questionTextEn: 'What is the concept of "Live Well Repair" in wellhead maintenance?',
    options: [
      { id: 'a', textAr: 'إصلاح البئر بعد إغلاقه الكامل', textEn: 'Repairing the well after complete shutdown' },
      { id: 'b', textAr: 'إجراء أعمال الإصلاح على البئر أثناء استمرار الضغط والإنتاج', textEn: 'Performing repair work on the well while pressure and production continue' },
      { id: 'c', textAr: 'إصلاح البئر باستخدام روبوتات', textEn: 'Repairing the well using robots' },
      { id: 'd', textAr: 'إصلاح البئر بعد حقن الماء', textEn: 'Repairing the well after water injection' },
    ],
    correctOptionId: 'b',
    explanationAr: 'الإصلاح الحي هو إجراء أعمال الصيانة والإصلاح على رأس البئر بينما لا يزال الضغط موجوداً، وهو يتطلب معدات ومهارات متخصصة.',
    explanationEn: 'Live well repair involves performing maintenance and repair work on the wellhead while pressure is still present, requiring specialized equipment and skills.',
    order: 7,
  },
  {
    moduleId: 30006,
    questionTextAr: 'ما هو الاختبار الأمثل للكشف عن الشقوق الدقيقة في مكونات رأس البئر؟',
    questionTextEn: 'What is the best test for detecting micro-cracks in wellhead components?',
    options: [
      { id: 'a', textAr: 'الفحص البصري', textEn: 'Visual inspection' },
      { id: 'b', textAr: 'اختبار الجسيمات المغناطيسية (MPI) أو الموجات فوق الصوتية (UT)', textEn: 'Magnetic Particle Inspection (MPI) or Ultrasonic Testing (UT)' },
      { id: 'c', textAr: 'اختبار الضغط الهيدروليكي فقط', textEn: 'Hydrostatic pressure test only' },
      { id: 'd', textAr: 'قياس السماكة بالأشعة السينية', textEn: 'Thickness measurement by X-ray' },
    ],
    correctOptionId: 'b',
    explanationAr: 'اختبار الجسيمات المغناطيسية (MPI) والموجات فوق الصوتية (UT) هما أكثر طرق الفحص غير المتلف (NDT) فعالية للكشف عن الشقوق الدقيقة.',
    explanationEn: 'Magnetic Particle Inspection (MPI) and Ultrasonic Testing (UT) are the most effective Non-Destructive Testing (NDT) methods for detecting micro-cracks.',
    order: 8,
  },

  // Module 30007 - أنظمة التحكم في البئر (Well Control)
  {
    moduleId: 30007,
    questionTextAr: 'ما هو الحاجز الأول للتحكم في البئر (First Barrier) في نظام التحكم متعدد الحواجز؟',
    questionTextEn: 'What is the First Barrier in a multi-barrier well control system?',
    options: [
      { id: 'a', textAr: 'صمامات رأس البئر (Wellhead Valves)', textEn: 'Wellhead Valves' },
      { id: 'b', textAr: 'طين الحفر (Drilling Fluid/Mud)', textEn: 'Drilling Fluid/Mud' },
      { id: 'c', textAr: 'أنبوب الإنتاج (Production Tubing)', textEn: 'Production Tubing' },
      { id: 'd', textAr: 'الغلاف (Casing)', textEn: 'Casing' },
    ],
    correctOptionId: 'b',
    explanationAr: 'في مرحلة الحفر، الحاجز الأول هو طين الحفر الذي يُوازن ضغط التكوين، بينما في مرحلة الإنتاج يكون أنبوب الإنتاج مع مانعاته.',
    explanationEn: 'During drilling, the first barrier is the drilling fluid that balances formation pressure, while during production it is the production tubing with its seals.',
    order: 6,
  },
  {
    moduleId: 30007,
    questionTextAr: 'ما هو جهاز BOP (Blowout Preventer) وما وظيفته الأساسية؟',
    questionTextEn: 'What is a BOP (Blowout Preventer) and what is its primary function?',
    options: [
      { id: 'a', textAr: 'جهاز لقياس إنتاج البئر', textEn: 'A device for measuring well production' },
      { id: 'b', textAr: 'معدة تُغلق البئر فوراً لمنع انفجار غير منضبط', textEn: 'Equipment that immediately seals the well to prevent an uncontrolled blowout' },
      { id: 'c', textAr: 'جهاز لضخ الطين في البئر', textEn: 'A device for pumping mud into the well' },
      { id: 'd', textAr: 'معدة لفصل السوائل المنتجة', textEn: 'Equipment for separating produced fluids' },
    ],
    correctOptionId: 'b',
    explanationAr: 'جهاز BOP هو معدة سلامة حرجة تُغلق البئر فوراً في حالة فقدان السيطرة على الضغط، لمنع انفجار البئر (Blowout).',
    explanationEn: 'A BOP is a critical safety device that immediately seals the well in case of pressure loss of control, preventing an uncontrolled blowout.',
    order: 7,
  },
  {
    moduleId: 30007,
    questionTextAr: 'ما هو مفهوم "الكيك" (Kick) في عمليات الحفر؟',
    questionTextEn: 'What is the concept of a "Kick" in drilling operations?',
    options: [
      { id: 'a', textAr: 'ضربة ميكانيكية على أدوات الحفر', textEn: 'A mechanical strike on drilling tools' },
      { id: 'b', textAr: 'دخول سوائل التكوين إلى بئر الحفر بسبب انخفاض ضغط طين الحفر', textEn: 'Influx of formation fluids into the wellbore due to insufficient mud pressure' },
      { id: 'c', textAr: 'زيادة مفاجئة في سرعة الحفر', textEn: 'Sudden increase in drilling speed' },
      { id: 'd', textAr: 'انقطاع في عمود أنابيب الحفر', textEn: 'Break in the drill string' },
    ],
    correctOptionId: 'b',
    explanationAr: 'الكيك هو دخول سوائل التكوين (نفط أو غاز أو ماء) إلى بئر الحفر عندما يكون ضغط طين الحفر أقل من ضغط التكوين، وهو المرحلة الأولى قبل الانفجار.',
    explanationEn: 'A kick is the influx of formation fluids (oil, gas, or water) into the wellbore when the mud pressure is less than formation pressure, and is the first stage before a blowout.',
    order: 8,
  },

  // Module 30008 - التآكل وحماية معدات رأس البئر
  {
    moduleId: 30008,
    questionTextAr: 'ما هو الفرق بين التآكل الكيميائي (Chemical Corrosion) والتآكل الكهروكيميائي (Electrochemical Corrosion)؟',
    questionTextEn: 'What is the difference between chemical corrosion and electrochemical corrosion?',
    options: [
      { id: 'a', textAr: 'لا يوجد فرق بينهما', textEn: 'There is no difference between them' },
      { id: 'b', textAr: 'التآكل الكيميائي يحدث بتفاعل مباشر مع المواد الكيميائية، بينما الكهروكيميائي يتطلب وجود إلكتروليت وتيار كهربائي', textEn: 'Chemical corrosion occurs by direct reaction with chemicals, while electrochemical requires an electrolyte and electrical current' },
      { id: 'c', textAr: 'التآكل الكهروكيميائي أسرع دائماً', textEn: 'Electrochemical corrosion is always faster' },
      { id: 'd', textAr: 'التآكل الكيميائي يحدث في الآبار البحرية فقط', textEn: 'Chemical corrosion occurs only in offshore wells' },
    ],
    correctOptionId: 'b',
    explanationAr: 'التآكل الكيميائي يحدث بتفاعل مباشر بين المعدن والمواد الكيميائية (كـ H2S وCO2)، بينما التآكل الكهروكيميائي يتطلب وجود إلكتروليت وتدفق تيار كهربائي.',
    explanationEn: 'Chemical corrosion occurs by direct reaction between metal and chemicals (like H2S and CO2), while electrochemical corrosion requires an electrolyte and electrical current flow.',
    order: 6,
  },
  {
    moduleId: 30008,
    questionTextAr: 'ما هي الحماية الكاثودية (Cathodic Protection) وكيف تعمل؟',
    questionTextEn: 'What is cathodic protection and how does it work?',
    options: [
      { id: 'a', textAr: 'طلاء المعدن بطبقة واقية من الطلاء', textEn: 'Coating the metal with a protective paint layer' },
      { id: 'b', textAr: 'تقنية كهروكيميائية تجعل المعدن المراد حمايته كاثوداً لمنع التآكل', textEn: 'An electrochemical technique that makes the metal to be protected a cathode to prevent corrosion' },
      { id: 'c', textAr: 'استخدام مواد كيميائية لتحييد الأحماض', textEn: 'Using chemicals to neutralize acids' },
      { id: 'd', textAr: 'تبريد المعدن لمنع التفاعلات الكيميائية', textEn: 'Cooling the metal to prevent chemical reactions' },
    ],
    correctOptionId: 'b',
    explanationAr: 'الحماية الكاثودية تقنية كهروكيميائية تُحوّل المعدن المراد حمايته إلى كاثود في خلية كهروكيميائية، مما يمنع تآكله. تُستخدم على نطاق واسع لحماية خطوط الأنابيب والمنشآت البحرية.',
    explanationEn: 'Cathodic protection is an electrochemical technique that converts the metal to be protected into a cathode in an electrochemical cell, preventing its corrosion. It is widely used to protect pipelines and offshore structures.',
    order: 7,
  },
  {
    moduleId: 30008,
    questionTextAr: 'ما هو دور مثبطات التآكل (Corrosion Inhibitors) في حماية رأس البئر؟',
    questionTextEn: 'What is the role of corrosion inhibitors in wellhead protection?',
    options: [
      { id: 'a', textAr: 'تسريع عملية التآكل للكشف المبكر', textEn: 'Accelerate corrosion for early detection' },
      { id: 'b', textAr: 'تكوين طبقة واقية على سطح المعدن تُبطئ أو تمنع التآكل', textEn: 'Form a protective layer on the metal surface that slows or prevents corrosion' },
      { id: 'c', textAr: 'تنظيف المعدن من الصدأ الموجود', textEn: 'Clean existing rust from the metal' },
      { id: 'd', textAr: 'زيادة قوة المعدن الميكانيكية', textEn: 'Increase the mechanical strength of the metal' },
    ],
    correctOptionId: 'b',
    explanationAr: 'مثبطات التآكل هي مواد كيميائية تُضاف إلى السوائل المنتجة أو بيئة التشغيل، وتعمل على تكوين طبقة واقية على سطح المعدن تُبطئ أو تمنع التفاعلات التآكلية.',
    explanationEn: 'Corrosion inhibitors are chemical substances added to produced fluids or the operating environment that form a protective layer on the metal surface, slowing or preventing corrosive reactions.',
    order: 8,
  },

  // Module 30009 - صيانة الصمامات في رأس البئر
  {
    moduleId: 30009,
    questionTextAr: 'ما هو الفرق الرئيسي بين صمام البوابة (Gate Valve) وصمام الكرة (Ball Valve)؟',
    questionTextEn: 'What is the main difference between a gate valve and a ball valve?',
    options: [
      { id: 'a', textAr: 'صمام البوابة يُستخدم للتحكم في التدفق، بينما صمام الكرة للإغلاق الكامل فقط', textEn: 'Gate valve is used for flow control, while ball valve is for full shutoff only' },
      { id: 'b', textAr: 'صمام البوابة يعمل بحركة خطية للبوابة، بينما صمام الكرة يعمل بدوران 90 درجة', textEn: 'Gate valve operates by linear gate movement, while ball valve operates by 90-degree rotation' },
      { id: 'c', textAr: 'صمام الكرة أكثر تكلفة دائماً', textEn: 'Ball valve is always more expensive' },
      { id: 'd', textAr: 'لا يوجد فرق وظيفي بينهما', textEn: 'There is no functional difference between them' },
    ],
    correctOptionId: 'b',
    explanationAr: 'صمام البوابة يعمل بحركة خطية لبوابة معدنية تُفتح أو تُغلق مسار التدفق، بينما صمام الكرة يعمل بدوران كرة مثقوبة 90 درجة.',
    explanationEn: 'A gate valve operates by linear movement of a metal gate that opens or closes the flow path, while a ball valve operates by rotating a bored ball 90 degrees.',
    order: 6,
  },
  {
    moduleId: 30009,
    questionTextAr: 'ما هي أعراض تآكل مقعد الصمام (Valve Seat Erosion)؟',
    questionTextEn: 'What are the symptoms of valve seat erosion?',
    options: [
      { id: 'a', textAr: 'صعوبة في فتح الصمام', textEn: 'Difficulty in opening the valve' },
      { id: 'b', textAr: 'تسرب عبر الصمام حتى في وضع الإغلاق الكامل', textEn: 'Leakage through the valve even in the fully closed position' },
      { id: 'c', textAr: 'ضجيج مرتفع أثناء التشغيل', textEn: 'Loud noise during operation' },
      { id: 'd', textAr: 'ارتفاع درجة حرارة الصمام', textEn: 'Elevated valve temperature' },
    ],
    correctOptionId: 'b',
    explanationAr: 'تآكل مقعد الصمام يُسبب عدم إحكام الإغلاق، مما يُؤدي إلى تسرب السوائل أو الغاز عبر الصمام حتى في وضع الإغلاق الكامل.',
    explanationEn: 'Valve seat erosion causes incomplete sealing, resulting in fluid or gas leakage through the valve even in the fully closed position.',
    order: 7,
  },
  {
    moduleId: 30009,
    questionTextAr: 'ما هو اختبار "Double Block and Bleed" للصمامات؟',
    questionTextEn: 'What is the "Double Block and Bleed" test for valves?',
    options: [
      { id: 'a', textAr: 'اختبار يتضمن إغلاق صمامين متتاليين وتنفيس الضغط بينهما للتحقق من إحكام الإغلاق', textEn: 'A test involving closing two sequential valves and bleeding pressure between them to verify sealing integrity' },
      { id: 'b', textAr: 'اختبار لقياس معدل تدفق السوائل', textEn: 'A test for measuring fluid flow rate' },
      { id: 'c', textAr: 'اختبار لقياس مقاومة الصمام للتآكل', textEn: 'A test for measuring valve corrosion resistance' },
      { id: 'd', textAr: 'اختبار لتحديد عمر الصمام', textEn: 'A test for determining valve lifespan' },
    ],
    correctOptionId: 'a',
    explanationAr: 'اختبار Double Block and Bleed يتضمن إغلاق صمامين متتاليين وتنفيس الضغط المحاصر بينهما، للتحقق من أن كل صمام يُحكم الإغلاق بشكل مستقل.',
    explanationEn: 'Double Block and Bleed test involves closing two sequential valves and bleeding the trapped pressure between them to verify that each valve seals independently.',
    order: 8,
  },

  // Module 30010 - إدارة سلامة العمليات (PSM)
  {
    moduleId: 30010,
    questionTextAr: 'ما هو مفهوم تحليل طبقات الحماية (LOPA - Layer of Protection Analysis)؟',
    questionTextEn: 'What is the concept of Layer of Protection Analysis (LOPA)?',
    options: [
      { id: 'a', textAr: 'تحليل يُقيّم فعالية طبقات الحماية المستقلة في تقليل مخاطر الحوادث', textEn: 'Analysis that evaluates the effectiveness of independent protection layers in reducing incident risks' },
      { id: 'b', textAr: 'تحليل لسماكة جدران الأنابيب', textEn: 'Analysis of pipe wall thickness' },
      { id: 'c', textAr: 'تحليل لتكاليف الصيانة', textEn: 'Analysis of maintenance costs' },
      { id: 'd', textAr: 'تحليل لجودة المواد الخام', textEn: 'Analysis of raw material quality' },
    ],
    correctOptionId: 'a',
    explanationAr: 'LOPA هو منهجية شبه كمية لتقييم مدى كفاية طبقات الحماية المستقلة (IPLs) في تقليل احتمالية وقوع الحوادث إلى مستوى مقبول.',
    explanationEn: 'LOPA is a semi-quantitative methodology for evaluating the adequacy of independent protection layers (IPLs) in reducing the likelihood of incidents to an acceptable level.',
    order: 6,
  },
  {
    moduleId: 30010,
    questionTextAr: 'ما هو الفرق بين HAZOP وWhat-If في تحليل المخاطر؟',
    questionTextEn: 'What is the difference between HAZOP and What-If in hazard analysis?',
    options: [
      { id: 'a', textAr: 'HAZOP منهجي ومنظم يستخدم كلمات دليلية، بينما What-If أكثر مرونة وغير رسمي', textEn: 'HAZOP is systematic and structured using guide words, while What-If is more flexible and informal' },
      { id: 'b', textAr: 'What-If أكثر دقة من HAZOP دائماً', textEn: 'What-If is always more accurate than HAZOP' },
      { id: 'c', textAr: 'HAZOP يُستخدم للمنشآت الجديدة فقط', textEn: 'HAZOP is used for new facilities only' },
      { id: 'd', textAr: 'لا يوجد فرق بينهما', textEn: 'There is no difference between them' },
    ],
    correctOptionId: 'a',
    explanationAr: 'HAZOP منهجية منظمة تستخدم كلمات دليلية (Guide Words) مثل More/Less/No لتحديد الانحرافات، بينما What-If أكثر مرونة وتعتمد على أسئلة افتراضية.',
    explanationEn: 'HAZOP is a structured methodology using guide words (More/Less/No) to identify deviations, while What-If is more flexible and relies on hypothetical questions.',
    order: 7,
  },
  {
    moduleId: 30010,
    questionTextAr: 'ما هو نظام إدارة تغيير المعدات (Management of Change - MOC)؟',
    questionTextEn: 'What is the Management of Change (MOC) system for equipment?',
    options: [
      { id: 'a', textAr: 'نظام لإدارة تغيير الموظفين', textEn: 'A system for managing employee changes' },
      { id: 'b', textAr: 'إجراء رسمي يضمن تقييم وإدارة مخاطر أي تغيير في المعدات أو العمليات أو الإجراءات', textEn: 'A formal procedure ensuring risks of any change in equipment, processes, or procedures are assessed and managed' },
      { id: 'c', textAr: 'نظام لتتبع تغييرات الأسعار', textEn: 'A system for tracking price changes' },
      { id: 'd', textAr: 'إجراء لتحديث برامج الكمبيوتر', textEn: 'A procedure for updating computer software' },
    ],
    correctOptionId: 'b',
    explanationAr: 'نظام MOC هو إجراء رسمي يضمن أن أي تغيير في المعدات أو العمليات أو الإجراءات يخضع لتقييم شامل للمخاطر والموافقة المناسبة قبل التنفيذ.',
    explanationEn: 'MOC is a formal procedure ensuring that any change in equipment, processes, or procedures undergoes comprehensive risk assessment and appropriate approval before implementation.',
    order: 8,
  },

  // Module 30011 - تقنيات التدخل في البئر (Well Intervention)
  {
    moduleId: 30011,
    questionTextAr: 'ما هو الفرق بين تدخل البئر بالأنبوب الملفوف (Coiled Tubing) وتدخل البئر بالأسلاك (Wireline)؟',
    questionTextEn: 'What is the difference between Coiled Tubing and Wireline well intervention?',
    options: [
      { id: 'a', textAr: 'الأنبوب الملفوف يُستخدم لضخ السوائل وتنفيذ عمليات أكثر تعقيداً، بينما الأسلاك لعمليات الأدوات الأخف', textEn: 'Coiled tubing is used for pumping fluids and more complex operations, while wireline is for lighter tool operations' },
      { id: 'b', textAr: 'الأسلاك أكثر تكلفة دائماً', textEn: 'Wireline is always more expensive' },
      { id: 'c', textAr: 'الأنبوب الملفوف للآبار البحرية فقط', textEn: 'Coiled tubing is for offshore wells only' },
      { id: 'd', textAr: 'لا يوجد فرق وظيفي بينهما', textEn: 'There is no functional difference between them' },
    ],
    correctOptionId: 'a',
    explanationAr: 'الأنبوب الملفوف (CT) يُستخدم لضخ السوائل وإجراء عمليات معقدة كالتحفيز والتنظيف، بينما الأسلاك (Wireline) تُستخدم لتشغيل أدوات القياس والتسجيل وإجراء عمليات أخف.',
    explanationEn: 'Coiled Tubing (CT) is used for pumping fluids and complex operations like stimulation and cleaning, while Wireline is used for running measurement/logging tools and lighter operations.',
    order: 6,
  },
  {
    moduleId: 30011,
    questionTextAr: 'ما هو الهدف من عملية تحفيز البئر (Well Stimulation)؟',
    questionTextEn: 'What is the purpose of well stimulation?',
    options: [
      { id: 'a', textAr: 'زيادة معدل إنتاج البئر عن طريق تحسين نفاذية التكوين', textEn: 'Increase well production rate by improving formation permeability' },
      { id: 'b', textAr: 'إغلاق البئر مؤقتاً للصيانة', textEn: 'Temporarily shut in the well for maintenance' },
      { id: 'c', textAr: 'قياس خصائص التكوين', textEn: 'Measure formation properties' },
      { id: 'd', textAr: 'تنظيف رأس البئر من الرواسب', textEn: 'Clean wellhead from deposits' },
    ],
    correctOptionId: 'a',
    explanationAr: 'تحفيز البئر يهدف إلى زيادة معدل الإنتاج عن طريق تحسين نفاذية التكوين، سواء بالتكسير الهيدروليكي (Hydraulic Fracturing) أو التحميض (Acidizing).',
    explanationEn: 'Well stimulation aims to increase production rate by improving formation permeability, either through hydraulic fracturing or acidizing.',
    order: 7,
  },
  {
    moduleId: 30011,
    questionTextAr: 'ما هو نظام التدخل في البئر تحت الضغط (LWIV - Live Well Intervention Vessel)؟',
    questionTextEn: 'What is a Live Well Intervention Vessel (LWIV) system?',
    options: [
      { id: 'a', textAr: 'سفينة متخصصة لإجراء عمليات التدخل في الآبار البحرية دون إيقاف الإنتاج', textEn: 'A specialized vessel for performing well intervention operations in offshore wells without stopping production' },
      { id: 'b', textAr: 'سفينة لنقل المعدات إلى المنصات البحرية', textEn: 'A vessel for transporting equipment to offshore platforms' },
      { id: 'c', textAr: 'سفينة لاستخراج النفط مباشرة', textEn: 'A vessel for directly extracting oil' },
      { id: 'd', textAr: 'سفينة لإجراء اختبارات البئر', textEn: 'A vessel for conducting well tests' },
    ],
    correctOptionId: 'a',
    explanationAr: 'LWIV هي سفينة متخصصة مجهزة بأنظمة تحكم في الضغط تُتيح إجراء عمليات التدخل في الآبار البحرية بينما لا يزال الضغط موجوداً، دون الحاجة لإيقاف الإنتاج.',
    explanationEn: 'LWIV is a specialized vessel equipped with pressure control systems that allows performing intervention operations in offshore wells while pressure is still present, without needing to stop production.',
    order: 8,
  },

  // Module 30012 - الاتجاهات الحديثة في صيانة رأس البئر
  {
    moduleId: 30012,
    questionTextAr: 'ما هو الفرق بين الصيانة التنبؤية (Predictive Maintenance) والصيانة الوقائية (Preventive Maintenance)؟',
    questionTextEn: 'What is the difference between Predictive Maintenance and Preventive Maintenance?',
    options: [
      { id: 'a', textAr: 'الصيانة التنبؤية تعتمد على بيانات حالة المعدة الفعلية للتنبؤ بالأعطال، بينما الوقائية تعتمد على جداول زمنية ثابتة', textEn: 'Predictive maintenance relies on actual equipment condition data to predict failures, while preventive follows fixed time schedules' },
      { id: 'b', textAr: 'الصيانة الوقائية أكثر تقدماً تكنولوجياً', textEn: 'Preventive maintenance is more technologically advanced' },
      { id: 'c', textAr: 'لا يوجد فرق بينهما', textEn: 'There is no difference between them' },
      { id: 'd', textAr: 'الصيانة التنبؤية تُجرى بعد حدوث العطل', textEn: 'Predictive maintenance is performed after failure occurs' },
    ],
    correctOptionId: 'a',
    explanationAr: 'الصيانة التنبؤية تستخدم بيانات حالة المعدة الفعلية (اهتزاز، حرارة، ضغط) وتحليل البيانات للتنبؤ بالأعطال قبل حدوثها، بينما الوقائية تعتمد على جداول زمنية ثابتة.',
    explanationEn: 'Predictive maintenance uses actual equipment condition data (vibration, temperature, pressure) and data analysis to predict failures before they occur, while preventive maintenance follows fixed time schedules.',
    order: 6,
  },
  {
    moduleId: 30012,
    questionTextAr: 'ما هو دور الذكاء الاصطناعي (AI) في صيانة رأس البئر الحديثة؟',
    questionTextEn: 'What is the role of Artificial Intelligence (AI) in modern wellhead maintenance?',
    options: [
      { id: 'a', textAr: 'الاستعاضة الكاملة عن الفنيين البشريين', textEn: 'Complete replacement of human technicians' },
      { id: 'b', textAr: 'تحليل كميات ضخمة من بيانات المستشعرات للكشف المبكر عن الأنماط الشاذة والتنبؤ بالأعطال', textEn: 'Analyzing massive amounts of sensor data for early detection of anomalous patterns and failure prediction' },
      { id: 'c', textAr: 'تصميم معدات رأس البئر الجديدة', textEn: 'Designing new wellhead equipment' },
      { id: 'd', textAr: 'إجراء الصيانة الميدانية آلياً', textEn: 'Performing field maintenance automatically' },
    ],
    correctOptionId: 'b',
    explanationAr: 'الذكاء الاصطناعي يُستخدم لتحليل كميات ضخمة من بيانات المستشعرات بسرعة، للكشف عن الأنماط الشاذة التي تسبق الأعطال والتنبؤ بها قبل وقوعها.',
    explanationEn: 'AI is used to rapidly analyze massive amounts of sensor data, detecting anomalous patterns that precede failures and predicting them before they occur.',
    order: 7,
  },
  {
    moduleId: 30012,
    questionTextAr: 'ما هو مفهوم "التوأم الرقمي" (Digital Twin) في سياق رأس البئر؟',
    questionTextEn: 'What is the concept of a "Digital Twin" in the context of wellheads?',
    options: [
      { id: 'a', textAr: 'نسخة احتياطية رقمية من ملفات رأس البئر', textEn: 'A digital backup copy of wellhead files' },
      { id: 'b', textAr: 'نموذج رقمي افتراضي يُحاكي رأس البئر الفعلي في الوقت الحقيقي لمراقبة الأداء وتحسينه', textEn: 'A virtual digital model that simulates the actual wellhead in real-time to monitor and optimize performance' },
      { id: 'c', textAr: 'نظام لتخزين بيانات الصيانة', textEn: 'A system for storing maintenance data' },
      { id: 'd', textAr: 'برنامج لرسم مخططات رأس البئر', textEn: 'Software for drawing wellhead diagrams' },
    ],
    correctOptionId: 'b',
    explanationAr: 'التوأم الرقمي هو نموذج افتراضي دقيق يُحاكي رأس البئر الفعلي في الوقت الحقيقي باستخدام بيانات المستشعرات، مما يُتيح محاكاة السيناريوهات وتحسين الأداء وتوقع الأعطال.',
    explanationEn: 'A Digital Twin is an accurate virtual model that simulates the actual wellhead in real-time using sensor data, enabling scenario simulation, performance optimization, and failure prediction.',
    order: 8,
  },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  let added = 0;
  for (const q of newQuestions) {
    const optionsJson = JSON.stringify(q.options);
    await conn.execute(
      `INSERT INTO quiz_questions 
       (module_id, question_text_ar, question_text_en, options_json, correct_option_id, explanation_ar, explanation_en, \`order\`, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [q.moduleId, q.questionTextAr, q.questionTextEn, optionsJson, q.correctOptionId, q.explanationAr, q.explanationEn, q.order]
    );
    added++;
  }
  
  // Verify counts
  const [rows] = await conn.execute('SELECT module_id, COUNT(*) as cnt FROM quiz_questions GROUP BY module_id ORDER BY module_id');
  console.log('Updated quiz counts:', JSON.stringify(rows));
  console.log(`Added ${added} new questions`);
  
  await conn.end();
}

main().catch(console.error);
