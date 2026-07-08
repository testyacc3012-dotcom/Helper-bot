const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blockIfNotHelper } = require('../utils/roleGate');
const faqData = require('../utils/faqData');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verifyguide')
    .setDescription('Walk a member through verification, tagging them in this channel')
    .addUserOption((o) => o.setName('user').setDescription('User to guide').setRequired(true))
    .setDMPermission(false),

  async execute(interaction) {
    if (await blockIfNotHelper(interaction)) return;

    const target = interaction.options.getUser('user');

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('How to Verify')
      .setDescription(faqData.verify.answer);

    await interaction.reply({ content: `${target}`, embeds: [embed] });
  },
};
