const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const api = async (url) => {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Roblox API error: ${res.status}`);
  return res.json();
};

async function searchUser(username) {
  const data = await api(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`);
  return data.data.find((u) => u.name.toLowerCase() === username.toLowerCase()) || data.data[0] || null;
}

async function getUser(userId) {
  return api(`https://users.roblox.com/v1/users/${userId}`);
}

async function getHeadshot(userId) {
  const data = await api(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`);
  return data.data[0]?.imageUrl || null;
}

module.exports = { searchUser, getUser, getHeadshot };
