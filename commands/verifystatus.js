const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blockIfNotHelper } = require('../utils/roleGate');
const { verifiedRoleName } = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verifystatus')
    .setDescription("Check whether a member is verified")
    .addUserOption((o) => o.setName('user').setDescription('User to check').setRequired(true))
    .setDMPermission(false),

  async execute(interaction) {
    if (await blockIfNotHelper(interaction)) return;

    const target = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });

    const verifiedRole = member.roles.cache.find((r) => r.name === verifiedRoleName);

    // Bloxlink's nickname template is set to "{discord-name} ({roblox-name})" — pull the Roblox
    // username back out of the parentheses rather than calling Bloxlink's paid API.
    const match = member.nickname?.match(/\(([^)]+)\)\s*$/);
    const robloxUsername = match ? match[1] : null;

    const embed = new EmbedBuilder()
      .setColor(verifiedRole ? 0x57f287 : 0xed4245)
      .setTitle(`Verification Status: ${target.tag}`)
      .addFields(
        { name: 'Verified Role', value: verifiedRole ? '✅ Yes' : '❌ No', inline: true },
        { name: 'Linked Roblox Username (from nickname)', value: robloxUsername || 'Not detected', inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
