const fs = require("node:fs")
const path = require("node:path")

const { Client, Events, GatewayIntentBits, Collection } = require("discord.js")
require("dotenv").config()

const client = new Client({ intents: GatewayIntentBits.Guilds })

client.commands = new Collection()

const commandsPath = path.join(__dirname, "commands")

for (const category of fs.readdirSync(commandsPath)) {
    const categoryPath = path.join(commandsPath, category)
    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith(".js"))
    for (const commandFile of commandFiles) {
        const commandPath = path.join(categoryPath, commandFile)
        const command = require(commandPath)

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.warn(`[WARNING] Command file at ${commandPath} is in the wrong format`)
        }
    }
}

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`)
})

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            console.error(`[ERROR] Command "${interaction.commandName}" doesn't exist`)
            return;
        }

        try {
            await command.execute(interaction)
        } catch(error) {
            console.error(error)
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({ content: "There was a problem while executing this command", ephemeral: true })
            } else {
                interaction.reply({ content: "There was a problem while executing this command", ephemeral: true })
            }
        }
    }
})

client.login(process.env.TOKEN)