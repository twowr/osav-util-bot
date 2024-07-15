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

        let a = [interaction.client.storage.get("countStorage")[sender.id].count]
        a.forEach((value, index) => {
            if (value > 1e9) {
                a[index] = value.toExponential(2)
            }
        })
        
        await interaction.reply(`\`${sender.username}\`'s current count: ${a[0]}`)
        if (interaction.client.storage.get("countStorage")[sender.id].count.toString().includes("727")) {
            await interaction.reply("WYSI WYFSI!!!")
            if (!interaction.client.storage.get("countStorage")[sender.id].hasOwnProperty("staticUpgrade")) {
                await interaction.reply("btw \"w!count upgrade static\" for a surprise")
            }
        }

        if (!interaction.client.storage.get("countStorage")[sender.id].hasOwnProperty("autoUpgrade")) {
            if (interaction.client.storage.get("countStorage")[sender.id].count >= 1727) {
                await interaction.reply("\"w!count upgrade auto\" for the next surprise")
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
                    let price = 727

                    if (countStorage[sender.id].staticUpgrade !== undefined) {
                        if (countStorage[sender.id].staticUpgrade >= 105) {
                            price += (1000 * ((countStorage[sender.id].staticUpgrade - 98)/7))
                        }
                    }

                    if (countStorage[sender.id].count >= price) {
                        countStorage[sender.id].count -= price

                        if (countStorage[sender.id].staticUpgrade !== undefined) {
                            countStorage[sender.id].staticUpgrade += 7
                        } else {
                            countStorage[sender.id].staticUpgrade = 7
                            countStorage[sender.id].upgradeEnable = true
                        }
                        
                        interaction.client.storage.set("countStorage", countStorage)

                        await interaction.reply("your count just got upgraded!, gain additional 7 points for each count")
                    } else {
                        let a = [
                            price,
                            (1000 * ((interaction.client.storage.get("countStorage")[sender.id].staticUpgrade - 98)/7)),
                        ]
                        a.forEach((value, index) => {
                            if (value > 1e9) {
                                a[index] = value.toExponential(2)
                            }
                        })

                        await interaction.reply(`bro ur broke, get ${a[0]} counts then come back`)
                        if (price > 727) {
                            await interaction.reply(`cost scaling start after getting more than +105 on static upgrade\ncurrent scaling factor: (+${a[1]}) (1000 * (staticUpgrade - 98)/7)`)
                        }
                    }
                }

                return
            }

            if (args[2] == "auto") {
                let sender = interaction.author === undefined ? interaction.user : interaction.author

                let countStorage = {}
                if (interaction.client.storage.has("countStorage")) {
                    countStorage = interaction.client.storage.get("countStorage")
                }

                if (countStorage[sender.id] !== undefined) {
                    let price = 1727

                    if (countStorage[sender.id].autoUpgrade !== undefined) {
                        if (countStorage[sender.id].autoUpgrade >= 1.5) {
                            price *= (countStorage[sender.id].autoUpgrade ** 2) * 2
                            price = Math.floor(price)
                        }

                        if (countStorage[sender.id].autoUpgrade >= 2) {
                            price **= countStorage[sender.id].autoUpgrade
                            price = Math.floor(price)
                        }
                    }

                    if (countStorage[sender.id].count >= price) {
                        countStorage[sender.id].count -= price

                        if (countStorage[sender.id].autoUpgrade !== undefined) {
                            countStorage[sender.id].autoUpgrade += 0.1
                        } else {
                            countStorage[sender.id].autoUpgrade = 0.1
                            countStorage[sender.id].autoStart = Math.floor((new Date())/1000)
                        }
                        
                        interaction.client.storage.set("countStorage", countStorage)

                        await interaction.reply("your count just got upgraded!, passively generate +0.1 count each second\nclaim using w!count auto claim")
                    } else {
                        let a = [
                            price,
                            ((interaction.client.storage.get("countStorage")[sender.id].autoUpgrade ** 2) * 2).toFixed(2),
                            interaction.client.storage.get("countStorage")[sender.id].autoUpgrade.toFixed(2),
                        ]
                        
                        a.forEach((value, index) => {
                            if (value > 1e9) {
                                a[index] = value.toExponential(2)
                            }
                        })

                        await interaction.reply(`bro ur broke, get ${a[0]} counts then come back`)
                        if (countStorage[sender.id].autoUpgrade >= 1.5) {
                            

                            let text = `cost scaling start after getting more than +1.5 on auto upgrade`

                            text += `\ncurrent scaling factor: (x${a[1]}) (autoUpgrade^2 * 2)`

                            if (countStorage[sender.id].autoUpgrade >= 2) {
                                text += `, (^${a[2]}) (^autoUpgrade)`
                            }
                            
                            await interaction.reply(text)
                        }
                    }
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

        if (args[1] == "auto") {
            if (args[2] == "claim") {
                let sender = interaction.author === undefined ? interaction.user : interaction.author

                let countStorage = {}
                if (interaction.client.storage.has("countStorage")) {
                    countStorage = interaction.client.storage.get("countStorage")
                }

                if (countStorage[sender.id].autoStart !== undefined) {
                    let now = Math.floor((new Date())/1000)
                    const amount = Math.floor((now - countStorage[sender.id].autoStart) * countStorage[sender.id].autoUpgrade)
                    countStorage[sender.id].count += amount
                    countStorage[sender.id].autoStart = now

                    interaction.client.storage.set("countStorage", countStorage)

                    let a = [
                        amount,
                    ]
                    a.forEach((value, index) => {
                        if (value > 1e9) {
                            a[index] = value.toExponential(2)
                        }
                    })

                    await interaction.reply(`claimed \`${a[0]}\` counts`)
                } else {
                    await interaction.reply(`claimed \`${undefined}\` counts`)
                }

                let a = [
                    countStorage[sender.id].autoUpgrade.toFixed(2),
                ]
                a.forEach((value, index) => {
                    if (value > 1e9) {
                        a[index] = value.toExponential(2)
                    }
                })

                await interaction.reply(`currently generating ${a[0]}/s`)

                return
            }
        }

        await this.execute(interaction)
    }
}