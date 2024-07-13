const { SlashCommandBuilder, EmbedBuilder  } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
                .setName("source")
                .setDescription("give source"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x1F8B4C)
            .setTitle("Checkout my terrible code here")
            .setURL("https://github.com/twowr/osav-util-bot")
            .setAuthor({ name: "2wr", iconURL: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png", url: "https://github.com/twowr" })
            .setDescription("if you can't handle the code, just fix it yourself lmao")
            .setTimestamp()
            .setFooter({ text: "this was made because i feel like testing the embed", iconURL: "https://twowr.github.io/favicon.ico" })
        await interaction.reply({ embeds: [embed] })
    },
    async textExecute(interaction, _args) {
        await this.execute(interaction)
    }
}