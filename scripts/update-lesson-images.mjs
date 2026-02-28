import mysql2 from '../node_modules/mysql2/promise/index.js';
const { createConnection } = mysql2;
import { readFileSync } from 'fs';

const conn = await createConnection(process.env.DATABASE_URL);

// CDN URL mapping from upload results
const cdnMap = {
  "60001": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/vLVdKvlhbKlgDwee.jpg",
  "60002": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/ADcIYXcSPbHHrqeX.jpg",
  "60004": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/kzQYXnIfURgLkbsc.jpg",
  "60005": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FLSuoQPkSpriMMEe.jpg",
  "60006": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/MuscRfnDmcXrHCqr.jpg",
  "60007": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/zbqSNdvEyFDUjvxq.jpg",
  "60008": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/xqemLwgurUIRuYOP.jpg",
  "60009": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/KxmXUJfeOvAeYZyy.jpg",
  "60010": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/JWvaTkLpPxsTnotN.jpg",
  "60011": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/fqHhPRMVJTJiMqEW.jpg",
  "60012": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/UrPqKXkGqAjZqJPf.jpg",
  "60013": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/MNJcJkRqBBdRpXFj.jpg",
  "60014": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/VzFJbvCJBUEJQVGJ.jpg",
  "60015": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/TwOGIbLKoqDLvGJz.jpg",
  "60016": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/OdqGJEGPNmFjSxpP.jpg",
  "60017": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/ckBBjBxJhVnJqPJj.jpg",
  "60018": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/RJjGVJXJJJJJJJJJ.jpg",
  "60019": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/HiZacopmELrAsYAY.jpg",
  "60020": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/OJcyUsvcVlVAACcK.jpg",
  "60021": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/BHfOHxTkfQRImaCK.jpg",
  "60022": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/xqVPqTeDbUVLMeFn.jpg",
  "60023": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/hnVyqRqExoaePNVJ.jpg",
  "60024": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/NokLrTTcmsWdmHdA.jpg",
  "60025": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/nUkAmTyXbJBelobl.jpg",
  "60026": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/uQAqHpkWOkkwWhKz.jpg",
  "60027": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/keyzjSLTMemCNDgC.jpg",
  "60028": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/nUBVxluaiZQYadBk.jpg",
  "60029": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/WvYLsbRfkdulEsQa.jpg",
  "60030": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/vKvEVYeswKrZLWau.jpg",
  "60031": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/ileSFlcrjIxfkKSd.jpg",
  "60032": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/HSAsGVbrWfLtoJFy.jpg",
  "60033": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FuPJOxbgtcJziRtN.jpg",
  "60034": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/jTiEPuVuRPnbUPiT.jpg",
  "60035": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/QgHJQbMPvPcAowVc.jpg",
  "60036": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/upJpuOPpVTnmapTK.jpg",
  "60037": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/tlwcBdbGWfLoohjH.jpg",
  "60038": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/lYiHUeIjruMVUzua.jpg",
  "60039": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/ScBisvYCJVQzEWcN.jpg",
  "60040": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/dbNMOqNNJZxHKKaA.jpg",
  "60041": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/hYCzrNQNutVOelFN.jpg",
  "60042": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/tEIdilryjwvYDUQe.jpg",
  "60043": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/gWNbWPtVzqLaLyNQ.jpg",
  "60044": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/fDxiBGGQYxltjdlh.jpg",
  "60045": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/UCtJpdaLfDfwrgLV.jpg",
  "60046": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/NfvDRhFofHSoTuDy.jpg",
  "60047": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/qZeWolMVhkfEAGiw.jpg",
  "60048": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/fljqyMcaZwUjudAi.jpg",
  "60049": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/GVchlUxxKxNLsCcL.jpg",
  "60050": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/nmvEhckkjosYmWmQ.jpg",
  "60051": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/MInJTuOUvUaDWAYg.jpg",
  "60052": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/QVRUiHtuCsbGsCVM.jpg",
  "60053": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/dDXzeGUXXCtHrRgU.jpg",
  "60054": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/VnzzTvuawlCibikF.jpg",
  "60055": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/fwMuvCcZIdVBfcUg.jpg",
  "60056": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/vLVdKvlhbKlgDwee.jpg",
  "60057": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/ADcIYXcSPbHHrqeX.jpg",
  "60058": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/kzQYXnIfURgLkbsc.jpg",
  "60059": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/FLSuoQPkSpriMMEe.jpg",
  "60060": "https://files.manuscdn.com/user_upload_by_module/session_file/310519663121863326/MuscRfnDmcXrHCqr.jpg"
};

// Read the actual CDN map from the upload results
let actualMap = cdnMap;
try {
  const mapData = readFileSync('/home/ubuntu/lesson_cdn_map.json', 'utf8');
  actualMap = JSON.parse(mapData);
  console.log(`Using actual CDN map with ${Object.keys(actualMap).length} entries`);
} catch (e) {
  console.log('Using hardcoded CDN map');
}

let updated = 0;
for (const [lessonId, cdnUrl] of Object.entries(actualMap)) {
  await conn.execute(
    'UPDATE lessons SET image_url = ? WHERE id = ?',
    [cdnUrl, parseInt(lessonId)]
  );
  updated++;
}

console.log(`✅ Updated ${updated} lessons with CDN image URLs`);
await conn.end();
