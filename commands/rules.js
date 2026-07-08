const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blockIfNotHelper } = require('../utils/roleGate');
const faqData = require('../utils/faqData');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Repost the server rules')
    .setDMPermission(false),

  async execute(interaction) {
    if (await blockIfNotHelper(interaction)) return;

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle('📋 Server Rules')
      .setDescription(faqData.rules.answer);
    await interaction.reply({ embeds: [embed] });
  },
};
