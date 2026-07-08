const { helperRoleId } = require('../config');

/**
 * Returns true if the member is allowed to use helper commands:
 * either they hold the configured Helper role, or they're a server Administrator.
 */
function isHelper(member) {
  if (member.permissions.has('Administrator')) return true;
  return member.roles.cache.has(helperRoleId);
}

/**
 * Call at the top of a command's execute(). Replies + returns true if the user
 * should be blocked; returns false if they're cleared to proceed.
 */
async function blockIfNotHelper(interaction) {
  if (isHelper(interaction.member)) return false;
  await interaction.reply({
    content: "You need the Helper role to use this command.",
    ephemeral: true,
  });
  return true;
}

module.exports = { isHelper, blockIfNotHelper };
