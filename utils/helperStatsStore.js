const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'helperStats.json');

function readAll() {
  if (!fs.existsSync(FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeAll(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function increment(guildId, helperId, helperTag, actionType) {
  const data = readAll();
  data[guildId] = data[guildId] || {};
  data[guildId][helperId] = data[guildId][helperId] || { tag: helperTag, counts: {} };
  data[guildId][helperId].tag = helperTag; // keep tag fresh in case of username change
  data[guildId][helperId].counts[actionType] = (data[guildId][helperId].counts[actionType] || 0) + 1;
  writeAll(data);
}

function getStats(guildId, helperId) {
  const data = readAll();
  return data[guildId]?.[helperId] || null;
}

module.exports = { increment, getStats };
