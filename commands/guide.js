const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blockIfNotHelper } = require('../utils/roleGate');
const faqData = require('../utils/faqData');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guide')
    .setDescription('Post a step-by-step guide for a topic')
    .addStringOption((o) =>
      o
        .setName('topic')
        .setDescription('Which topic')
        .setRequired(true)
        .addChoices(...Object.entries(faqData).map(([value, { label }]) => ({ name: label, value })))
    )
    .setDMPermission(false),

  async execute(interaction) {
    if (await blockIfNotHelper(interaction)) return;

    const topic = interaction.options.getString('topic');
    const entry = faqData[topic];
    if (!entry) return interaction.reply({ content: 'Unknown topic.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle(`📖 Guide: ${entry.label}`)
      .setDescription(entry.answer);
    await interaction.reply({ embeds: [embed] });
  },
};
