const fs = require("node:fs")
const path = require("node:path")

const { Client, Events, GatewayIntentBits, Collection } = require("discord.js")
require("dotenv").config()

const client = new Client({ intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
] })

client.TEXT_COMMAND_PREFIX = "w!"
client.commands = new Collection()
client.execCommand = async (commandName, interaction, textMode) => {
    const command = interaction.client.commands.get(commandName)

    if (!command) {
        console.error(`[ERROR] Command "${commandName}" doesn't exist`)
        return;
    }

    if (textMode) {
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
    } else {
        try {
            await command.textExecute(interaction)
        } catch(error) {
            console.error(error)
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({ content: "There was a problem while executing this command", ephemeral: true })
            } else {
                interaction.reply({ content: "There was a problem while executing this command", ephemeral: true })
            }
        }
    }
}

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
        client.execCommand(interaction.commandName, interaction)
    }
})

client.on(Events.MessageCreate, message => {
    if (!message.content.startsWith(message.client.TEXT_COMMAND_PREFIX)) return;
    const args = message.content.split(" ")
    const commandName = args[0].slice(message.client.TEXT_COMMAND_PREFIX.length)

    console.log(`Command "${commandName}" received`)

    message.client.execCommand(commandName, message, true)
})

client.login(process.env.TOKEN)