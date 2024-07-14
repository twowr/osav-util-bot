const fs = require("node:fs")
const path = require("node:path")

const { Client, Events, GatewayIntentBits, Collection } = require("discord.js")
require("dotenv").config()

const client = new Client({ intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
] })

client.storage = ({
    init: () => {
        this.path = path.join(__dirname, "storage.dat")

        this.get = key => {
            let data = JSON.parse(fs.readFileSync(this.path).toString())
            if (key in data) {
                return data[key]
            } else {
                throw new Error(`Key value ${key} doesn't exist in ${this.path}`)
            }
        }

        this.set = (key, value) => {
            let data = JSON.parse(fs.readFileSync(this.path).toString())
            data[key] = value
            fs.writeFileSync(this.path, JSON.stringify(data))
        }

        this.has = key => {
            let data = JSON.parse(fs.readFileSync(this.path).toString())
            return data.hasOwnProperty(key)
        }

        return this
    },
}).init()
client.TEXT_COMMAND_PREFIX = "w!"
client.COMMAND_PER_MINUTE = 10
client.commands = new Collection()
client.rateLimit = new Collection()
client.execCommand = async (commandName, interaction, textCommandArgs) => {
    let sender = interaction.author === undefined ? interaction.user : interaction.author
    if (interaction.client.rateLimit.has(sender.id)) {
        let user = interaction.client.rateLimit.get(sender.id)

        if (user.count > interaction.client.COMMAND_PER_MINUTE) {
            return
        }

        user.count += 1
        interaction.client.rateLimit.set(sender.id, user)
        if (user.count > interaction.client.COMMAND_PER_MINUTE && user.warned == false) {
            user.warned = true
            interaction.client.rateLimit.set(sender.id, user)
            interaction.reply(`you are being rate limited (${interaction.client.COMMAND_PER_MINUTE} commands per minutes)`)
        }

        if (user.count > interaction.client.COMMAND_PER_MINUTE) {
            return
        }
    } else {
        interaction.client.rateLimit.set(sender.id, { count: 1, warned: false })
    }

    const command = interaction.client.commands.get(commandName)

    if (!command) {
        console.error(`[ERROR] Command "${commandName}" doesn't exist`)
        return;
    }

    if (!textCommandArgs) {
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
            await command.textExecute(interaction, textCommandArgs)
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

function refreshRateLimit() {
    console.log("refreshing rate limit")

    if (client.rateLimit.size > 0) {
        client.rateLimit.forEach((_user, id) => {
            client.rateLimit.set(id, { count: 0, warned: false })
        })
    }
}

setInterval(refreshRateLimit, 60000)

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

    message.client.execCommand(commandName, message, args)
})

client.login(process.env.TOKEN)