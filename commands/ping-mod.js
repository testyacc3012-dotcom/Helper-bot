const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blockIfNotHelper } = require('../utils/roleGate');
const { modRoleId } = require('../config');
const { increment } = require('../utils/helperStatsStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping-mod')
    .setDescription('Escalate something to the moderators')
    .addStringOption((o) => o.setName('reason').setDescription('What do they need to look at?').setRequired(true))
    .addUserOption((o) => o.setName('user').setDescription('Related user, if any'))
    .setDMPermission(false),

  async execute(interaction) {
    if (await blockIfNotHelper(interaction)) return;

    const reason = interaction.options.getString('reason');
    const relatedUser = interaction.options.getUser('user');

    increment(interaction.guild.id, interaction.user.id, interaction.user.tag, 'escalations');

    const embed = new EmbedBuilder()
      .setColor(0xf57c00)
      .setTitle('🚨 Helper Escalation')
      .addFields(
        { name: 'Raised by', value: interaction.user.tag, inline: true },
        { name: 'Channel', value: `${interaction.channel}`, inline: true },
        { name: 'Reason', value: reason }
      );
    if (relatedUser) embed.addFields({ name: 'Related User', value: `${relatedUser.tag} (${relatedUser.id})` });

    const ping = modRoleId ? `<@&${modRoleId}>` : '@here';
    await interaction.reply({ content: ping, embeds: [embed] });
  },
};
