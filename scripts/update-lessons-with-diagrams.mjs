import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const diagramUrls = {
  "unit1_oil_gas_value_chain": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/PZkUPKakfbMLdrdK.png",
  "unit1_field_lifecycle": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/fLHiYgHpKqSRrnIV.png",
  "unit2_three_phase_separator": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/IhFMkrWHcdWYEMDB.png",
  "unit3_crude_oil_stabilization": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/QTTlhdcvOCpWyIRT.png",
  "unit4_glycol_dehydration": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/yNrbhRCpDCcWrhDO.png",
  "unit5_compression_system": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/VhILsHmnvVkdgbkQ.png",
  "unit6_storage_tank_types": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/CwIyMzXMQyXSTCHZ.png",
  "unit6_fire_gas_system": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FFOmrlVhCQdzPOpG.png",
  "unit7_separator_sizing_diagram": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FutzncTDMLlZwRPK.png",
  "unit9_epf_complete_layout": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/nolpKKPNscmGePHp.png"
};

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Mapping of lessons to diagrams
const lessonDiagrams = [
  { moduleId: 1, order: 1, diagram: "unit1_oil_gas_value_chain", caption: "سلسلة القيمة في صناعة النفط والغاز (Oil and Gas Value Chain)" },
  { moduleId: 1, order: 2, diagram: "unit1_field_lifecycle", caption: "دورة حياة الحقل النفطي (Oilfield Lifecycle Phases)" },
  { moduleId: 2, order: 3, diagram: "unit2_three_phase_separator", caption: "مقطع عرضي لفاصل ثلاثي الأطوار (Three-Phase Separator Cutaway)" },
  { moduleId: 3, order: 2, diagram: "unit3_crude_oil_stabilization", caption: "نظام استقرار النفط الخام (Crude Oil Stabilization System)" },
  { moduleId: 4, order: 1, diagram: "unit4_glycol_dehydration", caption: "وحدة تجفيف الغاز بالجليكول (TEG Dehydration Unit)" },
  { moduleId: 5, order: 2, diagram: "unit5_compression_system", caption: "نظام ضغط الغاز متعدد المراحل (Multi-Stage Gas Compression System)" },
  { moduleId: 6, order: 1, diagram: "unit6_storage_tank_types", caption: "أنواع خزانات التخزين (Storage Tank Types Comparison)" },
  { moduleId: 6, order: 4, diagram: "unit6_fire_gas_system", caption: "نظام الكشف عن الحريق والغاز (Fire & Gas Detection System Layout)" },
  { moduleId: 7, order: 2, diagram: "unit7_separator_sizing_diagram", caption: "مبادئ تصميم الفواصل (Separator Sizing Principles)" },
  { moduleId: 9, order: 1, diagram: "unit9_epf_complete_layout", caption: "مخطط منشأة EPF الكامل (Complete EPF Facility Layout)" },
];

for (const mapping of lessonDiagrams) {
  const diagramUrl = diagramUrls[mapping.diagram];
  
  // Get the lesson
  const [lessons] = await connection.execute(
    'SELECT id, content_markdown FROM lessons WHERE module_id = ? AND `order` = ?',
    [mapping.moduleId, mapping.order]
  );
  
  if (lessons.length > 0) {
    const lesson = lessons[0];
    const diagramMarkdown = `\n\n![${mapping.caption}](${diagramUrl})\n*${mapping.caption}*\n\n`;
    
    // Insert diagram after the first heading or at the beginning
    let updatedContent = lesson.content_markdown || '';
    const firstHeadingIndex = updatedContent.indexOf('\n##');
    
    if (firstHeadingIndex > 0) {
      const insertPosition = updatedContent.indexOf('\n', firstHeadingIndex + 1);
      updatedContent = updatedContent.slice(0, insertPosition) + diagramMarkdown + updatedContent.slice(insertPosition);
    } else {
      updatedContent = diagramMarkdown + updatedContent;
    }
    
    await connection.execute(
      'UPDATE lessons SET content_markdown = ? WHERE id = ?',
      [updatedContent, lesson.id]
    );
    
    console.log(`✅ Updated Module ${mapping.moduleId}, Lesson ${mapping.order} with ${mapping.diagram}`);
  }
}

console.log('\n✅ All lessons updated with diagrams!');
await connection.end();
