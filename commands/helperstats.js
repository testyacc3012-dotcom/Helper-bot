const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blockIfNotHelper } = require('../utils/roleGate');
const { getStats } = require('../utils/helperStatsStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('helperstats')
    .setDescription("View a helper's activity stats")
    .addUserOption((o) => o.setName('user').setDescription('Which helper (defaults to you)'))
    .setDMPermission(false),

  async execute(interaction) {
    if (await blockIfNotHelper(interaction)) return;

    const target = interaction.options.getUser('user') || interaction.user;
    const stats = getStats(interaction.guild.id, target.id);

    if (!stats) {
      return interaction.reply({ content: `**${target.tag}** has no recorded activity yet.`, ephemeral: true });
    }

    const total = Object.values(stats.counts).reduce((a, b) => a + b, 0);
    const breakdown = Object.entries(stats.counts)
      .map(([type, count]) => `${type}: ${count}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`Helper Stats: ${stats.tag}`)
      .setDescription(`**Total actions:** ${total}\n\n${breakdown}`);

    await interaction.reply({ embeds: [embed] });
  },
};
