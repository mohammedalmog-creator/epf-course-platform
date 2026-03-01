import mysql from 'mysql2/promise';

const IMAGE_URLS = {
  1:  'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-1-intro-MuU8nWB8KiGyDXeVjz7PmK.webp',
  2:  'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-2-lifecycle-RDRJVyRLhkksrvb4vqeoYE.webp',
  3:  'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-3-components-8GbpnzdYq3eVxxMWPf8SjY.webp',
  4:  'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-4-what-is-epf-PPzev7qrvENkUUNRNG9BWU.webp',
  5:  'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-5-epf-vs-cpf-LiGCmb3xkDSSiMgWxk6JH2.webp',
  6:  'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-6-fluid-properties-9UHyeEoohMFkWkSL6Asy7C.webp',
  7:  'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-7-gravity-separation-EDHz3LHLMRmiDXLyZMrDDQ.webp',
  8:  'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-8-two-three-phase-jWvsFgxywuMzvaGt7tKXzk.webp',
  9:  'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-9-separator-internals-J2tSQWEkxycWqGWcbaqTRa.webp',
  10: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-10-troubleshoot-aprzaaW2rLrAr8RkKFJQFy.webp',
  11: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-11-dehydration-RBeqhg2pg4bBS9nav2Xa6h.webp',
  12: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-12-stabilization-HJ9U5XbUyk6HGtest9w8mQ.webp',
  13: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-13-crude-treatment-fv4DTGkz3fc75VFedgqPZW.webp',
  14: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-14-gas-dehydration-LRDFuHyo2CGfjwC8vNTPWR.webp',
  15: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-15-gas-sweetening-7FP95QuGnjZpjLVrBhgkz3.webp',
  16: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-16-dew-point-ijHUdmxvT7i4zNpVEQ2snb.webp',
  17: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-17-produced-water-cLL6tmNj4CxVKfjT2JJj9C.webp',
  18: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-18-heating-cooling-HtigNKrJrqVxYwHnGH7AcS.webp',
  19: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-19-gas-compression-EnXcUXRpiYy5k357Y69h8L.webp',
  20: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-20-power-generation-e5BfhFuZEEjmQ9UEZmWjJf.webp',
  21: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-21-instrument-air-XeSRywoQRTEhBwB9cEPnFT.webp',
  22: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-22-storage-tanks-4oYJAQchX76CAUxUGGdGPd.webp',
  23: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-23-metering-nr9xAqPZ6DfuaQnwVLPVzi.webp',
  24: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-24-safety-N4XXRiZ7MrZt55fGVg8GJW.webp',
  25: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-25-fire-gas-8GJ6qYwvawAaARK4yjnePn.webp',
  26: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-26-environmental-PpmudEYKiw7Zbdbt573nCX.webp',
  27: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-27-hazop-dXpoJL6MtoZPAaiBePC7ag.webp',
  28: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-28-process-design-hyktw3zUwGA9hqeLzGMPCv.webp',
  29: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-29-separator-sizing-YopiJQBv9oRyqJsft2AxVk.webp',
  30: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-30-heat-exchanger-mgDGsAP6PamJt825Z6RE8D.webp',
  31: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-31-pump-compressor-bYGiwm52KQrM9epiirZaSD.webp',
  32: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-32-piping-design-R2ZYj8tBu7pMvzX84dfP8d.webp',
  33: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-33-startup-7wVBakCWjQoNrHfA9ACHNU.webp',
  34: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-34-maintenance-6L8Vc3gJaZQ7gbxrLnyfAE.webp',
  35: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663121863326/T3XiKgmnDLqJNf6z2vN3GW/epf-lesson-35-troubleshooting-Qo72VTSPeMAgR5sJxn5HBr.webp',
};

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  let updated = 0;
  for (const [lessonId, url] of Object.entries(IMAGE_URLS)) {
    const [result] = await conn.execute(
      'UPDATE lessons SET image_url = ? WHERE id = ?',
      [url, parseInt(lessonId)]
    );
    if (result.affectedRows > 0) {
      updated++;
      console.log(`✅ Lesson ${lessonId} updated`);
    } else {
      console.log(`⚠️  Lesson ${lessonId} not found`);
    }
  }
  console.log(`\n✅ Done: ${updated}/${Object.keys(IMAGE_URLS).length} lessons updated`);
  await conn.end();
}

main().catch(console.error);
