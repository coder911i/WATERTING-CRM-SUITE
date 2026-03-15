const { execSync } = require('child_process');

try {
  const res = execSync('curl.exe -s https://integrate.api.nvidia.com/v1/models -H "Authorization: Bearer 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"');
  const parsed = JSON.parse(res.toString());
  const ids = parsed.data.map(m => m.id);
  console.log(JSON.stringify(ids.filter(id => id.includes('llama') || id.includes('nemotron') || id.includes('nv-embed')), null, 2));
} catch (e) {
  console.error("Exec error:", e.message);
}
