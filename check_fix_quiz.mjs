import mysql from 'mysql2/promise';

// The correct answers as originally defined in the Arabic content
// Key: question id, Value: correct option id (a, b, c, or d)
const correctAnswers = {
  43: "c", // Transporting crude oil via pipeline = Midstream
  44: "b", // Reduce uncertainty about reservoir size
  45: "b", // Atmospheric Distillation Tower is NOT part of EPF
  46: "c", // Achieve early cash flow
  47: "b", // Small field with uncertainty
  48: "b", // EPF used first, then CPF built based on data
  49: "c", // Very small droplets make separation harder
  50: "c", // Residence Time = 20/4 = 5 minutes
  51: "c", // Three-phase separator separates gas, oil, and water
  52: "b", // Mist extractor removes liquid droplets from gas
  53: "b", // Stable emulsion causes high BS&W
  54: "b", // Vertical separator for offshore (small footprint)
  55: "b", // Hydrates plug pipelines and valves
  56: "b", // TEG removes water vapor from gas
  57: "c", // MDEA is selective for H2S
  58: "b", // HCDP = temperature at which heavy hydrocarbons condense
  59: "b", // DGF for small oil droplets from produced water
  60: "b", // Re-injection is most sustainable
  61: "b", // Heat exchanger transfers heat without mixing fluids
  62: "b", // Reciprocating compressor for high compression ratios
  63: "b", // Cogeneration generates electricity and heat from same fuel
  64: "b", // Compressed air doesn't cause sparks = safe in explosive atmospheres
  65: "c", // Instrument air must be dry, clean, oil-free
  66: "b", // Compressed air failure → safety valves close → facility shutdown
  67: "b", // Floating roof tanks reduce vapor losses
  68: "b", // Fiscal metering = measure quantity sold for revenues/taxes
  69: "a", // 4th layer = Good design (actually layer 1, but per original data)
  70: "c", // ESD activated at 40-50% LEL
  71: "b", // Foam system for flammable liquid fires
  72: "b", // HAZOP = structured study to identify hazards in design phase
  73: "b", // Design Basis Document (DBD)
  74: "b", // Separator diameter determined by allowable gas velocity
  75: "b", // LMTD = Log Mean Temperature Difference
  76: "b", // TDH = energy pump must provide, measured in length
  77: "b", // 5-10 ft/s for discharge lines
  78: "c", // Stainless steel more resistant to corrosion
  79: "b", // First phase = Mechanical Completion & Testing
  80: "b", // Nitrogen purging removes air, prevents explosive mixture
  81: "c", // Predictive maintenance monitors condition continuously
  82: "b", // Vibration analysis detects imbalance/bearing wear
  83: "b", // Increase treater temperature to fix high BS&W
  84: "b", // First step = gather information and define symptoms
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  const [rows] = await conn.execute('SELECT id, question_text_en, question_text_ar, correct_option_id, options_json FROM quiz_questions ORDER BY id');
  
  console.log(`Checking ${rows.length} questions...\n`);
  
  let fixCount = 0;
  
  for (const row of rows) {
    const opts = typeof row.options_json === 'string' ? JSON.parse(row.options_json) : row.options_json;
    const optIds = opts.map(o => o.id);
    const currentCorrect = row.correct_option_id;
    const expectedCorrect = correctAnswers[row.id];
    
    if (!expectedCorrect) {
      console.log(`⚠️  No expected answer defined for question ${row.id}`);
      continue;
    }
    
    if (currentCorrect !== expectedCorrect) {
      console.log(`❌ MISMATCH Question ${row.id}:`);
      console.log(`   Q: ${(row.question_text_en || row.question_text_ar || '').substring(0, 70)}`);
      console.log(`   Current correct_option_id: "${currentCorrect}"`);
      console.log(`   Expected correct_option_id: "${expectedCorrect}"`);
      console.log(`   Available options: ${optIds.join(', ')}`);
      
      // Show what each option says
      opts.forEach(o => {
        const marker = o.id === expectedCorrect ? ' ← CORRECT' : '';
        console.log(`   [${o.id}] ${(o.textEn || o.textAr || '').substring(0, 60)}${marker}`);
      });
      
      // Fix it
      await conn.execute('UPDATE quiz_questions SET correct_option_id = ? WHERE id = ?', [expectedCorrect, row.id]);
      console.log(`   ✅ Fixed: set correct_option_id to "${expectedCorrect}"\n`);
      fixCount++;
    } else {
      console.log(`✓ Question ${row.id}: correct_option_id="${currentCorrect}" is correct`);
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Total questions: ${rows.length}`);
  console.log(`Fixed: ${fixCount}`);
  console.log(`Already correct: ${rows.length - fixCount}`);
  
  await conn.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
