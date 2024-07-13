const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
                .setName("count")
                .setDescription("increase your count by 1"),
    async execute(interaction) {
        if (interaction.client.storage.has(interaction.author.id)) {
            let previousValue = interaction.client.storage.get(interaction.author.id)
            interaction.client.storage.set(interaction.author.id, previousValue + 1)
        } else {
            interaction.client.storage.set(interaction.author.id, 0)
        }
        
        await interaction.reply(`\`${interaction.author.username}\`'s current count: ${interaction.client.storage.get(interaction.author.id).toString()}`)
        if (interaction.client.storage.get(interaction.author.id) == 727) {
            await interaction.followUp("WYSI WYFSI!!!")
        }
    },
    async textExecute(interaction, _args) {
        await this.execute(interaction)
    }
}