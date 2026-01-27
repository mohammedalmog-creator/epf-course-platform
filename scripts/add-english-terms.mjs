import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Comprehensive terminology mapping (Arabic -> English)
const terminology = {
  // Unit 1 - Oil & Gas Industry
  'الاستكشاف': 'Exploration (الاستكشاف)',
  'الحفر': 'Drilling (الحفر)',
  'الإنتاج': 'Production (الإنتاج)',
  'المعالجة': 'Processing (المعالجة)',
  'التكرير': 'Refining (التكرير)',
  'النقل': 'Transportation (النقل)',
  'التوزيع': 'Distribution (التوزيع)',
  'المنبع': 'Upstream (المنبع)',
  'المنتصف': 'Midstream (المنتصف)',
  'المصب': 'Downstream (المصب)',
  'البئر': 'Well (البئر)',
  'الحقل': 'Field (الحقل)',
  'الخزان': 'Reservoir (الخزان)',
  
  // Unit 2 - Separation
  'الفاصل': 'Separator (الفاصل)',
  'الفصل': 'Separation (الفصل)',
  'الجاذبية': 'Gravity (الجاذبية)',
  'الضغط': 'Pressure (الضغط)',
  'درجة الحرارة': 'Temperature (درجة الحرارة)',
  'زمن المكوث': 'Residence Time (زمن المكوث)',
  'القطرات': 'Droplets (القطرات)',
  'المستحلب': 'Emulsion (المستحلب)',
  'الرغوة': 'Foam (الرغوة)',
  'الحاجز': 'Baffle (الحاجز)',
  'الموزع': 'Distributor (الموزع)',
  'مزيل الضباب': 'Mist Eliminator (مزيل الضباب)',
  'مجمع الأنابيب': 'Manifold (مجمع الأنابيب)',
  
  // Unit 3 - Oil Treatment
  'التجفيف': 'Dehydration (التجفيف)',
  'إزالة الأملاح': 'Desalting (إزالة الأملاح)',
  'التثبيت': 'Stabilization (التثبيت)',
  'السخان': 'Heater (السخان)',
  'المعالج': 'Treater (المعالج)',
  'ضغط البخار': 'Vapor Pressure (ضغط البخار)',
  'المكونات الخفيفة': 'Light Ends (المكونات الخفيفة)',
  'المكونات الثقيلة': 'Heavy Ends (المكونات الثقيلة)',
  'الكسور': 'Fractions (الكسور)',
  
  // Unit 4 - Gas Processing
  'التحلية': 'Sweetening (التحلية)',
  'الأمين': 'Amine (الأمين)',
  'الجليكول': 'Glycol (الجليكول)',
  'الامتصاص': 'Absorption (الامتصاص)',
  'الامتزاز': 'Adsorption (الامتزاز)',
  'التجديد': 'Regeneration (التجديد)',
  'نقطة الندى': 'Dew Point (نقطة الندى)',
  'الغاز الحمضي': 'Sour Gas (الغاز الحمضي)',
  'الغاز الحلو': 'Sweet Gas (الغاز الحلو)',
  'كبريتيد الهيدروجين': 'Hydrogen Sulfide (كبريتيد الهيدروجين)',
  'ثاني أكسيد الكربون': 'Carbon Dioxide (ثاني أكسيد الكربون)',
  'السوائل الطبيعية': 'Natural Gas Liquids (السوائل الطبيعية)',
  'المياه المنتجة': 'Produced Water (المياه المنتجة)',
  
  // Unit 5 - Utilities
  'الضاغط': 'Compressor (الضاغط)',
  'الضغط': 'Compression (الضغط)',
  'المضخة': 'Pump (المضخة)',
  'الضخ': 'Pumping (الضخ)',
  'مبادل حراري': 'Heat Exchanger (مبادل حراري)',
  'المبرد': 'Cooler (المبرد)',
  'المسخن': 'Heater (المسخن)',
  'المولد': 'Generator (المولد)',
  'التوربين': 'Turbine (التوربين)',
  'المحرك': 'Engine (المحرك)',
  'هواء الأجهزة': 'Instrument Air (هواء الأجهزة)',
  
  // Unit 6 - Storage & Safety
  'خزان التخزين': 'Storage Tank (خزان التخزين)',
  'السقف الثابت': 'Fixed Roof (السقف الثابت)',
  'السقف العائم': 'Floating Roof (السقف العائم)',
  'القياس': 'Metering (القياس)',
  'عداد التدفق': 'Flow Meter (عداد التدفق)',
  'الإيقاف الطارئ': 'Emergency Shutdown (الإيقاف الطارئ)',
  'كشف الحريق': 'Fire Detection (كشف الحريق)',
  'كشف الغاز': 'Gas Detection (كشف الغاز)',
  'الإطفاء': 'Fire Suppression (الإطفاء)',
  'صمام الأمان': 'Safety Valve (صمام الأمان)',
  'صمام التنفيس': 'Relief Valve (صمام التنفيس)',
  'الحماية البيئية': 'Environmental Protection (الحماية البيئية)',
  
  // Unit 7 - Design
  'التصميم': 'Design (التصميم)',
  'الحسابات': 'Calculations (الحسابات)',
  'الأبعاد': 'Sizing (الأبعاد)',
  'التدفق': 'Flow (التدفق)',
  'معدل التدفق': 'Flow Rate (معدل التدفق)',
  'الأنابيب': 'Piping (الأنابيب)',
  'الصمام': 'Valve (الصمام)',
  'صمام بوابة': 'Gate Valve (صمام بوابة)',
  'صمام كروي': 'Globe Valve (صمام كروي)',
  'صمام عدم رجوع': 'Check Valve (صمام عدم رجوع)',
  'صمام تحكم': 'Control Valve (صمام تحكم)',
  'مخطط الأنابيب': 'Piping and Instrumentation Diagram (مخطط الأنابيب)',
  
  // Unit 9 - Operations
  'التشغيل': 'Operation (التشغيل)',
  'الصيانة': 'Maintenance (الصيانة)',
  'بدء التشغيل': 'Startup (بدء التشغيل)',
  'الإيقاف': 'Shutdown (الإيقاف)',
  'استكشاف الأخطاء': 'Troubleshooting (استكشاف الأخطاء)',
  'الأعطال': 'Failures (الأعطال)',
  'الإنذارات': 'Alarms (الإنذارات)',
  'المراقبة': 'Monitoring (المراقبة)',
  'التحكم': 'Control (التحكم)',
  'نظام التحكم': 'Control System (نظام التحكم)',
  
  // Common technical terms
  'النفط الخام': 'Crude Oil (النفط الخام)',
  'الغاز الطبيعي': 'Natural Gas (الغاز الطبيعي)',
  'الماء': 'Water (الماء)',
  'الزيت': 'Oil (الزيت)',
  'الغاز': 'Gas (الغاز)',
  'السائل': 'Liquid (السائل)',
  'البخار': 'Vapor (البخار)',
  'الطور': 'Phase (الطور)',
  'ثلاثي الأطوار': 'Three-Phase (ثلاثي الأطوار)',
  'ثنائي الطور': 'Two-Phase (ثنائي الطور)',
  'الكثافة': 'Density (الكثافة)',
  'اللزوجة': 'Viscosity (اللزوجة)',
  'التركيب': 'Composition (التركيب)',
  'الخواص': 'Properties (الخواص)',
  'المواصفات': 'Specifications (المواصفات)',
  'المعايير': 'Standards (المعايير)',
  'الكفاءة': 'Efficiency (الكفاءة)',
  'الأداء': 'Performance (الأداء)',
  'السعة': 'Capacity (السعة)',
  'الإنتاجية': 'Productivity (الإنتاجية)'
};

// Get all lessons
const [lessons] = await connection.query('SELECT id, module_id, `order`, content_markdown FROM lessons ORDER BY module_id, `order`');

let updatedCount = 0;

for (const lesson of lessons) {
  let content = lesson.content_markdown;
  let modified = false;
  
  // Replace each Arabic term with English (Term)
  for (const [arabic, englishWithArabic] of Object.entries(terminology)) {
    // Only replace if the Arabic term appears standalone (not already followed by English)
    const regex = new RegExp(`\\b${arabic}\\b(?!\\s*\\([^)]*\\))`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, englishWithArabic);
      modified = true;
    }
  }
  
  if (modified) {
    await connection.query(
      'UPDATE lessons SET content_markdown = ? WHERE id = ?',
      [content, lesson.id]
    );
    updatedCount++;
    console.log(`✅ Updated Unit ${lesson.module_id}, Lesson ${lesson.order}`);
  }
}

await connection.end();
console.log(`\n✅ Updated ${updatedCount} lessons with English terminology!`);
