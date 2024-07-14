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

        if (countStorage[sender.id] !== undefined) {
            countStorage[sender.id].count += 1
            if (countStorage[sender.id].staticUpgrade !== undefined && countStorage[sender.id].upgradeEnable == true) {
                countStorage[sender.id].count += countStorage[sender.id].staticUpgrade
            }
        } else {
            countStorage[sender.id] = { count: 1 }
        }

        interaction.client.storage.set("countStorage", countStorage)
        
        await interaction.reply(`\`${sender.username}\`'s current count: ${interaction.client.storage.get("countStorage")[sender.id].count.toString()}`)
        if (interaction.client.storage.get("countStorage")[sender.id].count.toString().includes("727")) {
            await interaction.reply("WYSI WYFSI!!!")
            if (interaction.client.storage.get("countStorage")[sender.id].staticUpgrade !== undefined) {
                await interaction.reply("btw \"w!count upgrade static\" for a surprise")
            }
        }
    },
    async textExecute(interaction, args) {
        if (args[1] == "upgrade") {
            if (args[2] == "static") {
                let sender = interaction.author === undefined ? interaction.user : interaction.author

                let countStorage = {}
                if (interaction.client.storage.has("countStorage")) {
                    countStorage = interaction.client.storage.get("countStorage")
                }

                if (countStorage[sender.id] !== undefined) {
                    if (countStorage[sender.id].count >= 727) {
                        countStorage[sender.id].count -= 727

                        if (countStorage[sender.id].staticUpgrade !== undefined) {
                            countStorage[sender.id].staticUpgrade += 7
                        } else {
                            countStorage[sender.id].staticUpgrade = 7
                            countStorage[sender.id].upgradeEnable = false
                        }
                        
                        interaction.client.storage.set("countStorage", countStorage)

                        await interaction.reply("your count just got upgraded!, gain additional 7 points for each count")
                    } else {
                        await interaction.reply("bro ur broke, get 727 points then come back")
                    }
                } else {
                    countStorage[sender.id] = { count: 0 }
                }

                return
            }

            if (args[2] == "toggle") {
                let sender = interaction.author === undefined ? interaction.user : interaction.author

                let countStorage = {}
                if (interaction.client.storage.has("countStorage")) {
                    countStorage = interaction.client.storage.get("countStorage")
                }

                if (countStorage[sender.id].upgradeEnable !== undefined) {
                    countStorage[sender.id].upgradeEnable = !countStorage[sender.id].upgradeEnable
                }

                interaction.client.storage.set("countStorage", countStorage)

                await interaction.reply(`your upgrade is now: ${interaction.client.storage.get("countStorage")[sender.id].upgradeEnable}`)

                return
            }
        }

        await this.execute(interaction)
    }
}