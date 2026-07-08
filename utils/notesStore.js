const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'notes.json');

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

function addNote(guildId, userId, { note, helperTag, timestamp }) {
  const data = readAll();
  data[guildId] = data[guildId] || {};
  data[guildId][userId] = data[guildId][userId] || [];
  data[guildId][userId].push({ note, helperTag, timestamp });
  writeAll(data);
}

function getNotes(guildId, userId) {
  const data = readAll();
  return data[guildId]?.[userId] || [];
}

module.exports = { addNote, getNotes };
