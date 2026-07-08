require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID || null,
  // Only members with this role (or Administrator) can use helper commands
  helperRoleId: process.env.HELPER_ROLE_ID || '1523960558150484008',
  // Name of the role Bloxlink assigns once someone verifies
  verifiedRoleName: process.env.VERIFIED_ROLE_NAME || 'Verified',
  // Role to ping when a helper escalates something with /ping-mod
  modRoleId: process.env.MOD_ROLE_ID || null,
};
