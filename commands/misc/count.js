const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
                .setName("count")
                .setDescription("increase your count by 1"),
    async execute(interaction) {
        let sender = interaction.author === undefined ? interaction.user : interaction.author
        if (interaction.client.storage.has(sender.id)) {
            let previousValue = interaction.client.storage.get(sender.id)
            interaction.client.storage.set(sender.id, previousValue + 1)
        } else {
            interaction.client.storage.set(sender.id, 0)
        }
        
        await interaction.reply(`\`${sender.username}\`'s current count: ${interaction.client.storage.get(sender.id).toString()}`)
        if (interaction.client.storage.get(sender.id).toString().includes("727")) {
            await interaction.reply("WYSI WYFSI!!!");
        }
    },
    async textExecute(interaction, _args) {
        await this.execute(interaction)
    }
}