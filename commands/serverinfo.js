module.exports = {
  name: "serverinfo",
  description: "Shows server stats",
  execute(message, args) {
    try {
      const { guild } = message;
      const embed = {
        color: 0x5865F2,
        title: `📊 Server Info — ${guild.name}`,
        thumbnail: { url: guild.iconURL ? guild.iconURL({ dynamic: true }) : null },
        fields: [
          { name: "👑 Owner", value: `<@${guild.ownerId}>`, inline: true },
          { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
          { name: "🚀 Boosts", value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
          { name: "📅 Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true }
        ],
        footer: { text: `ID: ${guild.id}` }
      };
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("serverinfo error:", err);
      message.channel.send("Oops, something went wrong fetching server info.");
    }
  }
};
