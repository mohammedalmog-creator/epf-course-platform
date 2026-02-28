/**
 * Seed script for Wellhead Maintenance Course (Oil & Gas - Onshore & Offshore)
 * Uses exact same structure as EPF course seed script
 * course_id = 2 for Wellhead Maintenance
 */

import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log("Connected to database. Starting Wellhead Maintenance course seed...");

// Clear existing wellhead data (course_id = 2)
const [existingModules] = await connection.execute("SELECT id FROM modules WHERE course_id = 2");
for (const mod of existingModules) {
  await connection.execute("DELETE FROM quiz_questions WHERE module_id = ?", [mod.id]);
  await connection.execute("DELETE FROM lessons WHERE module_id = ?", [mod.id]);
}
await connection.execute("DELETE FROM modules WHERE course_id = 2");
console.log("Cleared existing wellhead data.");

// ─────────────────────────────────────────────────────────────────────────────
// MODULES
// ─────────────────────────────────────────────────────────────────────────────

const modules = [
  {
    order: 1,
    titleAr: "مقدمة في رأس البئر وتركيبه",
    titleEn: "Introduction to Wellhead and Its Components",
    descriptionAr: "نظرة شاملة على مفهوم رأس البئر ومكوناته الأساسية في عمليات النفط والغاز البرية والبحرية.",
    descriptionEn: "A comprehensive overview of the wellhead concept and its fundamental components in onshore and offshore oil and gas operations.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "ما هو رأس البئر؟",
        titleEn: "What is a Wellhead?",
        content: `# ما هو رأس البئر؟ (What is a Wellhead?)

## التعريف

**رأس البئر (Wellhead)** هو المجموعة الهيكلية من المعدات الموجودة على سطح البئر النفطية أو الغازية، وتُشكّل النقطة الحرجة التي تربط الجزء تحت السطحي (Subsurface) بالجزء السطحي (Surface) من البئر. يُعدّ رأس البئر بمثابة "بوابة التحكم" الرئيسية في عمليات الإنتاج والحفر وإتمام البئر (Well Completion).

> **التعريف الهندسي:** رأس البئر هو نظام الإغلاق والتحكم المركّب على رأس البئر المحفورة، ويتكوّن من مجموعة من الأجزاء الميكانيكية المترابطة التي تُحكم إغلاق الفضاء الحلقي (Annulus) وتتحكم في ضغط البئر وتسمح بمرور السوائل المنتجة.

---

## الوظائف الأساسية لرأس البئر

| الوظيفة | الشرح |
|---------|-------|
| **الإغلاق الهيكلي** | تثبيت جميع أعمدة الغلاف (Casing Strings) وتحمّل أوزانها |
| **التحكم في الضغط** | الحفاظ على ضغط البئر ضمن الحدود الآمنة |
| **عزل التكوينات** | منع الاختلاط بين السوائل في التكوينات المختلفة |
| **نقطة الاتصال** | ربط معدات السطح بالمعدات تحت السطحية |
| **الوصول للصيانة** | توفير منفذ آمن لعمليات التدخل في البئر (Well Intervention) |

---

## مكونات رأس البئر الرئيسية

### 1. رأس الغلاف (Casing Head)
أول مكوّن يُركَّب على البئر، ويُثبَّت على الغلاف الموجّه (Conductor Casing). يتميّز بـ:
- **الفلنجة السفلية (Bottom Flange):** تربطه بالغلاف الموجّه
- **الفلنجة العلوية (Top Flange):** تربطه بالمكوّن التالي
- **فتحات الوصول الجانبية (Side Outlets):** تُستخدم لمراقبة ضغط الفضاء الحلقي

### 2. بكرة الغلاف (Casing Spool)
تُركَّب فوق رأس الغلاف وتستوعب الأغلفة الإضافية. تحتوي على:
- **مقعد التعليق (Hanger Seat):** لتعليق عمود الغلاف التالي
- **مانعات التسرب (Seals):** لعزل الفضاء الحلقي
- **فتحات الاختبار (Test Ports):** للتحقق من سلامة مانعات التسرب

### 3. رأس أنبوب الإنتاج (Tubing Head)
يُركَّب فوق آخر بكرة غلاف، ويستوعب عمود أنبوب الإنتاج (Production Tubing). يشمل:
- **معلّق أنبوب الإنتاج (Tubing Hanger):** يحمل وزن عمود الأنبوب
- **مانعات التسرب الأولية والثانوية:** لعزل الفضاء الحلقي
- **فتحات الوصول:** للتدخل في البئر

### 4. شجرة عيد الميلاد (Christmas Tree)
تُركَّب فوق رأس أنبوب الإنتاج وتتحكم في تدفق السوائل المنتجة. تشمل:
- **صمام الجذع الرئيسي (Master Gate Valve)**
- **صمام الجناح (Wing Valve)**
- **صمام الخنق (Choke Valve)**
- **صمام الكيل (Swab Valve)**

---

## أنواع رؤوس الآبار

### حسب بيئة التشغيل:
- **البرية (Onshore Wellhead):** مُركَّبة على السطح، سهلة الوصول للصيانة
- **البحرية (Offshore Wellhead):** مُركَّبة تحت الماء أو على منصات، تتطلب معدات متخصصة

### حسب مستوى الضغط:
| التصنيف | نطاق الضغط |
|---------|------------|
| **ضغط منخفض (Low Pressure)** | حتى 2,000 psi |
| **ضغط متوسط (Medium Pressure)** | 2,000 - 5,000 psi |
| **ضغط عالٍ (High Pressure)** | 5,000 - 15,000 psi |
| **ضغط عالٍ جداً (Ultra High Pressure)** | أكثر من 15,000 psi |

---

## أهمية رأس البئر في الصناعة

رأس البئر ليس مجرد معدة ميكانيكية، بل هو **نظام أمان حيوي** يحمي:
1. **العمال والبيئة** من انفجارات البئر (Blowouts)
2. **التكوينات الجيولوجية** من التلوث والاختلاط
3. **الاستثمار الاقتصادي** للبئر عبر التحكم الدقيق في الإنتاج
4. **البنية التحتية** للمنشأة من الضغوط غير المتحكم بها

---

## الخلاصة

يُمثّل رأس البئر حجر الأساس في أي عملية نفطية أو غازية. إن فهم تركيبه ووظائفه هو المنطلق الأول لكل مهندس أو فني يعمل في مجال صيانة الآبار، سواء كان ذلك في البيئات البرية أو البحرية.`
      },
      {
        order: 2,
        titleAr: "مكونات رأس البئر التفصيلية",
        titleEn: "Detailed Wellhead Components",
        content: `# مكونات رأس البئر التفصيلية

## مقدمة

يتكوّن رأس البئر من منظومة متكاملة من المكونات الميكانيكية الدقيقة، كل منها يؤدي وظيفة محددة ضمن المنظومة الكلية. في هذا الدرس، سنتناول كل مكوّن بالتفصيل مع شرح آلية عمله ومتطلبات صيانته.

---

## أولاً: أعمدة الغلاف (Casing Strings)

### الغلاف الموجّه (Conductor Casing)
- **القطر:** عادةً 20 إلى 30 بوصة
- **العمق:** من 40 إلى 200 قدم
- **الوظيفة:** حماية البئر من انهيار التربة السطحية وتوجيه طين الحفر

### الغلاف السطحي (Surface Casing)
- **القطر:** عادةً 13⅜ إلى 20 بوصة
- **العمق:** من 500 إلى 3,000 قدم
- **الوظيفة:** حماية طبقات المياه الجوفية وتوفير نقطة ربط لمانع الانفجار (BOP)

### الغلاف المتوسط (Intermediate Casing)
- **القطر:** عادةً 9⅝ إلى 13⅜ بوصة
- **الوظيفة:** عزل التكوينات غير المستقرة وضبط الضغوط الشاذة

### الغلاف الإنتاجي (Production Casing)
- **القطر:** عادةً 5½ إلى 9⅝ بوصة
- **الوظيفة:** عزل منطقة الإنتاج وتوفير قناة للسوائل المنتجة

---

## ثانياً: أنظمة التعليق (Hanger Systems)

### معلّق الغلاف (Casing Hanger)
يحمل وزن عمود الغلاف ويُحكم إغلاق الفضاء الحلقي. أنواعه:

| النوع | الوصف | الاستخدام |
|------|-------|-----------|
| **معلّق الإسفين (Slip Hanger)** | يستخدم إسفيناً للإمساك بالغلاف | الأكثر شيوعاً |
| **معلّق الخيط (Threaded Hanger)** | يُلحم أو يُربط بالخيط | الضغوط العالية |
| **معلّق الضغط (Mandrel Hanger)** | يُثبَّت بالضغط الهيدروليكي | البيئات البحرية |

### معلّق أنبوب الإنتاج (Tubing Hanger)
يحمل وزن عمود أنبوب الإنتاج ويُوفّر مسارات للسوائل والكابلات. يشمل:
- **فتحات مرور السوائل (Flow Bores)**
- **فتحات الكابلات والخطوط الهيدروليكية**
- **مانعات التسرب الأولية والثانوية**

---

## ثالثاً: أنظمة مانعات التسرب (Sealing Systems)

### أنواع مانعات التسرب:

**1. مانعات التسرب المعدنية (Metal-to-Metal Seals)**
- أعلى موثوقية في الضغوط العالية
- لا تتأثر بالحرارة أو المواد الكيميائية
- تُستخدم في البيئات الحرجة

**2. مانعات التسرب المطاطية (Elastomeric Seals)**
- مرنة وسهلة التركيب
- مناسبة للضغوط المتوسطة
- تتطلب استبدالاً دورياً

**3. مانعات التسرب المركّبة (Composite Seals)**
- تجمع بين مزايا النوعين السابقين
- تُستخدم في التطبيقات الخاصة

---

## رابعاً: صمامات رأس البئر (Wellhead Valves)

### صمام الجذع الرئيسي (Master Gate Valve - MGV)
- **الموضع:** أسفل شجرة عيد الميلاد
- **الوظيفة:** الإغلاق الكامل للبئر في حالات الطوارئ
- **التصنيف:** يجب أن يتحمل الضغط الكامل للبئر

### صمام الجناح (Wing Valve)
- **الموضع:** على جانب شجرة عيد الميلاد
- **الوظيفة:** التحكم في تدفق السوائل إلى خط الإنتاج
- **الأنواع:** يدوي أو هيدروليكي أو كهربائي

### صمام الخنق (Choke Valve)
- **الوظيفة:** التحكم الدقيق في معدل الإنتاج وضغط الرأس
- **الأنواع:**
  - **خنق ثابت (Fixed Choke):** فتحة محددة لا تتغير
  - **خنق قابل للضبط (Adjustable Choke):** يمكن تغيير الفتحة أثناء التشغيل

### صمام الكيل (Swab Valve)
- **الموضع:** أعلى شجرة عيد الميلاد
- **الوظيفة:** توفير وصول رأسي للبئر لعمليات التدخل

---

## خامساً: معدات المراقبة والقياس

### مقاييس الضغط (Pressure Gauges)
- **مقياس ضغط الرأس (Wellhead Pressure Gauge)**
- **مقياس ضغط الفضاء الحلقي (Annulus Pressure Gauge)**
- **مقياس الضغط التفاضلي (Differential Pressure Gauge)**

### أجهزة الاستشعار الحديثة
- **أجهزة استشعار الضغط الإلكترونية (Electronic Pressure Transmitters)**
- **أجهزة استشعار درجة الحرارة (Temperature Sensors)**
- **أجهزة كشف التسرب (Leak Detection Systems)**

---

## الخلاصة

إن الفهم العميق لكل مكوّن من مكونات رأس البئر، ووظيفته، وطريقة تفاعله مع المكونات الأخرى، هو الأساس الذي يبني عليه الفني المحترف قدرته على التشخيص الدقيق وتنفيذ الصيانة الفعّالة.`
      },
      {
        order: 3,
        titleAr: "معايير ومواصفات رأس البئر",
        titleEn: "Wellhead Standards and Specifications",
        content: `# معايير ومواصفات رأس البئر

## أهمية المعايير الدولية

تُعدّ المعايير الدولية الركيزة الأساسية لضمان **السلامة والموثوقية والتوافق** في معدات رأس البئر. بدون هذه المعايير، سيكون من المستحيل ضمان تشغيل آمن للآبار النفطية والغازية حول العالم.

---

## المعايير الدولية الرئيسية

### 1. معيار API 6A (American Petroleum Institute)
**المعيار الأكثر استخداماً في الصناعة**

يُحدّد هذا المعيار متطلبات:
- **مواد التصنيع:** أنواع الفولاذ والسبائك المسموح بها
- **مستويات الضغط (Pressure Ratings):** من 2,000 إلى 20,000 psi
- **درجات الحرارة (Temperature Classes):** من -75°F إلى +350°F
- **مستويات المواد (Material Classes):** AA, BB, CC, DD, EE, FF, HH
- **مستويات الأداء (Performance Requirements):** PR1, PR2

| مستوى الضغط | الرمز | القيمة |
|------------|-------|--------|
| 2,000 psi | 2K | 138 bar |
| 3,000 psi | 3K | 207 bar |
| 5,000 psi | 5K | 345 bar |
| 10,000 psi | 10K | 690 bar |
| 15,000 psi | 15K | 1,034 bar |
| 20,000 psi | 20K | 1,379 bar |

### 2. معيار ISO 10423
النسخة الدولية المكافئة لـ API 6A، تُستخدم في المشاريع الدولية التي تشترط معايير ISO.

### 3. معيار NACE MR0175 / ISO 15156
يُحدّد متطلبات مقاومة التكسر بالإجهاد الكبريتي (SSC - Sulfide Stress Cracking) في البيئات الحاوية على كبريتيد الهيدروجين (H₂S).

### 4. معيار API 17D
خاص بمعدات رأس البئر تحت الماء (Subsea Wellhead Equipment) في البيئات البحرية.

---

## تصنيفات درجات الحرارة

| الرمز | نطاق درجة الحرارة |
|------|-----------------|
| **K** | -75°F إلى +180°F (-60°C إلى +82°C) |
| **L** | -50°F إلى +180°F (-46°C إلى +82°C) |
| **P** | -20°F إلى +180°F (-29°C إلى +82°C) |
| **R** | +0°F إلى +180°F (-18°C إلى +82°C) |
| **S** | +0°F إلى +140°F (-18°C إلى +60°C) |
| **T** | +0°F إلى +100°F (-18°C إلى +38°C) |
| **U** | +0°F إلى +250°F (-18°C إلى +121°C) |
| **V** | +0°F إلى +350°F (-18°C إلى +177°C) |

---

## تصنيفات المواد (Material Classes)

| الفئة | المادة | الاستخدام |
|------|-------|-----------|
| **AA** | فولاذ كربوني | الخدمات العادية |
| **BB** | فولاذ كربوني منخفض السبائك | الخدمات المعتدلة |
| **CC** | فولاذ عالي السبائك | الخدمات الحامضية |
| **DD** | فولاذ كربوني مع متطلبات NACE | خدمات H₂S |
| **EE** | فولاذ منخفض السبائك مع متطلبات NACE | خدمات H₂S المعتدلة |
| **FF** | فولاذ عالي السبائك مع متطلبات NACE | خدمات H₂S الشديدة |
| **HH** | سبائك مقاومة للتآكل | الخدمات شديدة التآكل |

---

## متطلبات الاختبار والشهادات

### اختبارات المصنع (Factory Acceptance Tests - FAT)
1. **اختبار الضغط الهيدروليكي (Hydrostatic Pressure Test):** 1.5× ضغط التصميم
2. **اختبار الغاز (Gas Test):** للتحقق من إحكام مانعات التسرب
3. **اختبار الوظائف (Functional Test):** للتحقق من عمل الصمامات والمكونات المتحركة
4. **اختبار الفحص غير المتلف (NDT - Non-Destructive Testing)**

### الوثائق المطلوبة
- **شهادة المادة (Material Certificate - MTR)**
- **تقرير اختبار المصنع (FAT Report)**
- **شهادة المطابقة (Certificate of Conformance)**
- **رسومات التصنيع (Manufacturing Drawings)**

---

## الخلاصة

إن الالتزام بالمعايير الدولية ليس مجرد متطلب قانوني، بل هو ضمان حقيقي لسلامة العمال وحماية البيئة والحفاظ على الاستثمار. يجب على كل فني يعمل في صيانة رأس البئر أن يكون على دراية كاملة بهذه المعايير وتطبيقاتها العملية.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو التعريف الصحيح لرأس البئر (Wellhead)؟",
        questionTextEn: "What is the correct definition of a Wellhead?",
        correctOptionId: "b",
        explanationAr: "رأس البئر هو نظام الإغلاق والتحكم المركّب على رأس البئر المحفورة، ويربط الجزء تحت السطحي بالجزء السطحي.",
        explanationEn: "A wellhead is the sealing and control system installed at the top of a drilled well, connecting the subsurface to the surface.",
        options: [
          { id: "a", textAr: "جهاز لقياس ضغط البئر فقط", textEn: "A device only for measuring well pressure" },
          { id: "b", textAr: "نظام الإغلاق والتحكم المركّب على رأس البئر الذي يربط الجزء تحت السطحي بالجزء السطحي", textEn: "The sealing and control system installed at the top of the well connecting subsurface to surface" },
          { id: "c", textAr: "مضخة لرفع النفط من البئر إلى السطح", textEn: "A pump to lift oil from the well to the surface" },
          { id: "d", textAr: "خزان لتجميع السوائل المنتجة", textEn: "A tank to collect produced fluids" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هو أول مكوّن يُركَّب على البئر من مكونات رأس البئر؟",
        questionTextEn: "What is the first component installed on the well among wellhead components?",
        correctOptionId: "a",
        explanationAr: "رأس الغلاف (Casing Head) هو أول مكوّن يُركَّب على البئر، ويُثبَّت على الغلاف الموجّه.",
        explanationEn: "The Casing Head is the first component installed on the well, fixed to the conductor casing.",
        options: [
          { id: "a", textAr: "رأس الغلاف (Casing Head)", textEn: "Casing Head" },
          { id: "b", textAr: "شجرة عيد الميلاد (Christmas Tree)", textEn: "Christmas Tree" },
          { id: "c", textAr: "رأس أنبوب الإنتاج (Tubing Head)", textEn: "Tubing Head" },
          { id: "d", textAr: "صمام الجذع الرئيسي (Master Gate Valve)", textEn: "Master Gate Valve" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو معيار API الذي يُحدّد متطلبات معدات رأس البئر السطحية؟",
        questionTextEn: "Which API standard specifies requirements for surface wellhead equipment?",
        correctOptionId: "c",
        explanationAr: "معيار API 6A هو المعيار الأساسي الذي يُحدّد متطلبات معدات رأس البئر السطحية من حيث المواد والضغوط ودرجات الحرارة.",
        explanationEn: "API 6A is the primary standard specifying requirements for surface wellhead equipment regarding materials, pressures, and temperatures.",
        options: [
          { id: "a", textAr: "API 17D", textEn: "API 17D" },
          { id: "b", textAr: "API 14C", textEn: "API 14C" },
          { id: "c", textAr: "API 6A", textEn: "API 6A" },
          { id: "d", textAr: "API 11D1", textEn: "API 11D1" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هو الحد الأقصى لضغط التصميم وفق معيار API 6A؟",
        questionTextEn: "What is the maximum design pressure rating according to API 6A?",
        correctOptionId: "d",
        explanationAr: "يُحدّد معيار API 6A مستويات ضغط تصل إلى 20,000 psi كحد أقصى لمعدات رأس البئر.",
        explanationEn: "API 6A specifies pressure ratings up to 20,000 psi as the maximum for wellhead equipment.",
        options: [
          { id: "a", textAr: "5,000 psi", textEn: "5,000 psi" },
          { id: "b", textAr: "10,000 psi", textEn: "10,000 psi" },
          { id: "c", textAr: "15,000 psi", textEn: "15,000 psi" },
          { id: "d", textAr: "20,000 psi", textEn: "20,000 psi" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما وظيفة صمام الخنق (Choke Valve) في شجرة عيد الميلاد؟",
        questionTextEn: "What is the function of the Choke Valve in the Christmas Tree?",
        correctOptionId: "b",
        explanationAr: "صمام الخنق يُستخدم للتحكم الدقيق في معدل الإنتاج وضغط الرأس عن طريق تغيير حجم الفتحة.",
        explanationEn: "The Choke Valve is used for precise control of production rate and wellhead pressure by changing the orifice size.",
        options: [
          { id: "a", textAr: "الإغلاق الكامل للبئر في حالات الطوارئ", textEn: "Complete well shutdown in emergencies" },
          { id: "b", textAr: "التحكم الدقيق في معدل الإنتاج وضغط الرأس", textEn: "Precise control of production rate and wellhead pressure" },
          { id: "c", textAr: "توفير وصول رأسي للبئر لعمليات التدخل", textEn: "Providing vertical access to the well for intervention operations" },
          { id: "d", textAr: "قياس درجة حرارة السوائل المنتجة", textEn: "Measuring the temperature of produced fluids" }
        ]
      },
      {
        order: 6,
        questionTextAr: "ما هو الغرض من معيار NACE MR0175 / ISO 15156؟",
        questionTextEn: "What is the purpose of NACE MR0175 / ISO 15156?",
        correctOptionId: "a",
        explanationAr: "يُحدّد هذا المعيار متطلبات مقاومة التكسر بالإجهاد الكبريتي (SSC) في البيئات الحاوية على كبريتيد الهيدروجين H₂S.",
        explanationEn: "This standard specifies requirements for resistance to sulfide stress cracking (SSC) in environments containing hydrogen sulfide H₂S.",
        options: [
          { id: "a", textAr: "تحديد متطلبات مقاومة التكسر بالإجهاد الكبريتي في بيئات H₂S", textEn: "Specifying requirements for sulfide stress cracking resistance in H₂S environments" },
          { id: "b", textAr: "تحديد متطلبات الاختبار الهيدروليكي لمعدات رأس البئر", textEn: "Specifying hydrostatic test requirements for wellhead equipment" },
          { id: "c", textAr: "تصنيف معدات رأس البئر البحرية تحت الماء", textEn: "Classifying subsea wellhead equipment" },
          { id: "d", textAr: "تحديد إجراءات تركيب رأس البئر", textEn: "Specifying wellhead installation procedures" }
        ]
      }
    ]
  },
  {
    order: 2,
    titleAr: "أنواع رؤوس الآبار البرية والبحرية",
    titleEn: "Types of Onshore and Offshore Wellheads",
    descriptionAr: "دراسة مقارنة شاملة بين رؤوس الآبار البرية والبحرية، مع التركيز على الفروقات التصميمية ومتطلبات التشغيل الخاصة بكل بيئة.",
    descriptionEn: "A comprehensive comparative study of onshore and offshore wellheads, focusing on design differences and operational requirements for each environment.",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "رؤوس الآبار البرية (Onshore Wellheads)",
        titleEn: "Onshore Wellheads",
        content: `# رؤوس الآبار البرية (Onshore Wellheads)

## مقدمة

تُعدّ رؤوس الآبار البرية الأكثر انتشاراً في صناعة النفط والغاز، وتتميّز بسهولة الوصول إليها وتنوع تصاميمها لتناسب مختلف البيئات الجيولوجية والمناخية.

---

## خصائص رؤوس الآبار البرية

### المزايا التشغيلية:
- **سهولة الوصول:** يمكن الوصول إليها مباشرة بالمركبات والمعدات الثقيلة
- **سهولة الصيانة:** إمكانية إجراء الصيانة الدورية والطارئة بسرعة وكفاءة
- **تكلفة أقل:** تكاليف التركيب والصيانة أقل مقارنةً بالبيئات البحرية
- **مراقبة مستمرة:** إمكانية المراقبة البصرية المستمرة

### التحديات:
- **التغيرات المناخية:** تأثير الحرارة الشديدة والبرودة والرياح
- **التآكل:** التعرض للرطوبة والمواد الكيميائية في التربة
- **الأمان:** الحاجة لإجراءات أمان صارمة في المناطق المأهولة

---

## تصاميم رؤوس الآبار البرية

### 1. التصميم التقليدي (Conventional Design)
الأكثر استخداماً في الآبار ذات الضغط المتوسط:

\`\`\`
شجرة عيد الميلاد (Christmas Tree)
         ↓
رأس أنبوب الإنتاج (Tubing Head)
         ↓
بكرة الغلاف الإنتاجي (Production Casing Spool)
         ↓
بكرة الغلاف المتوسط (Intermediate Casing Spool)
         ↓
رأس الغلاف (Casing Head)
         ↓
الغلاف الموجّه (Conductor Casing)
\`\`\`

### 2. التصميم المضغوط (Compact Design)
يُستخدم في المناطق ذات المساحة المحدودة:
- **ارتفاع أقل:** تقليل الارتفاع الكلي لرأس البئر
- **وزن أخف:** مناسب للمناطق ذات التربة الضعيفة
- **تكامل أكبر:** دمج عدة مكونات في وحدة واحدة

### 3. التصميم الموحّد (Unitized Design)
يدمج رأس الغلاف وبكرات الغلاف وشجرة عيد الميلاد في وحدة متكاملة:
- **سرعة التركيب:** تقليل وقت التركيب بنسبة 30-40%
- **تقليل نقاط التسرب:** عدد أقل من الوصلات الفلنجية
- **موثوقية أعلى:** اختبار المجموعة كوحدة واحدة في المصنع

---

## متطلبات التشغيل في البيئات البرية المختلفة

### البيئات الصحراوية (Desert Environments)
- **درجات حرارة عالية:** استخدام مواد مقاومة للحرارة (فئة V - حتى 350°F)
- **العواصف الرملية:** حماية المكونات الحساسة بأغطية واقية
- **التمدد الحراري:** مراعاة التمدد في تصميم الوصلات

### البيئات الجبلية والباردة (Arctic/Cold Environments)
- **درجات حرارة منخفضة:** استخدام مواد فئة K (-75°F)
- **الجليد والثلج:** تسخين المكونات الحيوية
- **الصقيع:** حماية خطوط الضغط من التجمد

### البيئات الرطبة والمستنقعية (Swamp/Wetland Environments)
- **الحماية من التآكل:** طلاء خاص ومواد مقاومة للتآكل
- **الارتفاع عن الأرض:** رفع رأس البئر لتجنب الغمر بالمياه
- **الأساسات الخاصة:** تعزيز الأساسات في التربة الطينية

---

## أنظمة الحماية والأمان

### السياج الأمني (Security Fencing)
- سياج معدني بارتفاع لا يقل عن 6 أقدام
- بوابة مقفلة مع لافتات تحذيرية
- إضاءة كافية في الليل

### أنظمة الكشف والإنذار
- **كاشفات الغاز (Gas Detectors):** للكشف عن تسرب الغاز
- **كاشفات الحريق (Fire Detectors):** للإنذار المبكر
- **أنظمة الإغلاق التلقائي (ESD Systems):** للإغلاق الفوري عند الطوارئ

---

## الخلاصة

تُمثّل رؤوس الآبار البرية العمود الفقري لصناعة النفط والغاز البرية. إن فهم خصائصها وتحدياتها ومتطلبات تشغيلها في مختلف البيئات هو الأساس لتقديم صيانة فعّالة وآمنة.`
      },
      {
        order: 2,
        titleAr: "رؤوس الآبار البحرية (Offshore Wellheads)",
        titleEn: "Offshore Wellheads",
        content: `# رؤوس الآبار البحرية (Offshore Wellheads)

## مقدمة

تُعدّ رؤوس الآبار البحرية من أكثر التقنيات تعقيداً في صناعة النفط والغاز، إذ تعمل في بيئات قاسية تحت الماء أو على منصات بحرية، مما يتطلب تصاميم متخصصة وإجراءات صيانة خاصة.

---

## أنواع رؤوس الآبار البحرية

### 1. رؤوس الآبار على المنصات (Platform Wellheads)
تُركَّب على منصات بحرية ثابتة أو شبه غاطسة:
- **مشابهة للبرية:** تصميم مشابه لرؤوس الآبار البرية
- **حماية إضافية:** مقاومة للتآكل البحري (Marine Corrosion)
- **سهولة الوصول:** يمكن الوصول إليها من سطح المنصة

### 2. رؤوس الآبار تحت الماء (Subsea Wellheads)
تُركَّب على قاع البحر وتُشغَّل عن بُعد:
- **العمق:** من 100 إلى أكثر من 3,000 متر تحت سطح الماء
- **التشغيل عن بُعد:** باستخدام مركبات التحكم عن بُعد (ROV)
- **التحكم الهيدروليكي:** أنظمة تحكم هيدروليكية وكهربائية معقدة

---

## مكونات رأس البئر تحت الماء (Subsea Wellhead System)

### 1. رأس البئر تحت الماء (Subsea Wellhead Housing)
- **الوظيفة:** تثبيت أعمدة الغلاف وتوفير نقطة ربط لمانع الانفجار
- **التصميم:** أسطواني بقطر 18¾ بوصة (المعيار الأكثر شيوعاً)
- **المادة:** فولاذ عالي القوة مقاوم للتآكل

### 2. رأس البئر الداخلي (High Pressure Wellhead Housing)
- **الوظيفة:** تعليق الأغلفة الداخلية وتوفير مقعد لمانع الانفجار
- **التصنيف:** يتحمل ضغوطاً تصل إلى 15,000 psi

### 3. معلّق الغلاف تحت الماء (Subsea Casing Hanger)
- **الوظيفة:** تعليق عمود الغلاف وإغلاق الفضاء الحلقي
- **التصميم:** يُثبَّت بالضغط الهيدروليكي أو بالدوران

### 4. شجرة عيد الميلاد تحت الماء (Subsea Christmas Tree)
أنواعها:
| النوع | الوصف | الاستخدام |
|------|-------|-----------|
| **الشجرة الرأسية (Vertical Tree)** | تُركَّب فوق رأس البئر مباشرة | الأكثر شيوعاً |
| **الشجرة الأفقية (Horizontal Tree)** | تُركَّب بشكل أفقي | الآبار ذات الضغط العالي |

---

## تحديات البيئة البحرية

### التآكل البحري (Marine Corrosion)
- **الكلوريدات:** تُسرّع التآكل بشكل كبير
- **الكائنات البحرية (Biofouling):** تتراكم على المعدات وتُسبّب مشاكل
- **الحلول:** طلاء الكاثود (Cathodic Protection) والطلاء الواقي

### الضغط الهيدروستاتيكي (Hydrostatic Pressure)
- يزداد بمعدل 0.433 psi لكل قدم عمق
- على عمق 1,000 متر: ~1,450 psi ضغط هيدروستاتيكي إضافي
- يؤثر على تصميم مانعات التسرب والمكونات الهيكلية

### درجات الحرارة المنخفضة
- في أعماق المحيط: درجات حرارة قريبة من 4°C
- تأثير على خصائص المواد ومانعات التسرب
- خطر تكوّن الهيدرات (Hydrates) في خطوط الإنتاج

---

## أنظمة التحكم في رؤوس الآبار تحت الماء

### نظام التحكم المباشر الهيدروليكي (Direct Hydraulic Control)
- **المبدأ:** ضخ سائل هيدروليكي مباشرة لتشغيل الصمامات
- **المزايا:** بسيط وموثوق
- **العيوب:** بطيء في الاستجابة للأعماق الكبيرة

### نظام التحكم الكهربائي-الهيدروليكي (Electro-Hydraulic Control)
- **المبدأ:** إشارات كهربائية تُشغّل صمامات هيدروليكية محلية
- **المزايا:** استجابة سريعة، مراقبة مستمرة
- **الاستخدام:** الأكثر شيوعاً في الآبار العميقة

### نظام التحكم الكهربائي الكامل (All-Electric Control)
- **المبدأ:** محركات كهربائية مباشرة بدون هيدروليك
- **المزايا:** أنظف، أكثر موثوقية، أسهل في الصيانة
- **الاستخدام:** التقنية المستقبلية الواعدة

---

## الخلاصة

رؤوس الآبار البحرية تُمثّل قمة التطور التقني في صناعة النفط والغاز. إن العمل عليها يتطلب تدريباً متخصصاً وفهماً عميقاً للتحديات الفريدة التي تفرضها البيئة البحرية.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو الفرق الرئيسي بين رأس البئر البري والبحري من حيث الصيانة؟",
        questionTextEn: "What is the main difference between onshore and offshore wellheads in terms of maintenance?",
        correctOptionId: "c",
        explanationAr: "رؤوس الآبار البرية يمكن الوصول إليها مباشرة بالمركبات والمعدات، بينما رؤوس الآبار البحرية تحت الماء تتطلب مركبات التحكم عن بُعد (ROV) وتجهيزات متخصصة.",
        explanationEn: "Onshore wellheads can be accessed directly by vehicles and equipment, while subsea offshore wellheads require Remote Operated Vehicles (ROV) and specialized equipment.",
        options: [
          { id: "a", textAr: "رؤوس الآبار البرية أكثر تعقيداً في التصميم", textEn: "Onshore wellheads are more complex in design" },
          { id: "b", textAr: "رؤوس الآبار البحرية لا تحتاج إلى صيانة دورية", textEn: "Offshore wellheads do not require periodic maintenance" },
          { id: "c", textAr: "رؤوس الآبار البحرية تحت الماء تتطلب ROV وتجهيزات متخصصة للوصول إليها", textEn: "Subsea offshore wellheads require ROV and specialized equipment for access" },
          { id: "d", textAr: "رؤوس الآبار البرية تعمل تحت ضغوط أعلى", textEn: "Onshore wellheads operate at higher pressures" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هو القطر القياسي الأكثر شيوعاً لرأس البئر تحت الماء (Subsea Wellhead Housing)؟",
        questionTextEn: "What is the most common standard diameter for a Subsea Wellhead Housing?",
        correctOptionId: "b",
        explanationAr: "القطر القياسي الأكثر شيوعاً لرأس البئر تحت الماء هو 18¾ بوصة وفق معيار API 17D.",
        explanationEn: "The most common standard diameter for a Subsea Wellhead Housing is 18¾ inches per API 17D.",
        options: [
          { id: "a", textAr: "13⅜ بوصة", textEn: "13⅜ inches" },
          { id: "b", textAr: "18¾ بوصة", textEn: "18¾ inches" },
          { id: "c", textAr: "20 بوصة", textEn: "20 inches" },
          { id: "d", textAr: "30 بوصة", textEn: "30 inches" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو نظام التحكم الأكثر شيوعاً في رؤوس الآبار تحت الماء العميقة؟",
        questionTextEn: "What is the most common control system for deep subsea wellheads?",
        correctOptionId: "d",
        explanationAr: "نظام التحكم الكهربائي-الهيدروليكي (Electro-Hydraulic Control) هو الأكثر شيوعاً في الآبار العميقة لأنه يوفر استجابة سريعة ومراقبة مستمرة.",
        explanationEn: "The Electro-Hydraulic Control system is the most common for deep wells as it provides fast response and continuous monitoring.",
        options: [
          { id: "a", textAr: "نظام التحكم الميكانيكي المباشر", textEn: "Direct mechanical control system" },
          { id: "b", textAr: "نظام التحكم الهوائي (Pneumatic Control)", textEn: "Pneumatic control system" },
          { id: "c", textAr: "نظام التحكم الكهربائي الكامل", textEn: "All-electric control system" },
          { id: "d", textAr: "نظام التحكم الكهربائي-الهيدروليكي (Electro-Hydraulic Control)", textEn: "Electro-Hydraulic control system" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هو التحدي الرئيسي الذي يُسببه الضغط الهيدروستاتيكي في رؤوس الآبار البحرية العميقة؟",
        questionTextEn: "What is the main challenge caused by hydrostatic pressure in deep offshore wellheads?",
        correctOptionId: "a",
        explanationAr: "الضغط الهيدروستاتيكي يزداد بمعدل 0.433 psi لكل قدم عمق، مما يؤثر على تصميم مانعات التسرب والمكونات الهيكلية ويتطلب تصاميم خاصة.",
        explanationEn: "Hydrostatic pressure increases at 0.433 psi per foot of depth, affecting seal and structural component design and requiring special designs.",
        options: [
          { id: "a", textAr: "يؤثر على تصميم مانعات التسرب والمكونات الهيكلية ويتطلب تصاميم خاصة", textEn: "Affects seal and structural component design, requiring special designs" },
          { id: "b", textAr: "يُسبّب ارتفاعاً في درجة حرارة السوائل المنتجة", textEn: "Causes an increase in produced fluid temperature" },
          { id: "c", textAr: "يمنع تشغيل الصمامات الهيدروليكية", textEn: "Prevents operation of hydraulic valves" },
          { id: "d", textAr: "يُسبّب تآكلاً سريعاً في مواد الغلاف", textEn: "Causes rapid corrosion in casing materials" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو الفرق بين شجرة عيد الميلاد الرأسية والأفقية تحت الماء؟",
        questionTextEn: "What is the difference between a vertical and horizontal subsea Christmas Tree?",
        correctOptionId: "b",
        explanationAr: "الشجرة الرأسية تُركَّب فوق رأس البئر مباشرة وهي الأكثر شيوعاً، بينما الشجرة الأفقية تُركَّب بشكل أفقي وتُستخدم في الآبار ذات الضغط العالي جداً.",
        explanationEn: "The vertical tree is installed directly above the wellhead and is most common, while the horizontal tree is installed horizontally and used for very high-pressure wells.",
        options: [
          { id: "a", textAr: "الشجرة الأفقية أرخص تكلفةً من الرأسية", textEn: "The horizontal tree is cheaper than the vertical tree" },
          { id: "b", textAr: "الشجرة الرأسية تُركَّب فوق رأس البئر مباشرة وهي الأكثر شيوعاً، والأفقية تُستخدم للضغوط العالية جداً", textEn: "The vertical tree is installed directly above the wellhead and is most common; the horizontal is used for very high pressures" },
          { id: "c", textAr: "الشجرة الأفقية تُستخدم في المياه الضحلة فقط", textEn: "The horizontal tree is used only in shallow water" },
          { id: "d", textAr: "لا يوجد فرق وظيفي بينهما", textEn: "There is no functional difference between them" }
        ]
      }
    ]
  },
  {
    order: 3,
    titleAr: "إجراءات تركيب رأس البئر",
    titleEn: "Wellhead Installation Procedures",
    descriptionAr: "الإجراءات التفصيلية لتركيب مكونات رأس البئر بشكل صحيح وآمن، مع التركيز على التسلسل الصحيح وأفضل الممارسات.",
    descriptionEn: "Detailed procedures for correctly and safely installing wellhead components, focusing on the correct sequence and best practices.",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "التحضير قبل التركيب",
        titleEn: "Pre-Installation Preparation",
        content: `# التحضير قبل التركيب

## أهمية التحضير الجيد

> "الفشل في التخطيط هو التخطيط للفشل" - مبدأ أساسي في هندسة الصيانة

التحضير الجيد قبل تركيب رأس البئر يُقلّل من:
- **وقت التوقف (Downtime)** بنسبة تصل إلى 50%
- **احتمالية الأخطاء** بنسبة تصل إلى 70%
- **تكاليف إعادة العمل (Rework)** بشكل كبير
- **مخاطر السلامة** على الفريق والبيئة

---

## مراجعة الوثائق الفنية

### الوثائق الإلزامية قبل البدء:

**1. رسومات التجميع (Assembly Drawings)**
- التحقق من مطابقة الأرقام التسلسلية مع أوامر الشراء
- مراجعة أبعاد الفلنجات ومواصفات البراغي
- التحقق من مواصفات مانعات التسرب

**2. إجراءات التركيب (Installation Procedures)**
- قراءة الإجراء كاملاً قبل البدء
- تحديد نقاط التوقف للفحص (Hold Points)
- تحديد نقاط الشاهد (Witness Points)

**3. قوائم التحقق (Checklists)**
- قائمة تحقق ما قبل التركيب
- قائمة تحقق أثناء التركيب
- قائمة تحقق ما بعد التركيب

---

## فحص المعدات والمواد

### فحص رأس الغلاف (Casing Head Inspection):
| العنصر | المعيار | الإجراء عند عدم المطابقة |
|-------|---------|----------------------|
| الفلنجات | خالية من الشقوق والتشوهات | إعادة للمورد |
| الخيوط (Threads) | سليمة وغير تالفة | إصلاح أو استبدال |
| مقاعد مانعات التسرب | نظيفة وخالية من الخدوش | تنظيف أو استبدال |
| الأرقام التسلسلية | مطابقة للوثائق | التحقق مع المورد |

### فحص مانعات التسرب (Seal Inspection):
- **الفحص البصري:** خالية من التشقق والتشوه
- **فحص الأبعاد:** مطابقة للمواصفات
- **التخزين:** التحقق من صلاحية التخزين (Shelf Life)
- **التوافق:** التأكد من توافق المادة مع السوائل المنتجة

### فحص البراغي والصواميل (Bolts & Nuts Inspection):
- **المادة:** مطابقة للمواصفات (عادةً ASTM A193 B7)
- **الطلاء:** طلاء واقٍ مناسب للبيئة
- **الأبعاد:** الطول والقطر مطابقان للمواصفات
- **الخيوط:** سليمة وخالية من التلف

---

## تجهيز موقع العمل

### متطلبات الموقع:
1. **منطقة عمل نظيفة:** إزالة جميع المواد الغريبة
2. **إضاءة كافية:** لا تقل عن 500 لوكس في منطقة العمل
3. **تهوية جيدة:** خاصةً في الأماكن المغلقة
4. **معدات الرفع:** رافعة بسعة مناسبة وشهادة صلاحية سارية

### معدات السلامة الشخصية (PPE) المطلوبة:
- خوذة الرأس (Hard Hat)
- نظارات السلامة (Safety Glasses)
- قفازات مقاومة للمواد الكيميائية
- حذاء السلامة (Safety Boots)
- ملابس مقاومة للنار (FR Clothing) - إلزامية في مناطق الهيدروكربونات

---

## إجراءات العزل والقفل (Isolation & Lock-Out/Tag-Out)

### خطوات LOTO (Lock-Out/Tag-Out):
1. **تحديد مصادر الطاقة:** الضغط، الكهرباء، الهيدروليك
2. **إخطار الفريق:** إعلام جميع المعنيين بعملية العزل
3. **إغلاق الصمامات:** إغلاق جميع صمامات العزل
4. **تفريغ الضغط:** التأكد من تفريغ الضغط المحبوس
5. **تركيب الأقفال:** قفل كل صمام بقفل شخصي
6. **تعليق البطاقات:** بطاقة تحذير على كل نقطة عزل
7. **التحقق من الصفر:** قياس الضغط للتأكد من انعدامه

---

## الخلاصة

التحضير الجيد ليس ترفاً بل ضرورة. كل دقيقة تُقضى في التحضير الجيد تُوفّر ساعات من إعادة العمل وتُحقن مخاطر السلامة. الفني المحترف يعرف أن النجاح يُبنى قبل بدء العمل الفعلي.`
      },
      {
        order: 2,
        titleAr: "تسلسل تركيب مكونات رأس البئر",
        titleEn: "Wellhead Component Installation Sequence",
        content: `# تسلسل تركيب مكونات رأس البئر

## المبدأ الأساسي

تركيب رأس البئر يتبع تسلسلاً هرمياً صارماً من الأسفل إلى الأعلى، حيث يُشكّل كل مكوّن الأساس للمكوّن التالي. أي خطأ في التسلسل أو في تركيب أي مكوّن سيؤثر على جميع المكونات التالية.

---

## المرحلة الأولى: تركيب رأس الغلاف (Casing Head Installation)

### الخطوات التفصيلية:

**الخطوة 1: تحضير الغلاف الموجّه**
\`\`\`
1. قطع الغلاف الموجّه بالارتفاع المحدد في الرسومات
2. تنظيف الطرف العلوي من الغلاف (تنظيف الخيوط أو تسوية الحافة)
3. فحص الاستقامة (Plumb Check): انحراف لا يزيد عن 1° عن الرأسي
\`\`\`

**الخطوة 2: تركيب رأس الغلاف**
\`\`\`
1. تطبيق مانع التسرب المناسب على الخيوط أو الوجه
2. إنزال رأس الغلاف على الغلاف الموجّه
3. ربط رأس الغلاف بعزم الدوران المحدد (Torque Value)
4. التحقق من الاستقامة بعد الربط
\`\`\`

**الخطوة 3: اختبار مانعات التسرب**
\`\`\`
1. ربط خط الضغط بفتحة الاختبار
2. رفع الضغط تدريجياً إلى قيمة الاختبار (عادةً 1.5× ضغط التصميم)
3. الانتظار 15 دقيقة مع مراقبة الضغط
4. قراءة مقبولة: لا يوجد انخفاض في الضغط
\`\`\`

---

## المرحلة الثانية: تركيب بكرات الغلاف (Casing Spools)

### تسلسل تركيب بكرة الغلاف:

| الخطوة | الإجراء | المعيار |
|-------|---------|---------|
| 1 | تنظيف وجه الفلنجة السفلية | خالٍ من الشوائب والخدوش |
| 2 | فحص حلقة الإغلاق (Ring Gasket) | مطابقة للمواصفات، غير مستخدمة |
| 3 | تثبيت حلقة الإغلاق في مجراها | مستوية وغير مائلة |
| 4 | إنزال البكرة على رأس الغلاف | محاذاة فتحات البراغي |
| 5 | تركيب البراغي والصواميل | تطبيق مانع التسرب على الخيوط |
| 6 | شد البراغي بالتسلسل الصحيح | نمط النجمة (Star Pattern) |
| 7 | شد نهائي بعزم الدوران المحدد | وفق جدول عزم الدوران |
| 8 | اختبار الضغط | وفق إجراء الاختبار |

### نمط شد البراغي (Bolt Tightening Pattern):
لضمان توزيع متساوٍ للضغط على حلقة الإغلاق:
\`\`\`
للفلنجة ذات 8 براغي:
المرحلة 1 (30% من العزم): 1-5-3-7-2-6-4-8
المرحلة 2 (70% من العزم): 1-5-3-7-2-6-4-8
المرحلة 3 (100% من العزم): 1-5-3-7-2-6-4-8
\`\`\`

---

## المرحلة الثالثة: تركيب رأس أنبوب الإنتاج (Tubing Head)

### الاعتبارات الخاصة:
- **التوجيه (Orientation):** التأكد من محاذاة فتحات الوصول مع الاتجاه المطلوب
- **معلّق أنبوب الإنتاج:** التأكد من جلوسه الصحيح في المقعد
- **مانعات التسرب:** فحص مانعات التسرب الأولية والثانوية

---

## المرحلة الرابعة: تركيب شجرة عيد الميلاد (Christmas Tree)

### الخطوات الرئيسية:
1. **فحص الصمامات:** التأكد من أن جميع الصمامات في وضع الإغلاق
2. **تركيب حلقة الإغلاق:** بين رأس أنبوب الإنتاج والشجرة
3. **رفع الشجرة:** باستخدام معدات الرفع المعتمدة
4. **الإنزال والمحاذاة:** محاذاة دقيقة قبل الإنزال النهائي
5. **شد البراغي:** بنمط النجمة وعزم الدوران المحدد
6. **الاختبار الشامل:** اختبار ضغط كامل للمجموعة

---

## اختبارات ما بعد التركيب

### اختبار الضغط الهيدروليكي (Hydrostatic Pressure Test):
- **الهدف:** التحقق من سلامة جميع مانعات التسرب والوصلات
- **الضغط:** 1.5× ضغط التصميم أو وفق المواصفات
- **المدة:** 15 دقيقة كحد أدنى
- **المعيار:** لا يوجد انخفاض في الضغط

### اختبار الغاز (Gas Test):
- **الهدف:** التحقق من إحكام مانعات التسرب عند ضغوط منخفضة
- **الغاز المستخدم:** نيتروجين أو هيليوم
- **الضغط:** عادةً 200-300 psi
- **الكشف:** محلول الصابون أو كاشف الغاز الإلكتروني

---

## الخلاصة

تركيب رأس البئر هو عملية دقيقة تتطلب الالتزام الصارم بالتسلسل الصحيح وإجراءات السلامة. أي اختصار أو تجاوز للإجراءات قد يُعرّض حياة العمال والبيئة للخطر.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو التسلسل الصحيح لتركيب مكونات رأس البئر؟",
        questionTextEn: "What is the correct installation sequence for wellhead components?",
        correctOptionId: "a",
        explanationAr: "التسلسل الصحيح يبدأ من الأسفل: رأس الغلاف، ثم بكرات الغلاف، ثم رأس أنبوب الإنتاج، وأخيراً شجرة عيد الميلاد.",
        explanationEn: "The correct sequence starts from the bottom: Casing Head, then Casing Spools, then Tubing Head, and finally Christmas Tree.",
        options: [
          { id: "a", textAr: "رأس الغلاف ← بكرات الغلاف ← رأس أنبوب الإنتاج ← شجرة عيد الميلاد", textEn: "Casing Head → Casing Spools → Tubing Head → Christmas Tree" },
          { id: "b", textAr: "شجرة عيد الميلاد ← رأس أنبوب الإنتاج ← بكرات الغلاف ← رأس الغلاف", textEn: "Christmas Tree → Tubing Head → Casing Spools → Casing Head" },
          { id: "c", textAr: "رأس أنبوب الإنتاج ← رأس الغلاف ← بكرات الغلاف ← شجرة عيد الميلاد", textEn: "Tubing Head → Casing Head → Casing Spools → Christmas Tree" },
          { id: "d", textAr: "بكرات الغلاف ← رأس الغلاف ← شجرة عيد الميلاد ← رأس أنبوب الإنتاج", textEn: "Casing Spools → Casing Head → Christmas Tree → Tubing Head" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هو النمط الصحيح لشد براغي الفلنجة لضمان توزيع متساوٍ للضغط؟",
        questionTextEn: "What is the correct bolt tightening pattern for flanges to ensure even pressure distribution?",
        correctOptionId: "c",
        explanationAr: "نمط النجمة (Star Pattern) هو الطريقة الصحيحة لشد براغي الفلنجة، حيث يضمن توزيعاً متساوياً للضغط على حلقة الإغلاق.",
        explanationEn: "The Star Pattern is the correct method for tightening flange bolts, ensuring even pressure distribution on the ring gasket.",
        options: [
          { id: "a", textAr: "شد البراغي بالتسلسل الدائري (من اليمين إلى اليسار)", textEn: "Tighten bolts in circular sequence (left to right)" },
          { id: "b", textAr: "شد جميع البراغي بالعزم الكامل دفعةً واحدة", textEn: "Tighten all bolts to full torque at once" },
          { id: "c", textAr: "نمط النجمة (Star Pattern) على مراحل متعددة", textEn: "Star Pattern in multiple stages" },
          { id: "d", textAr: "شد البراغي المتقابلة أولاً ثم المتجاورة", textEn: "Tighten opposite bolts first then adjacent ones" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو الحد الأدنى لمدة اختبار الضغط الهيدروليكي بعد تركيب رأس البئر؟",
        questionTextEn: "What is the minimum duration for hydrostatic pressure testing after wellhead installation?",
        correctOptionId: "b",
        explanationAr: "الحد الأدنى لمدة اختبار الضغط الهيدروليكي هو 15 دقيقة، مع مراقبة الضغط طوال هذه المدة للتأكد من عدم وجود تسرب.",
        explanationEn: "The minimum duration for hydrostatic pressure testing is 15 minutes, with continuous pressure monitoring to ensure no leakage.",
        options: [
          { id: "a", textAr: "5 دقائق", textEn: "5 minutes" },
          { id: "b", textAr: "15 دقيقة", textEn: "15 minutes" },
          { id: "c", textAr: "30 دقيقة", textEn: "30 minutes" },
          { id: "d", textAr: "60 دقيقة", textEn: "60 minutes" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هو الغرض من إجراء LOTO (Lock-Out/Tag-Out) قبل تركيب رأس البئر؟",
        questionTextEn: "What is the purpose of LOTO (Lock-Out/Tag-Out) before wellhead installation?",
        correctOptionId: "d",
        explanationAr: "إجراء LOTO يهدف إلى عزل جميع مصادر الطاقة الخطرة (الضغط، الكهرباء، الهيدروليك) لحماية العمال من الإصابة أثناء العمل.",
        explanationEn: "LOTO procedure aims to isolate all hazardous energy sources (pressure, electricity, hydraulics) to protect workers from injury during work.",
        options: [
          { id: "a", textAr: "تسجيل وقت بدء العمل وانتهائه", textEn: "Recording work start and end times" },
          { id: "b", textAr: "منع الوصول غير المصرح به إلى المعدات", textEn: "Preventing unauthorized access to equipment" },
          { id: "c", textAr: "تحديد المسؤوليات بين أفراد الفريق", textEn: "Defining responsibilities among team members" },
          { id: "d", textAr: "عزل جميع مصادر الطاقة الخطرة لحماية العمال من الإصابة", textEn: "Isolating all hazardous energy sources to protect workers from injury" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو الحد الأقصى المسموح به لانحراف الغلاف الموجّه عن الوضع الرأسي؟",
        questionTextEn: "What is the maximum allowable deviation of the conductor casing from vertical?",
        correctOptionId: "a",
        explanationAr: "الحد الأقصى المسموح به لانحراف الغلاف الموجّه عن الوضع الرأسي هو 1 درجة، وأي انحراف أكبر يتطلب تصحيحاً قبل المتابعة.",
        explanationEn: "The maximum allowable deviation of the conductor casing from vertical is 1 degree; any greater deviation requires correction before proceeding.",
        options: [
          { id: "a", textAr: "1 درجة", textEn: "1 degree" },
          { id: "b", textAr: "3 درجات", textEn: "3 degrees" },
          { id: "c", textAr: "5 درجات", textEn: "5 degrees" },
          { id: "d", textAr: "10 درجات", textEn: "10 degrees" }
        ]
      }
    ]
  },
  {
    order: 4,
    titleAr: "صيانة رأس البئر الدورية والوقائية",
    titleEn: "Periodic and Preventive Wellhead Maintenance",
    descriptionAr: "برامج الصيانة الدورية والوقائية لرأس البئر، بما يشمل جداول الفحص والاختبارات الدورية وإجراءات الصيانة الاستباقية.",
    descriptionEn: "Periodic and preventive maintenance programs for wellheads, including inspection schedules, periodic tests, and proactive maintenance procedures.",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "برنامج الصيانة الدورية",
        titleEn: "Periodic Maintenance Program",
        content: `# برنامج الصيانة الدورية لرأس البئر

## مفهوم الصيانة الوقائية

**الصيانة الوقائية (Preventive Maintenance - PM)** هي منهجية استباقية تهدف إلى الحفاظ على المعدات في حالة تشغيلية مثلى من خلال فحوصات وأعمال صيانة منتظمة، قبل وقوع الأعطال.

> **الإحصاء الصناعي:** كل دولار يُنفق على الصيانة الوقائية يُوفّر من 3 إلى 5 دولارات من تكاليف الصيانة التصحيحية والإنتاج الضائع.

---

## جدول الفحص الدوري

### الفحص اليومي (Daily Inspection):
| العنصر | الإجراء | المعيار |
|-------|---------|---------|
| ضغط الرأس | قراءة مقياس الضغط | ضمن الحدود التشغيلية |
| ضغط الفضاء الحلقي | قراءة مقياس الضغط | صفر أو ضمن الحدود المسموحة |
| التسرب البصري | فحص بصري لجميع الوصلات | لا يوجد تسرب مرئي |
| حالة الصمامات | التأكد من الأوضاع الصحيحة | وفق خطة التشغيل |

### الفحص الأسبوعي (Weekly Inspection):
- **فحص صمامات الأمان:** التأكد من عمل صمامات الأمان (Safety Valves)
- **فحص الحماية من التآكل:** فحص أنودات الحماية الكاثودية (Cathodic Protection Anodes)
- **فحص الأختام والحشوات:** فحص بصري للأختام الخارجية
- **تنظيف المنطقة:** إزالة الأوساخ والرواسب

### الفحص الشهري (Monthly Inspection):
- **اختبار صمامات الأمان:** اختبار وظيفي للصمامات
- **فحص عزم الدوران للبراغي:** التحقق من عدم ارتخاء البراغي
- **فحص الطلاء الواقي:** تحديد مناطق التآكل في الطلاء
- **مراجعة سجلات التشغيل:** تحليل اتجاهات الضغط والإنتاج

### الفحص الربع سنوي (Quarterly Inspection):
- **اختبار ضغط الفضاء الحلقي:** التحقق من سلامة مانعات التسرب
- **فحص صمامات الجذع والجناح:** اختبار وظيفي كامل
- **فحص نظام التحكم:** التحقق من عمل أنظمة الإغلاق التلقائي
- **مراجعة الوثائق:** تحديث سجلات الصيانة

### الفحص السنوي (Annual Inspection):
- **اختبار ضغط شامل:** اختبار هيدروليكي لجميع مكونات رأس البئر
- **فحص مانعات التسرب:** استبدال مانعات التسرب الاستباقي
- **فحص الصمامات الداخلية:** فحص مقاعد الصمامات وعناصر الإغلاق
- **مراجعة الامتثال للمعايير:** التحقق من الامتثال للمعايير الحالية

---

## إجراءات الصيانة الوقائية الرئيسية

### 1. تشحيم الصمامات (Valve Lubrication)
**الهدف:** الحفاظ على سهولة تشغيل الصمامات ومنع التآكل الداخلي

**الإجراء:**
\`\`\`
1. تحديد نوع الشحم المناسب (وفق توصيات المصنّع)
2. تنظيف فتحة الشحم من الأوساخ
3. حقن الشحم بضغط منخفض (لا يتجاوز 500 psi)
4. تشغيل الصمام (فتح وإغلاق) لتوزيع الشحم
5. تسجيل كمية الشحم المستخدمة في سجل الصيانة
\`\`\`

### 2. اختبار صمامات الإغلاق التلقائي (ESD Valve Testing)
**التكرار:** شهرياً أو وفق متطلبات المشغّل

**الإجراء:**
\`\`\`
1. إخطار مركز التحكم قبل الاختبار
2. التحقق من وضع الصمامات الأخرى
3. تفعيل إشارة الإغلاق التلقائي
4. قياس وقت الإغلاق (يجب أن يكون < 30 ثانية عادةً)
5. التحقق من الإغلاق الكامل
6. إعادة الصمامات لوضع التشغيل
7. تسجيل النتائج
\`\`\`

### 3. استبدال مانعات التسرب (Seal Replacement)
**التكرار:** وفق توصيات المصنّع أو عند ظهور علامات التسرب

**الأنواع التي تتطلب استبدالاً دورياً:**
- مانعات التسرب المطاطية: كل 3-5 سنوات
- حشوات الفلنجة: عند كل فك وتركيب
- مانعات تسرب صمام الكيل: كل 2-3 سنوات

---

## توثيق الصيانة

### سجل الصيانة (Maintenance Log):
يجب أن يتضمن:
- **تاريخ ووقت العمل**
- **اسم الفني المنفّذ**
- **وصف العمل المنجز**
- **القطع المستبدلة (الرقم التسلسلي والمواصفات)**
- **نتائج الاختبارات**
- **أي ملاحظات أو توصيات**

---

## الخلاصة

برنامج الصيانة الدورية المنظّم هو الفرق بين بئر تعمل بكفاءة لعقود وبئر تتعرض لأعطال متكررة ومكلفة. الالتزام بالجداول الزمنية والتوثيق الدقيق هما ركيزتا الصيانة الاحترافية.`
      },
      {
        order: 2,
        titleAr: "الفحص غير المتلف (NDT) لمكونات رأس البئر",
        titleEn: "Non-Destructive Testing (NDT) for Wellhead Components",
        content: `# الفحص غير المتلف (NDT) لمكونات رأس البئر

## مقدمة

**الفحص غير المتلف (Non-Destructive Testing - NDT)** هو مجموعة من التقنيات التي تُتيح فحص المواد والمكونات والتحقق من سلامتها دون إلحاق أي ضرر بها أو تغيير خصائصها. في صناعة رأس البئر، يُعدّ NDT أداةً حيويةً للكشف المبكر عن العيوب قبل أن تتطور إلى أعطال خطيرة.

---

## تقنيات NDT الرئيسية المستخدمة في رأس البئر

### 1. الفحص البصري (Visual Inspection - VT)
**الأبسط والأكثر استخداماً**

| الأداة | الاستخدام |
|-------|-----------|
| العين المجردة | الفحص العام للسطح |
| المنظار المكبّر (Magnifying Glass) | فحص الخيوط والشقوق الدقيقة |
| المنظار الداخلي (Borescope) | فحص التجاويف والأماكن الضيقة |
| الكاميرا عالية الدقة | التوثيق والمراجعة عن بُعد |

**ما يكشفه:** التآكل السطحي، الشقوق الكبيرة، التشوهات، التسرب

### 2. فحص الجسيمات المغناطيسية (Magnetic Particle Testing - MT)
**للكشف عن عيوب السطح وتحت السطح في المواد المغناطيسية**

**المبدأ:** تمغنط القطعة ورش جسيمات مغناطيسية دقيقة - تتجمع الجسيمات عند العيوب

**التطبيق في رأس البئر:**
- فحص الفلنجات بحثاً عن الشقوق
- فحص مناطق اللحام
- فحص مقاعد الصمامات

**القيود:** يعمل فقط على المواد المغناطيسية (الفولاذ الكربوني)

### 3. فحص السوائل النافذة (Liquid Penetrant Testing - PT)
**للكشف عن عيوب السطح في جميع المواد**

**الخطوات:**
\`\`\`
1. تنظيف السطح جيداً
2. تطبيق السائل النافذ (Penetrant)
3. الانتظار 10-30 دقيقة (Dwell Time)
4. إزالة السائل الزائد
5. تطبيق المظهّر (Developer)
6. الفحص البصري - العيوب تظهر كخطوط أو نقاط ملونة
\`\`\`

**التطبيق:** فحص الفولاذ المقاوم للصدأ والسبائك غير المغناطيسية

### 4. الفحص بالموجات فوق الصوتية (Ultrasonic Testing - UT)
**للكشف عن العيوب الداخلية وقياس سماكة الجدار**

**التطبيقات في رأس البئر:**
- **قياس سماكة الجدار (Wall Thickness Measurement):** الكشف عن التآكل الداخلي
- **فحص اللحامات:** الكشف عن المسامية والشقوق الداخلية
- **فحص الفلنجات:** الكشف عن التشققات الداخلية

**المزايا:**
- يكشف عن العيوب الداخلية التي لا تظهر بالفحص البصري
- يمكن إجراؤه أثناء التشغيل في بعض الحالات
- دقة عالية في تحديد موقع وحجم العيب

### 5. الفحص بالأشعة السينية (Radiographic Testing - RT)
**للحصول على صورة مقطعية للمكوّن**

**الاستخدام في رأس البئر:**
- فحص اللحامات الهيكلية
- فحص المسبوكات (Castings)
- التحقق من سلامة الوصلات المعقدة

**اعتبارات السلامة:** يتطلب إجراءات سلامة إشعاعية صارمة وتصاريح خاصة

---

## جدول تطبيق NDT في الصيانة الدورية

| التقنية | التكرار | المكونات المفحوصة |
|--------|---------|-----------------|
| الفحص البصري | يومي/أسبوعي | جميع المكونات الخارجية |
| قياس السماكة بالموجات فوق الصوتية | سنوي | جسم رأس البئر، البكرات |
| فحص الجسيمات المغناطيسية | كل 3 سنوات | الفلنجات، مناطق اللحام |
| فحص السوائل النافذة | عند الاشتباه | الفولاذ المقاوم للصدأ |
| الفحص بالأشعة السينية | عند الاشتباه | اللحامات الهيكلية |

---

## الخلاصة

تقنيات NDT هي "عيون" الفني المحترف التي تُتيح له رؤية ما لا يمكن رؤيته بالعين المجردة. الاستخدام المنتظم لهذه التقنيات يُحوّل الصيانة من ردّ فعل على الأعطال إلى إدارة استباقية للموجودات.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو التكرار الموصى به لاختبار صمامات الإغلاق التلقائي (ESD Valves)؟",
        questionTextEn: "What is the recommended frequency for testing Emergency Shutdown (ESD) Valves?",
        correctOptionId: "b",
        explanationAr: "يُوصى باختبار صمامات الإغلاق التلقائي شهرياً أو وفق متطلبات المشغّل لضمان استجابتها الفورية في حالات الطوارئ.",
        explanationEn: "ESD valves should be tested monthly or per operator requirements to ensure immediate response in emergencies.",
        options: [
          { id: "a", textAr: "يومياً", textEn: "Daily" },
          { id: "b", textAr: "شهرياً أو وفق متطلبات المشغّل", textEn: "Monthly or per operator requirements" },
          { id: "c", textAr: "كل 5 سنوات", textEn: "Every 5 years" },
          { id: "d", textAr: "فقط عند وقوع حادثة", textEn: "Only when an incident occurs" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هي تقنية NDT المناسبة للكشف عن التآكل الداخلي في جسم رأس البئر؟",
        questionTextEn: "Which NDT technique is suitable for detecting internal corrosion in the wellhead body?",
        correctOptionId: "d",
        explanationAr: "الفحص بالموجات فوق الصوتية (UT) هو الأنسب للكشف عن التآكل الداخلي وقياس سماكة الجدار دون الحاجة لفك المكوّن.",
        explanationEn: "Ultrasonic Testing (UT) is most suitable for detecting internal corrosion and measuring wall thickness without disassembly.",
        options: [
          { id: "a", textAr: "الفحص البصري (VT)", textEn: "Visual Testing (VT)" },
          { id: "b", textAr: "فحص السوائل النافذة (PT)", textEn: "Liquid Penetrant Testing (PT)" },
          { id: "c", textAr: "فحص الجسيمات المغناطيسية (MT)", textEn: "Magnetic Particle Testing (MT)" },
          { id: "d", textAr: "الفحص بالموجات فوق الصوتية (UT)", textEn: "Ultrasonic Testing (UT)" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو الفرق الرئيسي بين الصيانة الوقائية (PM) والصيانة التصحيحية (CM)؟",
        questionTextEn: "What is the main difference between Preventive Maintenance (PM) and Corrective Maintenance (CM)?",
        correctOptionId: "a",
        explanationAr: "الصيانة الوقائية تُنفَّذ بشكل استباقي قبل وقوع الأعطال وفق جداول زمنية محددة، بينما الصيانة التصحيحية تُنفَّذ بعد وقوع العطل.",
        explanationEn: "Preventive maintenance is performed proactively before failures occur on a scheduled basis, while corrective maintenance is performed after a failure occurs.",
        options: [
          { id: "a", textAr: "الصيانة الوقائية تُنفَّذ قبل وقوع الأعطال، والتصحيحية بعد وقوعها", textEn: "Preventive maintenance is performed before failures occur, corrective maintenance after" },
          { id: "b", textAr: "الصيانة الوقائية أغلى تكلفةً من التصحيحية دائماً", textEn: "Preventive maintenance is always more expensive than corrective maintenance" },
          { id: "c", textAr: "الصيانة التصحيحية تُنفَّذ وفق جداول زمنية محددة", textEn: "Corrective maintenance is performed on a scheduled basis" },
          { id: "d", textAr: "لا يوجد فرق جوهري بينهما", textEn: "There is no fundamental difference between them" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هي المعلومات الإلزامية التي يجب تسجيلها في سجل الصيانة؟",
        questionTextEn: "What mandatory information must be recorded in the maintenance log?",
        correctOptionId: "c",
        explanationAr: "سجل الصيانة يجب أن يتضمن: تاريخ ووقت العمل، اسم الفني، وصف العمل، القطع المستبدلة، نتائج الاختبارات، والملاحظات.",
        explanationEn: "The maintenance log must include: date and time, technician name, work description, replaced parts, test results, and observations.",
        options: [
          { id: "a", textAr: "اسم الفني فقط", textEn: "Technician name only" },
          { id: "b", textAr: "تاريخ العمل ونتائج الاختبارات فقط", textEn: "Work date and test results only" },
          { id: "c", textAr: "تاريخ ووقت العمل، اسم الفني، وصف العمل، القطع المستبدلة، نتائج الاختبارات، والملاحظات", textEn: "Date/time, technician name, work description, replaced parts, test results, and observations" },
          { id: "d", textAr: "تكلفة العمل والمواد المستخدمة فقط", textEn: "Work cost and materials used only" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو تقنية NDT التي تعمل فقط على المواد المغناطيسية؟",
        questionTextEn: "Which NDT technique works only on magnetic materials?",
        correctOptionId: "b",
        explanationAr: "فحص الجسيمات المغناطيسية (MT) يعمل فقط على المواد المغناطيسية مثل الفولاذ الكربوني، ولا يمكن استخدامه على الفولاذ المقاوم للصدأ أو السبائك غير المغناطيسية.",
        explanationEn: "Magnetic Particle Testing (MT) works only on magnetic materials like carbon steel and cannot be used on stainless steel or non-magnetic alloys.",
        options: [
          { id: "a", textAr: "الفحص بالموجات فوق الصوتية (UT)", textEn: "Ultrasonic Testing (UT)" },
          { id: "b", textAr: "فحص الجسيمات المغناطيسية (MT)", textEn: "Magnetic Particle Testing (MT)" },
          { id: "c", textAr: "فحص السوائل النافذة (PT)", textEn: "Liquid Penetrant Testing (PT)" },
          { id: "d", textAr: "الفحص بالأشعة السينية (RT)", textEn: "Radiographic Testing (RT)" }
        ]
      }
    ]
  },
  {
    order: 5,
    titleAr: "إجراءات السلامة في صيانة رأس البئر",
    titleEn: "Safety Procedures in Wellhead Maintenance",
    descriptionAr: "الإجراءات الشاملة للسلامة المهنية في أعمال صيانة رأس البئر، بما يشمل إدارة المخاطر وبروتوكولات الطوارئ.",
    descriptionEn: "Comprehensive occupational safety procedures for wellhead maintenance work, including risk management and emergency protocols.",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "تحليل مخاطر العمل (JSA/JHA)",
        titleEn: "Job Safety Analysis (JSA/JHA)",
        content: `# تحليل مخاطر العمل (Job Safety Analysis)

## مقدمة

**تحليل سلامة العمل (Job Safety Analysis - JSA)** أو **تحليل مخاطر العمل (Job Hazard Analysis - JHA)** هو أداة منهجية تُستخدم لتحديد المخاطر المرتبطة بكل خطوة من خطوات العمل ووضع ضوابط للحد منها.

> **الإحصاء:** 80% من حوادث العمل يمكن منعها من خلال تحليل مسبق للمخاطر.

---

## خطوات إعداد JSA

### الخطوة 1: تحديد العمل
- وصف واضح ومحدد للعمل المراد تنفيذه
- تحديد الموقع والمعدات المستخدمة
- تحديد الفريق المنفّذ

### الخطوة 2: تقسيم العمل إلى خطوات
- تقسيم العمل إلى خطوات منطقية متسلسلة
- كل خطوة يجب أن تصف إجراءً واحداً محدداً
- عادةً من 5 إلى 15 خطوة

### الخطوة 3: تحديد المخاطر لكل خطوة
لكل خطوة، يجب تحديد:
- **المخاطر الجسدية:** السقوط، الاصطدام، الانزلاق
- **المخاطر الكيميائية:** التعرض للهيدروكربونات، H₂S
- **المخاطر الميكانيكية:** الأجزاء المتحركة، الضغط العالي
- **المخاطر الكهربائية:** الصعق الكهربائي
- **المخاطر البيئية:** الحرارة الشديدة، العواصف

### الخطوة 4: وضع ضوابط للمخاطر
**هرم التحكم في المخاطر (Hierarchy of Controls):**

| المستوى | النوع | المثال |
|--------|------|-------|
| 1 | **الإزالة (Elimination)** | إزالة مصدر الخطر كلياً |
| 2 | **الاستبدال (Substitution)** | استبدال بمادة أقل خطورة |
| 3 | **الضوابط الهندسية (Engineering Controls)** | حواجز، تهوية |
| 4 | **الضوابط الإدارية (Administrative Controls)** | إجراءات، تدريب |
| 5 | **معدات الحماية الشخصية (PPE)** | الخوذة، القفازات |

---

## المخاطر الرئيسية في صيانة رأس البئر

### 1. خطر الانفجار (Blowout Risk)
**المصدر:** ضغط البئر غير المتحكم به

**الضوابط:**
- التحقق من إغلاق جميع صمامات العزل قبل البدء
- مراقبة مستمرة لضغط الرأس
- توفر معدات التدخل السريع (Well Control Equipment)
- تدريب الفريق على إجراءات السيطرة على البئر

### 2. خطر كبريتيد الهيدروجين (H₂S Hazard)
**الخصائص الخطيرة لـ H₂S:**
- **رائحة البيض الفاسد** عند التركيزات المنخفضة
- **شلل حاسة الشم** عند التركيزات المتوسطة (خطير جداً)
- **الوفاء الفورية** عند التركيزات العالية (>500 ppm)

| التركيز (ppm) | التأثير |
|-------------|---------|
| 1-5 | رائحة مزعجة |
| 10 | حد التعرض المهني (TLV-TWA) |
| 50-100 | تهيج العيون والجهاز التنفسي |
| 200-300 | شلل حاسة الشم، خطر الوفاة |
| >500 | وفاة فورية |

**الضوابط:**
- كاشفات H₂S شخصية وثابتة
- أجهزة التنفس المستقل (SCBA) جاهزة
- تدريب على الإخلاء الطارئ
- نظام الرياح (Wind Sock) لتحديد اتجاه الريح

### 3. خطر الضغط العالي (High Pressure Hazard)
**المخاطر:**
- انفجار الخطوط والمكونات
- إصابات بالغة من السوائل عالية الضغط
- حرائق من تسرب الهيدروكربونات

**الضوابط:**
- التحقق من تفريغ الضغط قبل فك أي وصلة
- استخدام معدات مقيّدة بالسلسلة (Chained Equipment)
- الوقوف جانبياً عند فك الوصلات
- ارتداء واقيات الوجه (Face Shield)

---

## إجراءات الطوارئ

### خطة الاستجابة للطوارئ (Emergency Response Plan - ERP)

**في حالة تسرب الغاز:**
\`\`\`
1. إيقاف جميع مصادر الاشتعال فوراً
2. إخطار مركز التحكم والإنذار
3. إخلاء المنطقة في اتجاه عكس الريح
4. تجمّع في نقطة التجمع المحددة
5. انتظار تعليمات فريق الطوارئ
\`\`\`

**في حالة الحريق:**
\`\`\`
1. إخطار فريق الإطفاء فوراً
2. إخلاء المنطقة
3. إغلاق صمامات الإيقاف التلقائي (إن أمكن بأمان)
4. استخدام طفاية الحريق للحرائق الصغيرة فقط
5. لا تخاطر بحياتك لإنقاذ المعدات
\`\`\`

---

## الخلاصة

السلامة ليست خياراً بل ضرورة مهنية وأخلاقية. الفني الذي يُهمل إجراءات السلامة لا يُخاطر بحياته فحسب، بل يُعرّض زملاءه والبيئة للخطر أيضاً. JSA هو الأداة الأولى التي يجب إعدادها قبل أي عمل على رأس البئر.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو التركيز الذي يُسبّب الوفاة الفورية عند التعرض لكبريتيد الهيدروجين (H₂S)؟",
        questionTextEn: "What concentration of Hydrogen Sulfide (H₂S) causes immediate death?",
        correctOptionId: "d",
        explanationAr: "تركيز H₂S الذي يزيد عن 500 ppm يُسبّب الوفاة الفورية، لذا يُعدّ من أخطر المواد في صناعة النفط والغاز.",
        explanationEn: "H₂S concentrations above 500 ppm cause immediate death, making it one of the most dangerous substances in the oil and gas industry.",
        options: [
          { id: "a", textAr: "10 ppm", textEn: "10 ppm" },
          { id: "b", textAr: "50 ppm", textEn: "50 ppm" },
          { id: "c", textAr: "200 ppm", textEn: "200 ppm" },
          { id: "d", textAr: "أكثر من 500 ppm", textEn: "More than 500 ppm" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هو أعلى مستوى في هرم التحكم في المخاطر (Hierarchy of Controls)؟",
        questionTextEn: "What is the highest level in the Hierarchy of Controls?",
        correctOptionId: "a",
        explanationAr: "الإزالة (Elimination) هي أعلى مستوى في هرم التحكم في المخاطر وأكثرها فعالية، إذ تُزيل مصدر الخطر كلياً.",
        explanationEn: "Elimination is the highest and most effective level in the Hierarchy of Controls, as it completely removes the hazard source.",
        options: [
          { id: "a", textAr: "الإزالة (Elimination)", textEn: "Elimination" },
          { id: "b", textAr: "معدات الحماية الشخصية (PPE)", textEn: "Personal Protective Equipment (PPE)" },
          { id: "c", textAr: "الضوابط الإدارية (Administrative Controls)", textEn: "Administrative Controls" },
          { id: "d", textAr: "الضوابط الهندسية (Engineering Controls)", textEn: "Engineering Controls" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو الإجراء الأول الذي يجب اتخاذه عند اكتشاف تسرب غاز في منطقة العمل؟",
        questionTextEn: "What is the first action to take when a gas leak is detected in the work area?",
        correctOptionId: "b",
        explanationAr: "الإجراء الأول عند اكتشاف تسرب الغاز هو إيقاف جميع مصادر الاشتعال فوراً لمنع الانفجار أو الحريق.",
        explanationEn: "The first action upon detecting a gas leak is to immediately stop all ignition sources to prevent explosion or fire.",
        options: [
          { id: "a", textAr: "الاتصال بالمشرف لطلب التعليمات", textEn: "Contact the supervisor for instructions" },
          { id: "b", textAr: "إيقاف جميع مصادر الاشتعال فوراً", textEn: "Immediately stop all ignition sources" },
          { id: "c", textAr: "محاولة إصلاح التسرب بالمعدات المتاحة", textEn: "Attempt to repair the leak with available equipment" },
          { id: "d", textAr: "تسجيل التسرب في سجل الصيانة", textEn: "Record the leak in the maintenance log" }
        ]
      },
      {
        order: 4,
        questionTextAr: "لماذا يُعدّ شلل حاسة الشم من أخطر تأثيرات H₂S؟",
        questionTextEn: "Why is olfactory paralysis (loss of smell) considered one of the most dangerous effects of H₂S?",
        correctOptionId: "c",
        explanationAr: "شلل حاسة الشم خطير لأنه يجعل الشخص غير قادر على الشعور برائحة H₂S رغم وجوده بتركيزات قاتلة، مما يمنعه من الإخلاء في الوقت المناسب.",
        explanationEn: "Olfactory paralysis is dangerous because it makes the person unable to smell H₂S despite its presence at lethal concentrations, preventing timely evacuation.",
        options: [
          { id: "a", textAr: "لأنه يُسبّب صداعاً شديداً", textEn: "Because it causes severe headaches" },
          { id: "b", textAr: "لأنه يُضعف الرؤية", textEn: "Because it weakens vision" },
          { id: "c", textAr: "لأنه يجعل الشخص غير قادر على الشعور بالغاز رغم وجوده بتركيزات قاتلة", textEn: "Because it makes the person unable to detect the gas despite its presence at lethal concentrations" },
          { id: "d", textAr: "لأنه يُسبّب الغثيان والتقيؤ", textEn: "Because it causes nausea and vomiting" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو الغرض الرئيسي من تحليل سلامة العمل (JSA)؟",
        questionTextEn: "What is the main purpose of a Job Safety Analysis (JSA)?",
        correctOptionId: "b",
        explanationAr: "الغرض الرئيسي من JSA هو تحديد المخاطر المرتبطة بكل خطوة من خطوات العمل ووضع ضوابط مناسبة للحد منها قبل بدء العمل.",
        explanationEn: "The main purpose of JSA is to identify hazards associated with each work step and establish appropriate controls to mitigate them before work begins.",
        options: [
          { id: "a", textAr: "تحديد مسؤوليات كل فرد في الفريق", textEn: "Defining each team member's responsibilities" },
          { id: "b", textAr: "تحديد المخاطر لكل خطوة عمل ووضع ضوابط مناسبة قبل البدء", textEn: "Identifying hazards for each work step and establishing controls before starting" },
          { id: "c", textAr: "توثيق الحوادث التي وقعت في الماضي", textEn: "Documenting past incidents" },
          { id: "d", textAr: "تحديد تكلفة العمل والمواد المطلوبة", textEn: "Determining work cost and required materials" }
        ]
      }
    ]
  },
  {
    order: 6,
    titleAr: "إصلاح وتشخيص أعطال رأس البئر",
    titleEn: "Wellhead Troubleshooting and Repair",
    descriptionAr: "منهجية منظّمة لتشخيص وإصلاح الأعطال الشائعة في رأس البئر، مع دراسة حالات عملية.",
    descriptionEn: "A systematic methodology for diagnosing and repairing common wellhead failures, with practical case studies.",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "منهجية تشخيص الأعطال",
        titleEn: "Fault Diagnosis Methodology",
        content: `# منهجية تشخيص الأعطال في رأس البئر

## مقدمة

تشخيص الأعطال هو فن وعلم في آنٍ واحد. الفني المحترف لا يُسارع إلى الحل قبل أن يفهم المشكلة بعمق. المنهجية المنظّمة في التشخيص تُقلّل من وقت التوقف وتمنع إعادة وقوع العطل.

---

## منهجية التشخيص المنظّمة (5-Why Analysis)

**أسلوب "لماذا الخمس" (5-Why)** هو أداة بسيطة وفعّالة للوصول إلى السبب الجذري للعطل:

**مثال تطبيقي:**
\`\`\`
المشكلة: تسرب من فلنجة رأس الغلاف

لماذا؟ (1) → حلقة الإغلاق (Ring Gasket) تالفة
لماذا؟ (2) → تعرّضت لضغط غير متساوٍ عند التركيب
لماذا؟ (3) → البراغي لم تُشدّ بنمط النجمة الصحيح
لماذا؟ (4) → الفني لم يتبع إجراء التركيب الرسمي
لماذا؟ (5) → لا يوجد إجراء رسمي مكتوب لهذه العملية

السبب الجذري: غياب إجراء تركيب مكتوب ومعتمد
الحل الجذري: إعداد إجراء رسمي وتدريب الفنيين عليه
\`\`\`

---

## الأعطال الشائعة وأسبابها

### 1. تسرب من الفلنجات (Flange Leaks)

| السبب | الأعراض | الحل |
|------|---------|------|
| حلقة إغلاق تالفة | تسرب مرئي أو قراءة ضغط منخفضة | استبدال حلقة الإغلاق |
| براغي مرتخية | تسرب متقطع | إعادة شد البراغي بالعزم الصحيح |
| وجه الفلنجة تالف | تسرب مستمر رغم استبدال الحلقة | إصلاح أو استبدال الفلنجة |
| عدم محاذاة الفلنجات | ت
سرب رغم الشد الصحيح | إعادة المحاذاة |

### 2. تسرب من مانعات التسرب (Seal Leaks)

**أعراض التسرب من مانعات التسرب:**
- ارتفاع ضغط الفضاء الحلقي (Annulus Pressure Buildup)
- وجود سوائل في الفضاء الحلقي
- تسرب من فتحات الاختبار

**الأسباب الشائعة:**
1. **تآكل مانع التسرب:** بسبب المواد الكيميائية أو الحرارة
2. **تلف ميكانيكي:** بسبب الضغط الزائد أو الاهتزاز
3. **انتهاء الصلاحية:** مانعات التسرب المطاطية لها عمر تشغيلي محدد
4. **خطأ في التركيب:** عدم تحقيق الضغط الصحيح عند التركيب

### 3. أعطال الصمامات (Valve Failures)

**أنواع أعطال الصمامات:**

| نوع العطل | الأعراض | السبب المحتمل | الحل |
|----------|---------|--------------|------|
| عدم الإغلاق الكامل | تسرب عبر الصمام | تلف المقعد أو عنصر الإغلاق | إصلاح أو استبدال |
| صعوبة التشغيل | مقاومة عالية عند الفتح/الإغلاق | نقص الشحم، تآكل | تشحيم أو إصلاح |
| تسرب من الحشوة | تسرب من عمود الصمام | تلف حشوة العمود | استبدال الحشوة |
| عدم الاستجابة للتحكم | الصمام لا يستجيب للأوامر | عطل في نظام التحكم | فحص نظام التحكم |

---

## أدوات التشخيص

### 1. مقاييس الضغط (Pressure Gauges)
- **مقياس الضغط المعياري:** للقراءات الروتينية
- **مقياس الضغط الرقمي:** للقراءات الدقيقة
- **مسجّل الضغط (Pressure Recorder):** لتتبع اتجاهات الضغط عبر الزمن

### 2. كاشفات التسرب (Leak Detectors)
- **محلول الصابون:** للكشف عن تسرب الغاز
- **الكاشف الإلكتروني للغاز:** للكشف الدقيق والسريع
- **كاميرا الأشعة تحت الحمراء:** للكشف عن التسرب من مسافة بعيدة

### 3. معدات قياس العزم (Torque Measurement)
- **مفتاح العزم (Torque Wrench):** للتحقق من عزم الدوران للبراغي
- **محلل العزم الرقمي:** لقياس دقيق وتوثيق

---

## دراسة حالة: تسرب من فلنجة رأس الغلاف

**الموقف:** اكتشف المشغّل تسرباً من فلنجة رأس الغلاف أثناء الفحص الأسبوعي.

**خطوات التشخيص:**
\`\`\`
الخطوة 1: التحقق من موقع التسرب بدقة
→ النتيجة: التسرب من الجهة الشمالية للفلنجة

الخطوة 2: قياس ضغط الفضاء الحلقي
→ النتيجة: الضغط صفر (طبيعي)

الخطوة 3: فحص براغي الفلنجة
→ النتيجة: اثنان من البراغي مرتخيان

الخطوة 4: فحص حلقة الإغلاق
→ النتيجة: لا يمكن التحقق دون الفك

الخطوة 5: إعادة شد البراغي المرتخية
→ النتيجة: استمر التسرب

الخطوة 6: فك الفلنجة وفحص حلقة الإغلاق
→ النتيجة: حلقة الإغلاق تالفة (خدش عميق)
\`\`\`

**الحل:** استبدال حلقة الإغلاق وإعادة التركيب بالعزم الصحيح.

**الدرس المستفاد:** إعادة شد البراغي لا تُصلح حلقة الإغلاق التالفة - التشخيص الصحيح يُوفّر الوقت.

---

## الخلاصة

التشخيص المنهجي هو الفرق بين الفني المحترف والفني العادي. الاستثمار في وقت التشخيص الصحيح يُوفّر ضعفه في وقت الإصلاح ويمنع تكرار العطل.`
      },
      {
        order: 2,
        titleAr: "إجراءات إصلاح مانعات التسرب",
        titleEn: "Seal Repair Procedures",
        content: `# إجراءات إصلاح مانعات التسرب في رأس البئر

## مقدمة

مانعات التسرب هي "خط الدفاع الأول" في رأس البئر. إصلاحها أو استبدالها يتطلب دقةً عاليةً والتزاماً صارماً بالإجراءات لضمان الإحكام التام بعد الإصلاح.

---

## أنواع الإصلاحات حسب نوع مانع التسرب

### 1. استبدال حلقة الإغلاق (Ring Gasket Replacement)

**متى يُستبدل؟**
- عند كل فك وتركيب للفلنجة (قاعدة ذهبية)
- عند ظهور علامات التسرب
- عند انتهاء مدة الصلاحية

**الإجراء التفصيلي:**
\`\`\`
1. التحضير:
   - تفريغ الضغط من المقطع المراد إصلاحه
   - التحقق من صفر الضغط بمقياس معياري
   - تطبيق LOTO على جميع مصادر الطاقة

2. الفك:
   - فك البراغي بالتسلسل العكسي لنمط النجمة
   - إزالة الفلنجة بحذر (قد يكون هناك ضغط محبوس)
   - إزالة حلقة الإغلاق القديمة

3. التنظيف والفحص:
   - تنظيف مجرى حلقة الإغلاق بعناية
   - فحص مجرى الحلقة بحثاً عن الخدوش والتلف
   - قياس عمق وعرض المجرى للتأكد من المطابقة

4. التركيب:
   - التحقق من مواصفات الحلقة الجديدة
   - تركيب الحلقة في المجرى بدون شحم (إلا إذا نصّت المواصفات)
   - محاذاة الفلنجة بدقة
   - تركيب البراغي وشدّها بنمط النجمة على مراحل

5. الاختبار:
   - رفع الضغط تدريجياً
   - الانتظار 15 دقيقة عند ضغط الاختبار
   - التحقق من عدم وجود تسرب
\`\`\`

### 2. استبدال حشوة عمود الصمام (Valve Stem Packing Replacement)

**الأعراض:** تسرب من حول عمود الصمام

**الإجراء:**
\`\`\`
1. عزل الصمام وتفريغ الضغط
2. فك صامولة حشوة العمود (Packing Nut)
3. إزالة الحشوة القديمة بأداة غير معدنية
4. تنظيف مجرى الحشوة
5. تركيب الحشوة الجديدة (وفق توصيات المصنّع)
6. شد صامولة الحشوة بالعزم المحدد
7. اختبار الإغلاق والتحقق من عدم التسرب
\`\`\`

---

## إصلاح مانعات التسرب تحت الضغط (Live Well Seal Repair)

في بعض الحالات، يمكن إصلاح مانعات التسرب دون إيقاف الإنتاج باستخدام تقنيات متخصصة:

### حقن مانع التسرب (Sealant Injection)
- **الاستخدام:** للتسرب الخفيف من الفلنجات والصمامات
- **المبدأ:** حقن مادة مانعة للتسرب تحت الضغط في مسار التسرب
- **المزايا:** لا يتطلب إيقاف الإنتاج
- **القيود:** حل مؤقت، يتطلب إصلاحاً دائماً لاحقاً

### تقنية التغليف (Encapsulation)
- **الاستخدام:** للتسرب من الأنابيب والفلنجات
- **المبدأ:** تركيب غلاف معدني حول منطقة التسرب وحقن مادة مانعة
- **المزايا:** إصلاح دائم دون إيقاف الإنتاج

---

## الخلاصة

إصلاح مانعات التسرب يتطلب مزيجاً من المعرفة التقنية والمهارة العملية والالتزام بالإجراءات. الإصلاح الصحيح يُطيل عمر المعدة ويمنع التكرار، بينما الإصلاح السريع غير المدروس يُفاقم المشكلة.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هي القاعدة الذهبية بشأن استبدال حلقة الإغلاق (Ring Gasket)؟",
        questionTextEn: "What is the golden rule regarding Ring Gasket replacement?",
        correctOptionId: "a",
        explanationAr: "القاعدة الذهبية هي استبدال حلقة الإغلاق عند كل فك وتركيب للفلنجة، حتى لو بدت سليمة، لأن إعادة استخدامها يُزيد من خطر التسرب.",
        explanationEn: "The golden rule is to replace the ring gasket at every flange disassembly and reassembly, even if it appears intact, as reuse increases leak risk.",
        options: [
          { id: "a", textAr: "استبدالها عند كل فك وتركيب للفلنجة بغض النظر عن حالتها", textEn: "Replace at every flange disassembly regardless of condition" },
          { id: "b", textAr: "استبدالها فقط عند ظهور التسرب المرئي", textEn: "Replace only when visible leakage appears" },
          { id: "c", textAr: "استبدالها كل 5 سنوات وفق الجدول الزمني", textEn: "Replace every 5 years per schedule" },
          { id: "d", textAr: "إعادة استخدامها إذا كانت في حالة جيدة", textEn: "Reuse if in good condition" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هي تقنية الإصلاح التي تُتيح إصلاح التسرب دون إيقاف الإنتاج؟",
        questionTextEn: "Which repair technique allows fixing leaks without stopping production?",
        correctOptionId: "c",
        explanationAr: "تقنية حقن مانع التسرب (Sealant Injection) تُتيح إصلاح التسرب الخفيف دون إيقاف الإنتاج، وإن كانت حلاً مؤقتاً.",
        explanationEn: "Sealant Injection technique allows fixing minor leaks without stopping production, though it is a temporary solution.",
        options: [
          { id: "a", textAr: "استبدال حلقة الإغلاق (Ring Gasket Replacement)", textEn: "Ring Gasket Replacement" },
          { id: "b", textAr: "استبدال حشوة عمود الصمام (Packing Replacement)", textEn: "Valve Stem Packing Replacement" },
          { id: "c", textAr: "حقن مانع التسرب (Sealant Injection)", textEn: "Sealant Injection" },
          { id: "d", textAr: "الفحص بالموجات فوق الصوتية (UT)", textEn: "Ultrasonic Testing (UT)" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو أسلوب '5 لماذا' (5-Why) المستخدم في تشخيص الأعطال؟",
        questionTextEn: "What is the '5-Why' technique used in fault diagnosis?",
        correctOptionId: "d",
        explanationAr: "أسلوب '5 لماذا' هو أداة للوصول إلى السبب الجذري للعطل عن طريق طرح سؤال 'لماذا؟' خمس مرات متتالية للتعمق في أسباب المشكلة.",
        explanationEn: "The 5-Why technique is a tool for reaching the root cause of a failure by asking 'Why?' five consecutive times to dig deeper into the problem causes.",
        options: [
          { id: "a", textAr: "أداة لقياس وقت الإصلاح وتحسينه", textEn: "A tool for measuring and improving repair time" },
          { id: "b", textAr: "قائمة تحقق من خمس خطوات للصيانة الوقائية", textEn: "A five-step checklist for preventive maintenance" },
          { id: "c", textAr: "منهجية لتدريب الفنيين الجدد", textEn: "A methodology for training new technicians" },
          { id: "d", textAr: "أداة للوصول إلى السبب الجذري للعطل بطرح 'لماذا؟' خمس مرات متتالية", textEn: "A tool for reaching root cause by asking 'Why?' five consecutive times" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هو الإجراء الأول قبل فك أي فلنجة في رأس البئر؟",
        questionTextEn: "What is the first step before disassembling any wellhead flange?",
        correctOptionId: "b",
        explanationAr: "الإجراء الأول قبل فك أي فلنجة هو تفريغ الضغط من المقطع المراد إصلاحه والتحقق من صفر الضغط بمقياس معياري.",
        explanationEn: "The first step before disassembling any flange is to depressurize the section to be repaired and verify zero pressure with a calibrated gauge.",
        options: [
          { id: "a", textAr: "إعداد الحلقة الجديدة وتجهيز الأدوات", textEn: "Prepare the new gasket and tools" },
          { id: "b", textAr: "تفريغ الضغط والتحقق من صفر الضغط بمقياس معياري", textEn: "Depressurize and verify zero pressure with a calibrated gauge" },
          { id: "c", textAr: "إخطار مركز التحكم بالعمل المراد تنفيذه", textEn: "Notify the control center of the planned work" },
          { id: "d", textAr: "فحص حلقة الإغلاق القديمة بصرياً", textEn: "Visually inspect the old ring gasket" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو الفرق بين تقنية التغليف (Encapsulation) وحقن مانع التسرب (Sealant Injection)؟",
        questionTextEn: "What is the difference between Encapsulation and Sealant Injection techniques?",
        correctOptionId: "a",
        explanationAr: "التغليف يُعدّ إصلاحاً دائماً إذ يُركَّب غلاف معدني حول منطقة التسرب، بينما حقن مانع التسرب هو حل مؤقت يتطلب إصلاحاً دائماً لاحقاً.",
        explanationEn: "Encapsulation is a permanent repair as a metal sleeve is installed around the leak area, while Sealant Injection is a temporary solution requiring permanent repair later.",
        options: [
          { id: "a", textAr: "التغليف إصلاح دائم بغلاف معدني، وحقن مانع التسرب حل مؤقت", textEn: "Encapsulation is a permanent repair with a metal sleeve; sealant injection is a temporary solution" },
          { id: "b", textAr: "التغليف يتطلب إيقاف الإنتاج، وحقن مانع التسرب لا يتطلب ذلك", textEn: "Encapsulation requires production shutdown; sealant injection does not" },
          { id: "c", textAr: "لا يوجد فرق بينهما وكلاهما إصلاح دائم", textEn: "No difference; both are permanent repairs" },
          { id: "d", textAr: "التغليف أرخص تكلفةً من حقن مانع التسرب", textEn: "Encapsulation is cheaper than sealant injection" }
        ]
      }
    ]
  },
  {
    order: 7,
    titleAr: "أنظمة التحكم في البئر (Well Control)",
    titleEn: "Well Control Systems",
    descriptionAr: "أنظمة وإجراءات التحكم في البئر للوقاية من الانفجارات وإدارة حالات الطوارئ.",
    descriptionEn: "Well control systems and procedures for preventing blowouts and managing emergency situations.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "مانع الانفجار (BOP) وأنواعه",
        titleEn: "Blowout Preventer (BOP) Types",
        content: `# مانع الانفجار (Blowout Preventer - BOP)

## مقدمة

**مانع الانفجار (BOP)** هو المعدة الأكثر أهمية في منظومة التحكم في البئر. يُمثّل خط الدفاع الأخير ضد انفجار البئر (Blowout) الذي يُعدّ من أخطر الحوادث في صناعة النفط والغاز.

> **تعريف الانفجار (Blowout):** هو التدفق غير المتحكم به للسوائل أو الغازات من البئر إلى السطح، وينتج عن فقدان السيطرة على ضغط البئر.

---

## أنواع مانعات الانفجار

### 1. مانع الانفجار الكروي (Annular BOP / Spherical BOP)
**الوصف:** يستخدم عنصر إغلاق مطاطياً كروياً يُحيط بأي شيء داخل البئر

**المزايا:**
- يُغلق حول أي قطر من الأنابيب
- يُغلق حتى على البئر الفارغة
- سرعة الاستجابة عالية

**الاستخدام:** الإغلاق الأولي السريع في حالات الطوارئ

### 2. مانع الانفجار ذو الكباش (Ram BOP)
يستخدم أزواجاً من الكباش (Rams) التي تتحرك أفقياً:

| نوع الكبش | الوظيفة |
|----------|---------|
| **كبش الأنبوب (Pipe Ram)** | يُغلق حول أنبوب بقطر محدد |
| **كبش الأعمى (Blind Ram)** | يُغلق البئر الفارغة |
| **كبش القطع (Shear Ram)** | يقطع الأنبوب ويُغلق البئر |
| **كبش الأنبوب المتغير (Variable Bore Ram)** | يُغلق حول أنابيب بأقطار مختلفة |

### 3. مانع الانفجار الداخلي (Inside BOP / Drop-In Check Valve)
يُركَّب داخل عمود الحفر لمنع التدفق العكسي من البئر.

---

## تكديس مانعات الانفجار (BOP Stack)

في عمليات الحفر، تُركَّب عدة مانعات انفجار فوق بعضها لتشكيل "تكديس BOP":

\`\`\`
(من الأعلى إلى الأسفل)
┌─────────────────────────────┐
│  مانع الانفجار الكروي       │ ← الإغلاق السريع
├─────────────────────────────┤
│  كبش القطع (Shear Ram)      │ ← الإغلاق الطارئ
├─────────────────────────────┤
│  كبش الأنبوب (Pipe Ram)     │ ← الإغلاق حول الأنبوب
├─────────────────────────────┤
│  كبش الأنبوب المتغير        │ ← المرونة في الأقطار
├─────────────────────────────┤
│  رأس البئر (Wellhead)       │
└─────────────────────────────┘
\`\`\`

---

## مؤشرات الكيك (Kick Indicators)

**الكيك (Kick)** هو دخول السوائل أو الغازات من التكوين إلى البئر. يجب اكتشافه مبكراً قبل أن يتطور إلى انفجار:

| المؤشر | الوصف | الأهمية |
|-------|-------|---------|
| **زيادة حجم طين الحفر** | ارتفاع مستوى الطين في خزان الطين | مؤشر رئيسي |
| **زيادة معدل التدفق** | زيادة تدفق الطين من البئر | مؤشر مبكر |
| **انخفاض ضغط الضخ** | انخفاض مفاجئ في ضغط الضخ | مؤشر مهم |
| **زيادة سرعة الحفر** | حفر أسرع من المعتاد | مؤشر مبكر |
| **تغير في غاز الطين** | ارتفاع مستوى الغاز في الطين | مؤشر كيميائي |

---

## إجراءات الإغلاق الطارئ (Emergency Shut-In Procedures)

### إجراء الإغلاق الصلب (Hard Shut-In):
\`\`\`
1. رفع أداة الحفر (إن أمكن)
2. إغلاق مانع الانفجار الكروي
3. إغلاق صمام الخنق (Choke Valve)
4. قراءة ضغط الغلاف وأنبوب الحفر
5. الإبلاغ الفوري للمشرف
\`\`\`

### إجراء الإغلاق اللين (Soft Shut-In):
\`\`\`
1. رفع أداة الحفر
2. فتح صمام الخنق قليلاً
3. إغلاق مانع الانفجار
4. إغلاق صمام الخنق تدريجياً
5. قراءة الضغوط وتسجيلها
\`\`\`

---

## الخلاصة

مانع الانفجار هو الحارس الأمين لسلامة البئر والعمال والبيئة. فهم أنواعه وكيفية تشغيله في حالات الطوارئ هو مهارة أساسية لكل من يعمل في صناعة النفط والغاز.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو نوع مانع الانفجار الذي يمكنه إغلاق البئر حول أي قطر من الأنابيب؟",
        questionTextEn: "Which type of BOP can close around any pipe diameter?",
        correctOptionId: "b",
        explanationAr: "مانع الانفجار الكروي (Annular BOP) يستخدم عنصر إغلاق مطاطياً كروياً يمكنه الإغلاق حول أي قطر من الأنابيب أو حتى على البئر الفارغة.",
        explanationEn: "The Annular BOP uses a spherical rubber sealing element that can close around any pipe diameter or even on an open hole.",
        options: [
          { id: "a", textAr: "كبش الأنبوب (Pipe Ram)", textEn: "Pipe Ram" },
          { id: "b", textAr: "مانع الانفجار الكروي (Annular BOP)", textEn: "Annular BOP" },
          { id: "c", textAr: "كبش الأعمى (Blind Ram)", textEn: "Blind Ram" },
          { id: "d", textAr: "كبش القطع (Shear Ram)", textEn: "Shear Ram" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هو المؤشر الرئيسي الذي يدل على حدوث كيك (Kick) في البئر؟",
        questionTextEn: "What is the primary indicator of a kick occurring in the well?",
        correctOptionId: "a",
        explanationAr: "زيادة حجم طين الحفر في خزان الطين هو المؤشر الرئيسي للكيك، لأنه يعني دخول سوائل إضافية من التكوين إلى البئر.",
        explanationEn: "An increase in drilling mud volume in the mud tank is the primary kick indicator, as it means additional formation fluids have entered the wellbore.",
        options: [
          { id: "a", textAr: "زيادة حجم طين الحفر في خزان الطين", textEn: "Increase in drilling mud volume in the mud tank" },
          { id: "b", textAr: "انخفاض درجة حرارة الطين العائد", textEn: "Decrease in return mud temperature" },
          { id: "c", textAr: "زيادة وزن الطين (Mud Weight)", textEn: "Increase in mud weight" },
          { id: "d", textAr: "انخفاض سرعة الحفر", textEn: "Decrease in drilling rate" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو الفرق بين كبش الأعمى (Blind Ram) وكبش القطع (Shear Ram)؟",
        questionTextEn: "What is the difference between a Blind Ram and a Shear Ram?",
        correctOptionId: "c",
        explanationAr: "كبش الأعمى يُغلق البئر الفارغة فقط (بدون أنبوب)، بينما كبش القطع يمكنه قطع الأنبوب الموجود في البئر ثم إغلاقها.",
        explanationEn: "The Blind Ram closes an open hole only (without pipe), while the Shear Ram can cut through any pipe in the wellbore and then seal it.",
        options: [
          { id: "a", textAr: "كبش الأعمى أقوى من كبش القطع", textEn: "Blind Ram is stronger than Shear Ram" },
          { id: "b", textAr: "كبش القطع يُستخدم فقط في البيئات البحرية", textEn: "Shear Ram is used only in offshore environments" },
          { id: "c", textAr: "كبش الأعمى يُغلق البئر الفارغة، وكبش القطع يقطع الأنبوب ويُغلق البئر", textEn: "Blind Ram closes open hole; Shear Ram cuts pipe and seals the well" },
          { id: "d", textAr: "لا يوجد فرق وظيفي بينهما", textEn: "No functional difference between them" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هو الانفجار (Blowout) في صناعة النفط والغاز؟",
        questionTextEn: "What is a Blowout in the oil and gas industry?",
        correctOptionId: "d",
        explanationAr: "الانفجار هو التدفق غير المتحكم به للسوائل أو الغازات من البئر إلى السطح، وينتج عن فقدان السيطرة على ضغط البئر.",
        explanationEn: "A blowout is the uncontrolled flow of fluids or gases from the well to the surface, resulting from loss of well pressure control.",
        options: [
          { id: "a", textAr: "انفجار معدات رأس البئر بسبب الضغط الزائد", textEn: "Explosion of wellhead equipment due to excess pressure" },
          { id: "b", textAr: "تسرب الغاز من فلنجات رأس البئر", textEn: "Gas leakage from wellhead flanges" },
          { id: "c", textAr: "انهيار الغلاف داخل البئر", textEn: "Casing collapse inside the well" },
          { id: "d", textAr: "التدفق غير المتحكم به للسوائل أو الغازات من البئر إلى السطح", textEn: "Uncontrolled flow of fluids or gases from the well to the surface" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو الإجراء الأول في إغلاق البئر الصلب (Hard Shut-In)؟",
        questionTextEn: "What is the first step in a Hard Shut-In procedure?",
        correctOptionId: "b",
        explanationAr: "الإجراء الأول في الإغلاق الصلب هو رفع أداة الحفر (إن أمكن) لتوفير مساحة للكباش، ثم إغلاق مانع الانفجار الكروي.",
        explanationEn: "The first step in Hard Shut-In is to pick up the drill string (if possible) to provide clearance for the rams, then close the annular BOP.",
        options: [
          { id: "a", textAr: "إغلاق صمام الخنق (Choke Valve) أولاً", textEn: "Close the Choke Valve first" },
          { id: "b", textAr: "رفع أداة الحفر إن أمكن", textEn: "Pick up the drill string if possible" },
          { id: "c", textAr: "الإبلاغ الفوري للمشرف قبل أي إجراء", textEn: "Immediately notify the supervisor before any action" },
          { id: "d", textAr: "قراءة ضغط الغلاف وأنبوب الحفر", textEn: "Read casing and drill pipe pressures" }
        ]
      }
    ]
  },
  {
    order: 8,
    titleAr: "التآكل وحماية معدات رأس البئر",
    titleEn: "Corrosion and Protection of Wellhead Equipment",
    descriptionAr: "أنواع التآكل التي تُهدد معدات رأس البئر وأساليب الحماية والوقاية منها.",
    descriptionEn: "Types of corrosion threatening wellhead equipment and methods of protection and prevention.",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "أنواع التآكل في رأس البئر",
        titleEn: "Types of Corrosion in Wellheads",
        content: `# أنواع التآكل في معدات رأس البئر

## مقدمة

التآكل (Corrosion) هو أحد أكبر التحديات التي تواجه معدات رأس البئر، ويُسبّب خسائر اقتصادية ضخمة وحوادث أمنية خطيرة. فهم أنواع التآكل وآليات حدوثه هو الخطوة الأولى نحو الوقاية الفعّالة.

---

## أنواع التآكل الرئيسية

### 1. التآكل الكيميائي (Chemical Corrosion)

**التآكل بثاني أكسيد الكربون (CO₂ Corrosion / Sweet Corrosion)**
- **الآلية:** يذوب CO₂ في الماء ليُكوّن حمض الكربونيك (H₂CO₃) الذي يُهاجم الفولاذ
- **الأعراض:** تآكل موضعي (Pitting) وتآكل عام (General Corrosion)
- **الظروف:** يزداد مع ارتفاع الضغط ودرجة الحرارة

**التآكل بكبريتيد الهيدروجين (H₂S Corrosion / Sour Corrosion)**
- **الآلية:** يُسبّب H₂S تآكلاً كيميائياً وتكسراً بالإجهاد الكبريتي (SSC)
- **الخطورة:** أشد خطورةً من CO₂ لأنه يُضعف المادة بشكل مفاجئ
- **المعيار:** NACE MR0175 يُحدّد متطلبات المواد في بيئات H₂S

### 2. التآكل الكلفاني (Galvanic Corrosion)
يحدث عند تلامس معدنين مختلفين في وجود الكهرباء:
- **المعدن الأكثر نشاطاً (Anode):** يتآكل
- **المعدن الأقل نشاطاً (Cathode):** يُحمى

**مثال:** تلامس الفولاذ الكربوني مع الفولاذ المقاوم للصدأ في وجود الماء المالح

### 3. التآكل بالتآكل الميكانيكي (Erosion-Corrosion)
يحدث عندما يُسرّع التدفق السريع للسوائل التآكلَ:
- **الأسباب:** سرعات تدفق عالية، جسيمات صلبة في السائل
- **المواضع الشائعة:** مناطق التضيق (Choke Valves)، المنحنيات

### 4. التآكل بالشقوق (Crevice Corrosion)
يحدث في الفراغات الضيقة (تحت الحشوات، بين الفلنجات):
- **الآلية:** نضوب الأكسجين في الفراغ يُسرّع التآكل
- **الوقاية:** تصميم يُقلّل الفراغات، استخدام مواد مقاومة

### 5. التآكل البكتيري (Microbiologically Influenced Corrosion - MIC)
تُسبّبه بكتيريا مختزلة للكبريتات (SRB - Sulfate Reducing Bacteria):
- **الأعراض:** تآكل موضعي عميق وسريع
- **الظروف:** المياه الراكدة، الأماكن المعتمة
- **الكشف:** اختبارات بكتيرية دورية

---

## عوامل تُسرّع التآكل

| العامل | التأثير |
|-------|---------|
| **درجة الحرارة** | كل 10°C ارتفاع يُضاعف معدل التآكل |
| **الضغط** | ضغط أعلى = تركيز أعلى للغازات الذائبة |
| **الملوحة** | الماء المالح أكثر تآكلاً من العذب |
| **سرعة التدفق** | التدفق السريع يُزيل طبقة الحماية |
| **pH** | الوسط الحامضي (pH منخفض) يُسرّع التآكل |

---

## طرق الحماية من التآكل

### 1. اختيار المواد المناسبة (Material Selection)
- **الفولاذ المقاوم للصدأ (Stainless Steel):** للبيئات التآكلية المعتدلة
- **سبائك النيكل (Nickel Alloys):** للبيئات شديدة التآكل
- **التيتانيوم:** للبيئات البحرية الشديدة

### 2. الطلاء الواقي (Protective Coatings)
- **الطلاء بالإيبوكسي:** حماية ممتازة من الماء والمواد الكيميائية
- **الطلاء بالزنك (Galvanizing):** حماية كاثودية للفولاذ الكربوني
- **الطلاء الداخلي (Internal Coating):** لحماية السطح الداخلي من السوائل التآكلية

### 3. الحماية الكاثودية (Cathodic Protection)
- **الأنودات المضحية (Sacrificial Anodes):** تُركَّب على المعدة وتتآكل بدلاً منها
- **التيار المفروض (Impressed Current):** تيار كهربائي يمنع التآكل

### 4. مثبطات التآكل (Corrosion Inhibitors)
- مواد كيميائية تُضاف للسوائل لتقليل معدل التآكل
- **أنواعها:** أنودية، كاثودية، مختلطة

---

## برنامج مراقبة التآكل

### أدوات المراقبة:
1. **حلقات الاختبار (Corrosion Coupons):** قطع معدنية صغيرة تُوضع في التدفق وتُفحص دورياً
2. **مجسات التآكل الإلكترونية (ER Probes):** تقيس معدل التآكل في الوقت الفعلي
3. **قياس السماكة بالموجات فوق الصوتية:** لتتبع تآكل الجدران

---

## الخلاصة

التآكل عدو صامت يعمل ببطء لكن بلا هوادة. برنامج مراقبة وحماية منظّم هو الاستثمار الأذكى لإطالة عمر معدات رأس البئر وضمان سلامة التشغيل.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو نوع التآكل الذي يُسببه ثاني أكسيد الكربون (CO₂) في معدات رأس البئر؟",
        questionTextEn: "What type of corrosion is caused by Carbon Dioxide (CO₂) in wellhead equipment?",
        correctOptionId: "a",
        explanationAr: "يُسمى التآكل الناتج عن CO₂ بالتآكل الحلو (Sweet Corrosion) لأن CO₂ يذوب في الماء ليُكوّن حمض الكربونيك الذي يُهاجم الفولاذ.",
        explanationEn: "CO₂ corrosion is called Sweet Corrosion because CO₂ dissolves in water to form carbonic acid which attacks steel.",
        options: [
          { id: "a", textAr: "التآكل الحلو (Sweet Corrosion)", textEn: "Sweet Corrosion" },
          { id: "b", textAr: "التآكل الحامض (Sour Corrosion)", textEn: "Sour Corrosion" },
          { id: "c", textAr: "التآكل الكلفاني (Galvanic Corrosion)", textEn: "Galvanic Corrosion" },
          { id: "d", textAr: "التآكل البكتيري (MIC)", textEn: "Microbiologically Influenced Corrosion (MIC)" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هو مبدأ عمل الأنودات المضحية (Sacrificial Anodes) في الحماية الكاثودية؟",
        questionTextEn: "What is the working principle of Sacrificial Anodes in cathodic protection?",
        correctOptionId: "c",
        explanationAr: "الأنودات المضحية تعمل على مبدأ التآكل الكلفاني - تُركَّب معدن أكثر نشاطاً (مثل الزنك أو الألومنيوم) يتآكل بدلاً من المعدة المراد حمايتها.",
        explanationEn: "Sacrificial anodes work on the galvanic corrosion principle - a more active metal (like zinc or aluminum) is installed that corrodes instead of the equipment to be protected.",
        options: [
          { id: "a", textAr: "تُطلق مواد كيميائية تمنع التآكل", textEn: "They release chemicals that prevent corrosion" },
          { id: "b", textAr: "تُغطي السطح المعدني بطبقة واقية", textEn: "They coat the metal surface with a protective layer" },
          { id: "c", textAr: "تتآكل بدلاً من المعدة المراد حمايتها بسبب كونها أكثر نشاطاً", textEn: "They corrode instead of the protected equipment because they are more active" },
          { id: "d", textAr: "تُطبّق تياراً كهربائياً يمنع التآكل", textEn: "They apply an electrical current that prevents corrosion" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو التأثير الإضافي الخطير لكبريتيد الهيدروجين (H₂S) على المواد المعدنية بخلاف التآكل الكيميائي؟",
        questionTextEn: "What is the additional dangerous effect of H₂S on metallic materials beyond chemical corrosion?",
        correctOptionId: "d",
        explanationAr: "H₂S يُسبّب التكسر بالإجهاد الكبريتي (SSC - Sulfide Stress Cracking) الذي يُضعف المادة ويُسبّب كسراً مفاجئاً دون تحذير مسبق.",
        explanationEn: "H₂S causes Sulfide Stress Cracking (SSC) which weakens the material and causes sudden fracture without prior warning.",
        options: [
          { id: "a", textAr: "يُسبّب تمدداً حرارياً مفرطاً", textEn: "Causes excessive thermal expansion" },
          { id: "b", textAr: "يُقلّل من موصلية الكهرباء", textEn: "Reduces electrical conductivity" },
          { id: "c", textAr: "يُسبّب تآكلاً كلفانياً مع الفولاذ المقاوم للصدأ", textEn: "Causes galvanic corrosion with stainless steel" },
          { id: "d", textAr: "يُسبّب التكسر بالإجهاد الكبريتي (SSC) الذي يُضعف المادة بشكل مفاجئ", textEn: "Causes Sulfide Stress Cracking (SSC) that suddenly weakens the material" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هي حلقات الاختبار (Corrosion Coupons) المستخدمة في مراقبة التآكل؟",
        questionTextEn: "What are Corrosion Coupons used for in corrosion monitoring?",
        correctOptionId: "b",
        explanationAr: "حلقات الاختبار هي قطع معدنية صغيرة تُوضع في التدفق وتُفحص دورياً لقياس معدل التآكل الفعلي في النظام.",
        explanationEn: "Corrosion coupons are small metal pieces placed in the flow stream and periodically inspected to measure the actual corrosion rate in the system.",
        options: [
          { id: "a", textAr: "أدوات لقياس سماكة جدران الأنابيب", textEn: "Tools for measuring pipe wall thickness" },
          { id: "b", textAr: "قطع معدنية صغيرة تُوضع في التدفق لقياس معدل التآكل الفعلي", textEn: "Small metal pieces placed in the flow to measure actual corrosion rate" },
          { id: "c", textAr: "مواد كيميائية تُضاف للسوائل لمنع التآكل", textEn: "Chemical substances added to fluids to prevent corrosion" },
          { id: "d", textAr: "أجهزة إلكترونية لكشف التسرب", textEn: "Electronic devices for leak detection" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو التآكل البكتيري (MIC) وما هي الظروف التي تُشجّع على حدوثه؟",
        questionTextEn: "What is Microbiologically Influenced Corrosion (MIC) and what conditions encourage it?",
        correctOptionId: "a",
        explanationAr: "التآكل البكتيري (MIC) تُسببه بكتيريا مختزلة للكبريتات (SRB) وتزدهر في المياه الراكدة والأماكن المعتمة.",
        explanationEn: "MIC is caused by Sulfate Reducing Bacteria (SRB) and thrives in stagnant water and dark environments.",
        options: [
          { id: "a", textAr: "تآكل تُسببه بكتيريا SRB ويزدهر في المياه الراكدة والأماكن المعتمة", textEn: "Corrosion caused by SRB bacteria, thriving in stagnant water and dark environments" },
          { id: "b", textAr: "تآكل يحدث فقط في البيئات البحرية", textEn: "Corrosion that occurs only in marine environments" },
          { id: "c", textAr: "تآكل ناتج عن التيارات الكهربائية الطائشة", textEn: "Corrosion caused by stray electrical currents" },
          { id: "d", textAr: "تآكل يحدث فقط عند درجات حرارة عالية", textEn: "Corrosion that occurs only at high temperatures" }
        ]
      }
    ]
  },
  {
    order: 9,
    titleAr: "صيانة الصمامات في رأس البئر",
    titleEn: "Wellhead Valve Maintenance",
    descriptionAr: "إجراءات الصيانة التفصيلية لجميع أنواع الصمامات المستخدمة في رأس البئر وشجرة عيد الميلاد.",
    descriptionEn: "Detailed maintenance procedures for all types of valves used in wellheads and Christmas trees.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "أنواع الصمامات وصيانتها",
        titleEn: "Valve Types and Maintenance",
        content: `# أنواع الصمامات وصيانتها في رأس البئر

## مقدمة

الصمامات هي "أعضاء التحكم" في رأس البئر. صيانتها الصحيحة تضمن التشغيل الآمن والكفء، بينما إهمالها قد يُؤدي إلى كوارث.

---

## أنواع الصمامات في رأس البئر

### 1. صمام البوابة (Gate Valve)
**الأكثر استخداماً في رأس البئر**

**مبدأ العمل:** بوابة معدنية تتحرك عمودياً لفتح أو إغلاق مسار التدفق

**المزايا:**
- ضغط سقوط منخفض عند الفتح الكامل
- مناسب للإغلاق الكامل والفتح الكامل
- متوفر بأحجام وضغوط متنوعة

**العيوب:**
- لا يُستخدم للتحكم الجزئي في التدفق
- بطيء في التشغيل (يتطلب عدة دورات)

**الصيانة الدورية:**
\`\`\`
1. تشحيم عمود الصمام وصامولة العمود
2. فحص حشوة العمود (Stem Packing) بحثاً عن التسرب
3. اختبار الإغلاق الكامل والتحقق من إحكامه
4. فحص مقعد الصمام (Valve Seat) بصرياً
5. تسجيل عدد دورات الفتح/الإغلاق
\`\`\`

### 2. صمام الكرة (Ball Valve)
**يُستخدم في خطوط الخدمة والتحكم**

**مبدأ العمل:** كرة مثقوبة تدور 90° لفتح أو إغلاق مسار التدفق

**المزايا:**
- سريع التشغيل (ربع دورة)
- إغلاق محكم ممتاز
- مناسب للتشغيل المتكرر

**الصيانة:**
- فحص مقاعد الكرة (Ball Seats) دورياً
- تشحيم محاور الكرة
- اختبار الإغلاق الكامل

### 3. صمام الخنق (Choke Valve)
**للتحكم الدقيق في معدل الإنتاج**

**أنواعه:**
| النوع | الوصف | الصيانة |
|------|-------|---------|
| **خنق ثابت (Fixed Choke)** | فتحة محددة لا تتغير | استبدال عند التآكل |
| **خنق إبري (Needle Choke)** | إبرة تتحرك لتغيير الفتحة | فحص الإبرة والمقعد |
| **خنق دوار (Rotary Choke)** | قرص دوار بفتحات متعددة | فحص القرص والمحاور |

**تحديات صيانة صمام الخنق:**
- **التآكل الشديد:** السوائل عالية السرعة تُسرّع التآكل
- **الترسبات:** ترسب الأملاح والشمع
- **الاهتزاز:** الاهتزاز الناتج عن التدفق يُسرّع التآكل

### 4. صمام الفحص (Check Valve)
**يمنع التدفق العكسي**

**الصيانة:**
- فحص عنصر الإغلاق (Disc/Ball) بحثاً عن التآكل
- التحقق من حرية الحركة
- اختبار منع التدفق العكسي

---

## إجراءات الصيانة الشاملة للصمامات

### اختبار الإغلاق (Seat Leak Test)
\`\`\`
الهدف: التحقق من إحكام الصمام عند الإغلاق

الإجراء:
1. إغلاق الصمام بالكامل
2. عزل الجانب المنبع (Upstream)
3. تفريغ الجانب المصب (Downstream)
4. رفع الضغط على الجانب المنبع
5. مراقبة الجانب المصب لمدة 15 دقيقة
6. معيار القبول: لا يوجد ارتفاع في الضغط على الجانب المصب
\`\`\`

### إصلاح مقعد الصمام (Seat Repair)
عند تآكل مقعد الصمام:
1. **الطحن (Lapping):** لإزالة الخدوش الخفيفة
2. **الاستبدال:** عند التآكل الشديد
3. **اللحام وإعادة التشكيل:** في الحالات الخاصة

---

## جدول الصيانة الدورية للصمامات

| الصمام | التكرار | الإجراء |
|-------|---------|---------|
| صمام الجذع الرئيسي | ربع سنوي | تشحيم + اختبار وظيفي |
| صمام الجناح | شهري | تشحيم + اختبار وظيفي |
| صمام الكيل | شهري | تشحيم + فحص الحشوة |
| صمام الخنق | أسبوعي | فحص التآكل + ضبط الفتحة |
| صمامات الفحص | ربع سنوي | اختبار منع التدفق العكسي |

---

## الخلاصة

صيانة الصمامات ليست مجرد تشحيم دوري، بل هي برنامج شامل يتضمن الفحص والاختبار والتوثيق. الصمام الذي يُصان بانتظام يُؤدي وظيفته بكفاءة لسنوات، بينما الصمام المهمل قد يُخذلك في اللحظة الأكثر حاجةً إليه.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو نوع الصمام الأكثر استخداماً في رأس البئر وما هي ميزته الرئيسية؟",
        questionTextEn: "What is the most commonly used valve in wellheads and what is its main advantage?",
        correctOptionId: "c",
        explanationAr: "صمام البوابة (Gate Valve) هو الأكثر استخداماً في رأس البئر، وميزته الرئيسية هي انخفاض ضغط السقوط عند الفتح الكامل.",
        explanationEn: "The Gate Valve is most commonly used in wellheads, with its main advantage being low pressure drop when fully open.",
        options: [
          { id: "a", textAr: "صمام الكرة (Ball Valve) - سرعة التشغيل", textEn: "Ball Valve - fast operation" },
          { id: "b", textAr: "صمام الفراشة (Butterfly Valve) - الحجم الصغير", textEn: "Butterfly Valve - compact size" },
          { id: "c", textAr: "صمام البوابة (Gate Valve) - انخفاض ضغط السقوط عند الفتح الكامل", textEn: "Gate Valve - low pressure drop when fully open" },
          { id: "d", textAr: "صمام الكرة (Ball Valve) - الإغلاق المحكم", textEn: "Ball Valve - tight sealing" }
        ]
      },
      {
        order: 2,
        questionTextAr: "لماذا لا يُستخدم صمام البوابة (Gate Valve) للتحكم الجزئي في التدفق؟",
        questionTextEn: "Why is a Gate Valve not used for partial flow control?",
        correctOptionId: "d",
        explanationAr: "صمام البوابة مُصمَّم للفتح الكامل أو الإغلاق الكامل فقط. الاستخدام في الوضع الجزئي يُسبّب تآكلاً شديداً للبوابة والمقعد بسبب الاضطراب في التدفق.",
        explanationEn: "Gate valves are designed for fully open or fully closed positions only. Partial use causes severe erosion of the gate and seat due to flow turbulence.",
        options: [
          { id: "a", textAr: "لأنه لا يتحمل الضغوط العالية في الوضع الجزئي", textEn: "Because it cannot withstand high pressures in partial position" },
          { id: "b", textAr: "لأنه يتطلب قوة كبيرة للتشغيل الجزئي", textEn: "Because it requires great force for partial operation" },
          { id: "c", textAr: "لأنه لا يوفر دقة كافية في التحكم", textEn: "Because it does not provide sufficient control accuracy" },
          { id: "d", textAr: "لأن الاستخدام الجزئي يُسبّب تآكلاً شديداً للبوابة والمقعد", textEn: "Because partial use causes severe erosion of the gate and seat" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو معيار القبول في اختبار الإغلاق (Seat Leak Test) للصمامات؟",
        questionTextEn: "What is the acceptance criterion for a Seat Leak Test on valves?",
        correctOptionId: "b",
        explanationAr: "معيار القبول في اختبار الإغلاق هو عدم وجود ارتفاع في الضغط على الجانب المصب (Downstream) خلال مدة الاختبار (15 دقيقة).",
        explanationEn: "The acceptance criterion for a Seat Leak Test is no pressure rise on the downstream side during the test period (15 minutes).",
        options: [
          { id: "a", textAr: "ارتفاع الضغط لا يتجاوز 5% من ضغط الاختبار", textEn: "Pressure rise not exceeding 5% of test pressure" },
          { id: "b", textAr: "لا يوجد ارتفاع في الضغط على الجانب المصب خلال 15 دقيقة", textEn: "No pressure rise on the downstream side within 15 minutes" },
          { id: "c", textAr: "انخفاض الضغط على الجانب المنبع لا يتجاوز 10%", textEn: "Upstream pressure drop not exceeding 10%" },
          { id: "d", textAr: "عدم وجود تسرب مرئي من الصمام", textEn: "No visible leakage from the valve" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هو التحدي الرئيسي في صيانة صمام الخنق (Choke Valve)؟",
        questionTextEn: "What is the main maintenance challenge for Choke Valves?",
        correctOptionId: "a",
        explanationAr: "التحدي الرئيسي في صيانة صمام الخنق هو التآكل الشديد الناتج عن السوائل عالية السرعة التي تمر عبر الفتحة الضيقة.",
        explanationEn: "The main maintenance challenge for choke valves is severe erosion caused by high-velocity fluids passing through the narrow orifice.",
        options: [
          { id: "a", textAr: "التآكل الشديد الناتج عن السوائل عالية السرعة", textEn: "Severe erosion caused by high-velocity fluids" },
          { id: "b", textAr: "صعوبة الوصول إليه في رأس البئر", textEn: "Difficulty of access in the wellhead" },
          { id: "c", textAr: "ارتفاع تكلفة قطع الغيار", textEn: "High cost of spare parts" },
          { id: "d", textAr: "الحاجة إلى تدريب متخصص لتشغيله", textEn: "Need for specialized training to operate it" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو التكرار الموصى به لصيانة صمام الجناح (Wing Valve) في رأس البئر؟",
        questionTextEn: "What is the recommended maintenance frequency for the Wing Valve in a wellhead?",
        correctOptionId: "b",
        explanationAr: "يُوصى بصيانة صمام الجناح شهرياً وتشمل التشحيم والاختبار الوظيفي للتأكد من عمله الصحيح.",
        explanationEn: "Wing valve maintenance is recommended monthly, including lubrication and functional testing to ensure proper operation.",
        options: [
          { id: "a", textAr: "يومياً", textEn: "Daily" },
          { id: "b", textAr: "شهرياً", textEn: "Monthly" },
          { id: "c", textAr: "سنوياً", textEn: "Annually" },
          { id: "d", textAr: "كل 5 سنوات", textEn: "Every 5 years" }
        ]
      }
    ]
  },
  {
    order: 10,
    titleAr: "إدارة سلامة العمليات (Process Safety Management)",
    titleEn: "Process Safety Management (PSM)",
    descriptionAr: "مبادئ وتطبيقات إدارة سلامة العمليات في منشآت النفط والغاز مع التركيز على رأس البئر.",
    descriptionEn: "Principles and applications of Process Safety Management in oil and gas facilities with focus on wellheads.",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "مبادئ PSM وتطبيقاتها",
        titleEn: "PSM Principles and Applications",
        content: `# إدارة سلامة العمليات (Process Safety Management - PSM)

## مقدمة

**إدارة سلامة العمليات (PSM)** هي منهجية شاملة لتحديد وتقييم والسيطرة على المخاطر المرتبطة بالعمليات الصناعية الخطرة. في صناعة النفط والغاز، PSM ليست مجرد متطلب تنظيمي، بل هي الإطار الذي يحمي العمال والمجتمع والبيئة.

---

## العناصر الرئيسية لـ PSM (وفق OSHA 29 CFR 1910.119)

### 1. معلومات سلامة العمليات (Process Safety Information - PSI)
توثيق شامل للمعلومات التقنية:
- **المواد الخطرة:** خصائص المواد الكيميائية المستخدمة
- **تكنولوجيا العملية:** ضغوط التشغيل، درجات الحرارة، معدلات التدفق
- **معدات العملية:** مواصفات المعدات، معايير التصميم، تاريخ الصيانة

### 2. تحليل مخاطر العملية (Process Hazard Analysis - PHA)
**الهدف:** تحديد وتقييم المخاطر المحتملة في العملية

**الأساليب الشائعة:**
| الأسلوب | الوصف | الاستخدام |
|--------|-------|-----------|
| **HAZOP** | دراسة الخطر والتشغيل | العمليات المعقدة |
| **What-If** | تحليل سيناريوهات "ماذا لو" | العمليات البسيطة |
| **FMEA** | تحليل أوضاع الفشل وتأثيراتها | المعدات الحيوية |
| **Fault Tree** | شجرة الأخطاء | الأحداث الحرجة |

### 3. إجراءات التشغيل (Operating Procedures)
- إجراءات التشغيل العادي
- إجراءات بدء التشغيل وإيقافه
- إجراءات حالات الطوارئ
- إجراءات التشغيل المؤقت

### 4. التدريب (Training)
- تدريب أولي عند التعيين
- تدريب دوري على الإجراءات والمستجدات
- تدريب على حالات الطوارئ
- توثيق التدريب وتقييم الفهم

### 5. إدارة التغيير (Management of Change - MOC)
**أحد أهم عناصر PSM**

> **إحصاء:** 40% من الحوادث الكبرى في الصناعة ناتجة عن تغييرات لم تُدار بشكل صحيح.

**ما يشمله MOC:**
- التغييرات في المعدات والمواد
- التغييرات في الإجراءات
- التغييرات في التصميم
- التغييرات المؤقتة

**عملية MOC:**
\`\`\`
1. تقديم طلب التغيير
2. تقييم المخاطر المرتبطة بالتغيير
3. الحصول على الموافقات اللازمة
4. تنفيذ التغيير وفق الإجراء المعتمد
5. تحديث الوثائق والرسومات
6. تدريب المتأثرين بالتغيير
7. إغلاق طلب التغيير
\`\`\`

### 6. التحقيق في الحوادث (Incident Investigation)
**الهدف:** الوصول إلى السبب الجذري ومنع التكرار

**مستويات التحقيق:**
- **الحوادث الكبرى:** تحقيق شامل بفريق متخصص
- **الحوادث المتوسطة:** تحقيق قسمي
- **الحوادث الصغيرة والإخفاقات القريبة (Near Misses):** تحقيق محلي

### 7. التدقيق والامتثال (Compliance Audits)
- تدقيق داخلي: كل 3 سنوات
- تدقيق خارجي: وفق متطلبات الجهات التنظيمية
- تدقيق الطرف الثالث: للمشاريع الكبرى

---

## تطبيق PSM على رأس البئر

### سيناريوهات المخاطر الرئيسية:
1. **تسرب الهيدروكربونات:** من الفلنجات أو مانعات التسرب
2. **انفجار البئر (Blowout):** فقدان السيطرة على ضغط البئر
3. **تسرب H₂S:** من الآبار الحامضة (Sour Wells)
4. **فشل معدات الأمان:** عطل في صمامات الإغلاق التلقائي

### طبقات الحماية (Layers of Protection - LOPA):
\`\`\`
الطبقة 1: التصميم الجيد (Inherently Safer Design)
الطبقة 2: الضوابط الأساسية (Basic Process Controls)
الطبقة 3: أنظمة الإنذار (Alarm Systems)
الطبقة 4: أنظمة الإغلاق التلقائي (SIS/ESD)
الطبقة 5: الحواجز المادية (Physical Barriers)
الطبقة 6: الاستجابة للطوارئ (Emergency Response)
\`\`\`

---

## الخلاصة

PSM ليست مجموعة من الأوراق والوثائق، بل هي ثقافة مؤسسية تضع السلامة في قلب كل قرار. المنشأة التي تُطبّق PSM بجدية تُقلّل من الحوادث وتُحسّن الكفاءة التشغيلية في آنٍ واحد.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هي نسبة الحوادث الكبرى في الصناعة الناتجة عن تغييرات لم تُدار بشكل صحيح؟",
        questionTextEn: "What percentage of major industrial incidents result from changes that were not properly managed?",
        correctOptionId: "c",
        explanationAr: "وفق الإحصاءات الصناعية، 40% من الحوادث الكبرى ناتجة عن تغييرات لم تُدار بشكل صحيح، مما يُبرز أهمية إدارة التغيير (MOC).",
        explanationEn: "According to industry statistics, 40% of major incidents result from changes that were not properly managed, highlighting the importance of Management of Change (MOC).",
        options: [
          { id: "a", textAr: "10%", textEn: "10%" },
          { id: "b", textAr: "25%", textEn: "25%" },
          { id: "c", textAr: "40%", textEn: "40%" },
          { id: "d", textAr: "60%", textEn: "60%" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هو أسلوب HAZOP المستخدم في تحليل مخاطر العملية؟",
        questionTextEn: "What is the HAZOP method used in Process Hazard Analysis?",
        correctOptionId: "b",
        explanationAr: "HAZOP (Hazard and Operability Study) هو دراسة منهجية للخطر والتشغيل تُستخدم للعمليات المعقدة لتحديد الانحرافات المحتملة عن التصميم وتأثيراتها.",
        explanationEn: "HAZOP (Hazard and Operability Study) is a systematic study of hazards and operability used for complex processes to identify potential deviations from design and their effects.",
        options: [
          { id: "a", textAr: "تحليل أوضاع الفشل وتأثيراتها", textEn: "Failure Mode and Effects Analysis" },
          { id: "b", textAr: "دراسة منهجية للخطر والتشغيل للعمليات المعقدة", textEn: "Systematic study of hazards and operability for complex processes" },
          { id: "c", textAr: "تحليل سيناريوهات 'ماذا لو' للعمليات البسيطة", textEn: "'What-If' scenario analysis for simple processes" },
          { id: "d", textAr: "شجرة الأخطاء للأحداث الحرجة", textEn: "Fault tree analysis for critical events" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو الغرض الرئيسي من التحقيق في الحوادث (Incident Investigation) في PSM؟",
        questionTextEn: "What is the main purpose of Incident Investigation in PSM?",
        correctOptionId: "d",
        explanationAr: "الغرض الرئيسي من التحقيق في الحوادث هو الوصول إلى السبب الجذري ومنع تكرار الحادثة، وليس إيجاد من يُلام.",
        explanationEn: "The main purpose of incident investigation is to reach the root cause and prevent recurrence, not to find someone to blame.",
        options: [
          { id: "a", textAr: "تحديد المسؤول عن الحادثة وتوجيه اللوم إليه", textEn: "Identifying who is responsible and assigning blame" },
          { id: "b", textAr: "تقدير تكلفة الأضرار الناتجة عن الحادثة", textEn: "Estimating the cost of damage from the incident" },
          { id: "c", textAr: "تقديم تقرير للجهات التنظيمية", textEn: "Submitting a report to regulatory authorities" },
          { id: "d", textAr: "الوصول إلى السبب الجذري ومنع تكرار الحادثة", textEn: "Reaching the root cause and preventing recurrence" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هو التكرار الموصى به للتدقيق الداخلي في PSM؟",
        questionTextEn: "What is the recommended frequency for internal PSM audits?",
        correctOptionId: "b",
        explanationAr: "وفق متطلبات OSHA PSM، يجب إجراء تدقيق امتثال داخلي كل 3 سنوات على الأقل.",
        explanationEn: "Per OSHA PSM requirements, a compliance audit must be conducted at least every 3 years.",
        options: [
          { id: "a", textAr: "سنوياً", textEn: "Annually" },
          { id: "b", textAr: "كل 3 سنوات", textEn: "Every 3 years" },
          { id: "c", textAr: "كل 5 سنوات", textEn: "Every 5 years" },
          { id: "d", textAr: "عند وقوع حادثة فقط", textEn: "Only when an incident occurs" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو عنصر إدارة التغيير (MOC) في PSM؟",
        questionTextEn: "What is the Management of Change (MOC) element in PSM?",
        correctOptionId: "a",
        explanationAr: "إدارة التغيير (MOC) هي عملية منظّمة لتقييم والموافقة على أي تغيير في المعدات أو الإجراءات أو التصميم قبل تنفيذه، لضمان عدم إدخال مخاطر جديدة.",
        explanationEn: "Management of Change (MOC) is a structured process for evaluating and approving any change in equipment, procedures, or design before implementation to ensure no new hazards are introduced.",
        options: [
          { id: "a", textAr: "عملية منظّمة لتقييم والموافقة على أي تغيير قبل تنفيذه لضمان عدم إدخال مخاطر جديدة", textEn: "A structured process for evaluating and approving any change before implementation to ensure no new hazards are introduced" },
          { id: "b", textAr: "إجراء لتغيير الموظفين والمسؤوليات في المنشأة", textEn: "A procedure for changing employees and responsibilities in the facility" },
          { id: "c", textAr: "برنامج لتحديث المعدات القديمة بمعدات حديثة", textEn: "A program for upgrading old equipment with new equipment" },
          { id: "d", textAr: "خطة لتغيير إجراءات الطوارئ بشكل دوري", textEn: "A plan for periodically changing emergency procedures" }
        ]
      }
    ]
  },
  {
    order: 11,
    titleAr: "تقنيات التدخل في البئر (Well Intervention)",
    titleEn: "Well Intervention Techniques",
    descriptionAr: "تقنيات وإجراءات التدخل في البئر عبر رأس البئر، بما يشمل الكابل السلكي والأنبوب الملفوف وعمليات الضخ.",
    descriptionEn: "Well intervention techniques and procedures through the wellhead, including wireline, coiled tubing, and pumping operations.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "أنواع عمليات التدخل في البئر",
        titleEn: "Types of Well Intervention Operations",
        content: `# أنواع عمليات التدخل في البئر

## مقدمة

**التدخل في البئر (Well Intervention)** هو أي عملية تُنفَّذ على بئر منتجة أو محقونة لتحسين أدائها أو إصلاح مشكلة أو جمع بيانات. تتم هذه العمليات عبر رأس البئر دون الحاجة لإزالة عمود أنبوب الإنتاج.

---

## أنواع التدخل في البئر

### 1. الكابل السلكي (Wireline)
**الأكثر استخداماً وأقلها تكلفةً**

**تعريفه:** كابل معدني رفيع يُستخدم لإنزال ورفع الأدوات داخل البئر

**أنواعه:**
| النوع | الوصف | الاستخدام |
|------|-------|-----------|
| **الكابل الأحادي (Slickline)** | كابل صلب أحادي الخيط | الأعمال الميكانيكية البسيطة |
| **الكابل الكهربائي (Electric Line/E-Line)** | كابل متعدد الأسلاك مع موصلات كهربائية | التسجيل وجمع البيانات |

**تطبيقات Slickline:**
- تركيب وإزالة البلاغات (Plugs)
- فتح وإغلاق صمامات الإنتاج
- قياس عمق السوائل
- إزالة الترسبات (Paraffin, Scale)

**تطبيقات E-Line:**
- تسجيل الضغط ودرجة الحرارة
- قياس معدل الإنتاج (Production Logging)
- تصوير جدار البئر (Borehole Imaging)
- فحص تماسك الأسمنت (Cement Bond Log)

### 2. الأنبوب الملفوف (Coiled Tubing - CT)
**للعمليات التي تتطلب ضخ السوائل**

**تعريفه:** أنبوب فولاذي مرن ملفوف على بكرة كبيرة، يُنزَل داخل البئر وهو مستمر (بدون وصلات)

**المزايا:**
- إمكانية الضخ أثناء التشغيل (Live Well Operations)
- لا توجد وصلات (أكثر أماناً)
- سرعة التشغيل أعلى من الحفر التقليدي

**التطبيقات:**
- **تحفيز البئر (Stimulation):** ضخ الحمض (Acid Stimulation)
- **تنظيف البئر (Well Cleanout):** إزالة الرمل والترسبات
- **الحفر بالأنبوب الملفوف (CT Drilling):** للتعمق في الآبار الحالية
- **ضخ النيتروجين:** لرفع السوائل من البئر

### 3. وحدة الضخ (Pumping Unit / Workover Unit)
**للعمليات الثقيلة**

**التطبيقات:**
- **الإسمنت الضاغط (Squeeze Cementing):** لإصلاح تسرب الأسمنت
- **الكسر الهيدروليكي (Hydraulic Fracturing):** لتحسين الإنتاجية
- **ضخ المواد الكيميائية:** للمعالجة الكيميائية

---

## معدات التدخل عبر رأس البئر

### مانع الانفجار للتدخل (Intervention BOP)
يُركَّب فوق رأس البئر أثناء عمليات التدخل لمنع التدفق غير المتحكم به:
- **BOP للكابل السلكي:** مُصمَّم للكابل الرفيع
- **BOP للأنبوب الملفوف:** مُصمَّم للأنبوب الملفوف

### رأس الحقن (Stuffing Box / Grease Injection Head)
- يُحكم الإغلاق حول الكابل أو الأنبوب أثناء التشغيل
- يمنع تسرب السوائل والغازات إلى الخارج

---

## اعتبارات السلامة في التدخل

### قبل بدء العمل:
1. التحقق من ضغط البئر وتوقعاته
2. التأكد من جاهزية معدات التحكم في البئر
3. فحص الكابل أو الأنبوب قبل الإنزال
4. التحقق من صلاحية معدات السلامة الشخصية

### أثناء العمل:
1. مراقبة مستمرة لضغط الرأس
2. التواصل المستمر مع مركز التحكم
3. الالتزام بحدود الوزن والشد المحددة
4. الاستعداد للإغلاق الطارئ في أي وقت

---

## الخلاصة

عمليات التدخل في البئر هي أدوات قوية لتحسين أداء الآبار وإطالة عمرها الإنتاجي. إتقانها يتطلب فهماً عميقاً للمعدات والإجراءات ومتطلبات السلامة.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو الفرق الرئيسي بين Slickline وElectric Line (E-Line)؟",
        questionTextEn: "What is the main difference between Slickline and Electric Line (E-Line)?",
        correctOptionId: "c",
        explanationAr: "Slickline هو كابل صلب أحادي الخيط يُستخدم للأعمال الميكانيكية البسيطة، بينما E-Line هو كابل متعدد الأسلاك مع موصلات كهربائية يُستخدم للتسجيل وجمع البيانات.",
        explanationEn: "Slickline is a solid single-strand cable used for simple mechanical work, while E-Line is a multi-conductor cable with electrical conductors used for logging and data collection.",
        options: [
          { id: "a", textAr: "Slickline أقوى وأثقل من E-Line", textEn: "Slickline is stronger and heavier than E-Line" },
          { id: "b", textAr: "E-Line يُستخدم فقط في الآبار البحرية", textEn: "E-Line is used only in offshore wells" },
          { id: "c", textAr: "Slickline للأعمال الميكانيكية البسيطة، وE-Line للتسجيل وجمع البيانات الكهربائية", textEn: "Slickline for simple mechanical work; E-Line for logging and electrical data collection" },
          { id: "d", textAr: "لا يوجد فرق وظيفي بينهما", textEn: "No functional difference between them" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هي الميزة الرئيسية للأنبوب الملفوف (Coiled Tubing) مقارنةً بالحفر التقليدي؟",
        questionTextEn: "What is the main advantage of Coiled Tubing compared to conventional drilling?",
        correctOptionId: "b",
        explanationAr: "الميزة الرئيسية للأنبوب الملفوف هي إمكانية الضخ أثناء التشغيل (Live Well Operations) دون الحاجة لإيقاف الإنتاج، إضافةً إلى عدم وجود وصلات.",
        explanationEn: "The main advantage of coiled tubing is the ability to pump during live well operations without stopping production, plus the absence of connections.",
        options: [
          { id: "a", textAr: "أرخص تكلفةً من الكابل السلكي", textEn: "Cheaper than wireline" },
          { id: "b", textAr: "إمكانية الضخ أثناء التشغيل (Live Well) دون إيقاف الإنتاج", textEn: "Ability to pump during live well operations without stopping production" },
          { id: "c", textAr: "يمكن استخدامه في الآبار ذات الضغط المنخفض فقط", textEn: "Can only be used in low-pressure wells" },
          { id: "d", textAr: "لا يتطلب معدات خاصة للتشغيل", textEn: "Does not require special equipment for operation" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هو الغرض من رأس الحقن (Stuffing Box) في عمليات التدخل؟",
        questionTextEn: "What is the purpose of the Stuffing Box in well intervention operations?",
        correctOptionId: "d",
        explanationAr: "رأس الحقن (Stuffing Box) يُحكم الإغلاق حول الكابل أو الأنبوب أثناء التشغيل لمنع تسرب السوائل والغازات من البئر إلى الخارج.",
        explanationEn: "The Stuffing Box seals around the cable or tubing during operations to prevent leakage of fluids and gases from the well to the outside.",
        options: [
          { id: "a", textAr: "قياس وزن الكابل أثناء الإنزال", textEn: "Measuring cable weight during running" },
          { id: "b", textAr: "توجيه الكابل إلى مركز البئر", textEn: "Guiding the cable to the well center" },
          { id: "c", textAr: "تسجيل عمق الأداة داخل البئر", textEn: "Recording tool depth inside the well" },
          { id: "d", textAr: "إحكام الإغلاق حول الكابل أو الأنبوب لمنع تسرب السوائل والغازات", textEn: "Sealing around cable or tubing to prevent fluid and gas leakage" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هو تطبيق تحفيز البئر (Stimulation) باستخدام الأنبوب الملفوف؟",
        questionTextEn: "What is the well stimulation application using Coiled Tubing?",
        correctOptionId: "a",
        explanationAr: "تحفيز البئر باستخدام الأنبوب الملفوف يشمل ضخ الحمض (Acid Stimulation) لإذابة الترسبات وتحسين نفاذية التكوين وزيادة معدل الإنتاج.",
        explanationEn: "Well stimulation using coiled tubing includes acid stimulation (pumping acid) to dissolve deposits and improve formation permeability to increase production rate.",
        options: [
          { id: "a", textAr: "ضخ الحمض (Acid Stimulation) لإذابة الترسبات وتحسين نفاذية التكوين", textEn: "Acid Stimulation to dissolve deposits and improve formation permeability" },
          { id: "b", textAr: "تسجيل الضغط ودرجة الحرارة داخل البئر", textEn: "Recording pressure and temperature inside the well" },
          { id: "c", textAr: "تركيب وإزالة البلاغات (Plugs) داخل البئر", textEn: "Installing and removing plugs inside the well" },
          { id: "d", textAr: "فحص تماسك الأسمنت خلف الغلاف", textEn: "Checking cement bond behind casing" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو الإجراء الأول قبل بدء أي عملية تدخل في البئر؟",
        questionTextEn: "What is the first step before starting any well intervention operation?",
        correctOptionId: "b",
        explanationAr: "الإجراء الأول قبل بدء أي عملية تدخل هو التحقق من ضغط البئر وتوقعاته لتحديد المخاطر المحتملة وتجهيز معدات التحكم المناسبة.",
        explanationEn: "The first step before any intervention is to verify well pressure and expectations to identify potential hazards and prepare appropriate control equipment.",
        options: [
          { id: "a", textAr: "تجهيز الأدوات والمعدات المطلوبة", textEn: "Preparing required tools and equipment" },
          { id: "b", textAr: "التحقق من ضغط البئر وتوقعاته", textEn: "Verifying well pressure and expectations" },
          { id: "c", textAr: "إخطار الجهات التنظيمية بالعملية", textEn: "Notifying regulatory authorities of the operation" },
          { id: "d", textAr: "تدريب الفريق على إجراءات العمل", textEn: "Training the team on work procedures" }
        ]
      }
    ]
  },
  {
    order: 12,
    titleAr: "الاتجاهات الحديثة في صيانة رأس البئر",
    titleEn: "Modern Trends in Wellhead Maintenance",
    descriptionAr: "أحدث التقنيات والاتجاهات في صيانة رأس البئر، بما يشمل الرقمنة والذكاء الاصطناعي والصيانة التنبؤية.",
    descriptionEn: "Latest technologies and trends in wellhead maintenance, including digitalization, artificial intelligence, and predictive maintenance.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    lessons: [
      {
        order: 1,
        titleAr: "الرقمنة والصيانة التنبؤية",
        titleEn: "Digitalization and Predictive Maintenance",
        content: `# الرقمنة والصيانة التنبؤية في رأس البئر

## مقدمة

نحن نعيش ثورةً تقنيةً في صناعة النفط والغاز، حيث تُحوّل تقنيات الرقمنة والذكاء الاصطناعي طريقة صيانة رأس البئر من نهج تفاعلي إلى نهج استباقي تنبؤي.

---

## الصيانة التنبؤية (Predictive Maintenance - PdM)

**التعريف:** استخدام البيانات والتحليلات للتنبؤ بالأعطال قبل وقوعها

**الفرق بين أنواع الصيانة:**

| النوع | المبدأ | التكلفة | الكفاءة |
|------|-------|---------|---------|
| **تفاعلية (Reactive)** | الإصلاح بعد العطل | عالية | منخفضة |
| **وقائية (Preventive)** | الصيانة وفق الجدول | متوسطة | متوسطة |
| **تنبؤية (Predictive)** | الصيانة عند الحاجة الفعلية | منخفضة | عالية |

---

## تقنيات الرقمنة في رأس البئر

### 1. أجهزة الاستشعار الذكية (Smart Sensors)
- **أجهزة استشعار الضغط الذكية:** قياس مستمر مع إرسال البيانات لاسلكياً
- **أجهزة استشعار الاهتزاز:** للكشف المبكر عن تآكل الصمامات
- **أجهزة استشعار التسرب:** كشف فوري للتسرب قبل أن يتطور
- **أجهزة استشعار درجة الحرارة:** مراقبة الحرارة في نقاط حرجة

### 2. إنترنت الأشياء الصناعي (Industrial IoT - IIoT)
**ربط جميع معدات رأس البئر بشبكة بيانات مركزية:**

\`\`\`
رأس البئر → أجهزة الاستشعار → بوابة IoT → السحابة → مركز التحكم
\`\`\`

**الفوائد:**
- مراقبة لحظية (Real-time Monitoring) من أي مكان
- تنبيهات فورية عند تجاوز الحدود
- تسجيل تاريخي شامل للبيانات
- تحليل الاتجاهات والأنماط

### 3. الذكاء الاصطناعي والتعلم الآلي (AI/ML)
**تطبيقات في صيانة رأس البئر:**

- **التنبؤ بأعطال الصمامات:** تحليل أنماط الاهتزاز والضغط للتنبؤ بالعطل قبل 2-4 أسابيع
- **تحسين جداول الصيانة:** توصيات مخصصة لكل بئر بناءً على بياناتها الفعلية
- **كشف الشذوذات (Anomaly Detection):** تحديد السلوك غير الطبيعي قبل أن يتطور

### 4. التوأم الرقمي (Digital Twin)
**نسخة رقمية كاملة من رأس البئر:**

- **المحاكاة:** اختبار سيناريوهات الصيانة رقمياً قبل التطبيق
- **التحسين:** تحسين معلمات التشغيل لتعظيم الإنتاج
- **التدريب:** تدريب الفنيين على بيئة افتراضية آمنة

---

## الروبوتات والتشغيل عن بُعد

### الروبوتات المتنقلة (Mobile Robots)
- **الفحص الآلي:** روبوتات تُجري الفحص البصري وتُرسل الصور
- **الفحص بالموجات فوق الصوتية الآلي:** قياس السماكة دون تدخل بشري
- **الطائرات المسيّرة (Drones):** فحص المناطق الصعبة الوصول

### التشغيل عن بُعد (Remote Operations)
- **مراكز التحكم المتكاملة:** إدارة مئات الآبار من مركز واحد
- **الصيانة الافتراضية:** توجيه الفنيين عن بُعد باستخدام الواقع المعزز (AR)
- **الإغلاق الطارئ عن بُعد:** تفعيل ESD من مركز التحكم

---

## مستقبل صيانة رأس البئر

### الاتجاهات القادمة:
1. **الصيانة الذاتية (Self-Healing Equipment):** معدات قادرة على إصلاح بعض الأعطال ذاتياً
2. **الطباعة ثلاثية الأبعاد (3D Printing):** طباعة قطع الغيار في الموقع
3. **الهيدروجين الأخضر:** تكيّف معدات رأس البئر مع وقود المستقبل
4. **الحوسبة الكمية (Quantum Computing):** تحليل بيانات ضخمة لتحسين الصيانة

---

## الخلاصة

الرقمنة والذكاء الاصطناعي لا يُلغيان دور الفني البشري، بل يُعزّزانه. الفني المحترف في المستقبل هو من يُجيد استخدام هذه التقنيات ويُفسّر بياناتها ويتخذ القرارات المناسبة بناءً عليها. الاستثمار في تعلم هذه التقنيات اليوم هو استثمار في مستقبل مهني مزدهر.`
      }
    ],
    quizQuestions: [
      {
        order: 1,
        questionTextAr: "ما هو الفرق الرئيسي بين الصيانة التنبؤية (PdM) والصيانة الوقائية (PM)؟",
        questionTextEn: "What is the main difference between Predictive Maintenance (PdM) and Preventive Maintenance (PM)?",
        correctOptionId: "b",
        explanationAr: "الصيانة التنبؤية تُنفَّذ عند الحاجة الفعلية بناءً على بيانات الحالة الفعلية للمعدة، بينما الصيانة الوقائية تُنفَّذ وفق جداول زمنية ثابتة بغض النظر عن الحالة الفعلية.",
        explanationEn: "Predictive maintenance is performed based on actual equipment condition data when actually needed, while preventive maintenance is performed on fixed schedules regardless of actual condition.",
        options: [
          { id: "a", textAr: "الصيانة التنبؤية أغلى تكلفةً من الوقائية", textEn: "Predictive maintenance is more expensive than preventive" },
          { id: "b", textAr: "الصيانة التنبؤية تُنفَّذ عند الحاجة الفعلية بناءً على البيانات، والوقائية وفق جداول ثابتة", textEn: "Predictive maintenance is performed when actually needed based on data; preventive follows fixed schedules" },
          { id: "c", textAr: "الصيانة الوقائية أكثر دقةً وكفاءةً من التنبؤية", textEn: "Preventive maintenance is more accurate and efficient than predictive" },
          { id: "d", textAr: "لا يوجد فرق جوهري بينهما", textEn: "No fundamental difference between them" }
        ]
      },
      {
        order: 2,
        questionTextAr: "ما هو التوأم الرقمي (Digital Twin) في سياق صيانة رأس البئر؟",
        questionTextEn: "What is a Digital Twin in the context of wellhead maintenance?",
        correctOptionId: "d",
        explanationAr: "التوأم الرقمي هو نسخة رقمية كاملة من رأس البئر تُستخدم للمحاكاة والتحسين والتدريب، مما يُتيح اختبار سيناريوهات الصيانة رقمياً قبل التطبيق الفعلي.",
        explanationEn: "A Digital Twin is a complete digital replica of the wellhead used for simulation, optimization, and training, allowing maintenance scenarios to be tested digitally before actual implementation.",
        options: [
          { id: "a", textAr: "نسخة احتياطية من بيانات رأس البئر", textEn: "A backup copy of wellhead data" },
          { id: "b", textAr: "رسومات هندسية رقمية لرأس البئر", textEn: "Digital engineering drawings of the wellhead" },
          { id: "c", textAr: "نظام مراقبة إلكتروني لرأس البئر", textEn: "An electronic monitoring system for the wellhead" },
          { id: "d", textAr: "نسخة رقمية كاملة من رأس البئر للمحاكاة والتحسين والتدريب", textEn: "A complete digital replica of the wellhead for simulation, optimization, and training" }
        ]
      },
      {
        order: 3,
        questionTextAr: "ما هي الفائدة الرئيسية من إنترنت الأشياء الصناعي (IIoT) في صيانة رأس البئر؟",
        questionTextEn: "What is the main benefit of Industrial IoT (IIoT) in wellhead maintenance?",
        correctOptionId: "a",
        explanationAr: "الفائدة الرئيسية من IIoT هي المراقبة اللحظية (Real-time Monitoring) من أي مكان مع تنبيهات فورية عند تجاوز الحدود، مما يُتيح التدخل السريع.",
        explanationEn: "The main benefit of IIoT is real-time monitoring from anywhere with immediate alerts when limits are exceeded, enabling rapid intervention.",
        options: [
          { id: "a", textAr: "المراقبة اللحظية من أي مكان مع تنبيهات فورية عند تجاوز الحدود", textEn: "Real-time monitoring from anywhere with immediate alerts when limits are exceeded" },
          { id: "b", textAr: "تقليل عدد الفنيين المطلوبين للصيانة", textEn: "Reducing the number of technicians needed for maintenance" },
          { id: "c", textAr: "استبدال جميع المعدات القديمة بمعدات ذكية", textEn: "Replacing all old equipment with smart equipment" },
          { id: "d", textAr: "إلغاء الحاجة للصيانة الدورية", textEn: "Eliminating the need for periodic maintenance" }
        ]
      },
      {
        order: 4,
        questionTextAr: "ما هو دور الذكاء الاصطناعي في التنبؤ بأعطال صمامات رأس البئر؟",
        questionTextEn: "What is the role of AI in predicting wellhead valve failures?",
        correctOptionId: "c",
        explanationAr: "الذكاء الاصطناعي يُحلّل أنماط الاهتزاز والضغط وغيرها من البيانات للتنبؤ بالعطل قبل 2-4 أسابيع من وقوعه، مما يُتيح التخطيط للصيانة مسبقاً.",
        explanationEn: "AI analyzes vibration patterns, pressure, and other data to predict failures 2-4 weeks before they occur, enabling advance maintenance planning.",
        options: [
          { id: "a", textAr: "يُصلح الأعطال تلقائياً دون تدخل بشري", textEn: "Automatically repairs failures without human intervention" },
          { id: "b", textAr: "يُحدّد سعر قطع الغيار المطلوبة", textEn: "Determines the price of required spare parts" },
          { id: "c", textAr: "يُحلّل أنماط البيانات للتنبؤ بالعطل قبل 2-4 أسابيع من وقوعه", textEn: "Analyzes data patterns to predict failures 2-4 weeks before they occur" },
          { id: "d", textAr: "يُنفّذ الصيانة الدورية وفق الجدول الزمني", textEn: "Executes periodic maintenance per schedule" }
        ]
      },
      {
        order: 5,
        questionTextAr: "ما هو دور الفني البشري في ظل تقنيات الرقمنة والذكاء الاصطناعي؟",
        questionTextEn: "What is the role of the human technician in the era of digitalization and AI?",
        correctOptionId: "b",
        explanationAr: "الرقمنة والذكاء الاصطناعي لا يُلغيان دور الفني البشري، بل يُعزّزانه. الفني المحترف هو من يُجيد استخدام هذه التقنيات ويُفسّر بياناتها ويتخذ القرارات المناسبة.",
        explanationEn: "Digitalization and AI do not eliminate the human technician's role but enhance it. The professional technician is one who masters these technologies, interprets their data, and makes appropriate decisions.",
        options: [
          { id: "a", textAr: "سيُستغنى عن الفنيين البشريين بالكامل في المستقبل", textEn: "Human technicians will be completely replaced in the future" },
          { id: "b", textAr: "الفني المحترف يُجيد استخدام هذه التقنيات ويُفسّر بياناتها ويتخذ القرارات المناسبة", textEn: "The professional technician masters these technologies, interprets their data, and makes appropriate decisions" },
          { id: "c", textAr: "الفنيون مطلوبون فقط لإصلاح الأعطال الميكانيكية", textEn: "Technicians are only needed for mechanical fault repair" },
          { id: "d", textAr: "دور الفني يقتصر على مراقبة الشاشات فقط", textEn: "The technician's role is limited to monitoring screens only" }
        ]
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// INSERT DATA
// ─────────────────────────────────────────────────────────────────────────────

let totalModules = 0, totalLessons = 0, totalQuestions = 0;

for (const mod of modules) {
  // Insert module
  const [modResult] = await connection.execute(
    `INSERT INTO modules (course_id, module_number, \`order\`, title_ar, title_en, description_ar, description_en, created_at)
     VALUES (2, ?, ?, ?, ?, ?, ?, NOW())`,
    [mod.order, mod.order, mod.titleAr, mod.titleEn, mod.descriptionAr, mod.descriptionEn]
  );
  const moduleId = modResult.insertId;
  totalModules++;

  // Insert lessons
  for (const lesson of mod.lessons) {
    await connection.execute(
      `INSERT INTO lessons (module_id, lesson_number, \`order\`, title_ar, title_en, content_markdown, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [moduleId, lesson.order, lesson.order, lesson.titleAr, lesson.titleEn, lesson.content]
    );
    totalLessons++;
  }

  // Insert quiz questions
  for (const q of mod.quizQuestions) {
    await connection.execute(
      `INSERT INTO quiz_questions (module_id, \`order\`, question_text_ar, question_text_en, correct_option_id, explanation_ar, explanation_en, options_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [moduleId, q.order, q.questionTextAr, q.questionTextEn, q.correctOptionId, q.explanationAr, q.explanationEn, JSON.stringify(q.options)]
    );
    totalQuestions++;
  }

  console.log(`✅ Module ${mod.order}: "${mod.titleEn}" - ${mod.lessons.length} lessons, ${mod.quizQuestions.length} questions`);
}

console.log(`\n🎉 Wellhead Maintenance course seeded successfully!`);
console.log(`   📚 ${totalModules} modules`);
console.log(`   📖 ${totalLessons} lessons`);
console.log(`   ❓ ${totalQuestions} quiz questions`);

await connection.end();
