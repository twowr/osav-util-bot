const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
                .setName("ping")
                .setDescription("pong!"),
    async execute(interaction) {
        await interaction.reply("pong")
    },
    async textExecute(interaction, _args) {
        await this.execute(interaction)
    }
}