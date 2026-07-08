const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blockIfNotHelper } = require('../utils/roleGate');
const { searchUser, getUser, getHeadshot } = require('../utils/roblox');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lookup')
    .setDescription('Look up a Roblox user')
    .addStringOption((o) => o.setName('username').setDescription('Roblox username').setRequired(true))
    .setDMPermission(false),

  async execute(interaction) {
    if (await blockIfNotHelper(interaction)) return;

    const username = interaction.options.getString('username');
    await interaction.deferReply();

    const result = await searchUser(username).catch(() => null);
    if (!result) {
      return interaction.editReply({ content: `No user found for **${username}**.` });
    }

    const [profile, headshot] = await Promise.all([
      getUser(result.id).catch(() => null),
      getHeadshot(result.id).catch(() => null),
    ]);
    if (!profile) {
      return interaction.editReply({ content: 'Found user but could not load profile.' });
    }

    const embed = new EmbedBuilder()
      .setColor(0xd01012)
      .setTitle(`@${profile.name}`)
      .setURL(`https://www.roblox.com/users/${profile.id}/profile`)
      .setThumbnail(headshot)
      .addFields({ name: 'User ID', value: profile.id.toString(), inline: true });

    if (profile.description) embed.setDescription(profile.description.slice(0, 2048));

    await interaction.editReply({ embeds: [embed] });
  },
};
