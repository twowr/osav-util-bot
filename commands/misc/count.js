const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
                .setName("count")
                .setDescription("increase your count by 1"),
    async execute(interaction) {
        let sender = interaction.author === undefined ? interaction.user : interaction.author

        let countStorage = {}
        if (interaction.client.storage.has("countStorage")) {
            countStorage = interaction.client.storage.get("countStorage")
        }

        if (countStorage[sender.id]) {
            countStorage[sender.id] += 1
        } else {
            countStorage[sender.id] = 0
        }

        interaction.client.storage.set("countStorage", countStorage)
        
        await interaction.reply(`\`${sender.username}\`'s current count: ${interaction.client.storage.get("countStorage")[sender.id].toString()}`)
        if (interaction.client.storage.get("countStorage")[sender.id].toString().includes("727")) {
            await interaction.reply("WYSI WYFSI!!!");
        }
    },
    async textExecute(interaction, _args) {
        await this.execute(interaction)
    }
}