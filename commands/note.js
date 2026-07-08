const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blockIfNotHelper } = require('../utils/roleGate');
const { addNote, getNotes } = require('../utils/notesStore');
const { increment } = require('../utils/helperStatsStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('note')
    .setDescription('Leave a private note on a member for other helpers to see')
    .addUserOption((o) => o.setName('user').setDescription('User the note is about').setRequired(true))
    .addStringOption((o) => o.setName('text').setDescription('The note').setRequired(true))
    .setDMPermission(false),

  async execute(interaction) {
    if (await blockIfNotHelper(interaction)) return;

    const target = interaction.options.getUser('user');
    const text = interaction.options.getString('text');

    addNote(interaction.guild.id, target.id, {
      note: text,
      helperTag: interaction.user.tag,
      timestamp: Date.now(),
    });
    increment(interaction.guild.id, interaction.user.id, interaction.user.tag, 'notes');

    const allNotes = getNotes(interaction.guild.id, target.id);
    const embed = new EmbedBuilder()
      .setColor(0x99aab5)
      .setTitle(`Notes for ${target.tag}`)
      .setDescription(
        allNotes
          .map((n, i) => `**#${i + 1}** — ${n.note}\n*by ${n.helperTag} • <t:${Math.floor(n.timestamp / 1000)}:R>*`)
          .join('\n\n')
          .slice(0, 4096)
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
