const fs = require("node:fs")
const path = require("node:path")

const { REST, Routes } = require("discord.js")
require("dotenv").config()

const commands = []

const commandsPath = path.join(__dirname, "commands")

for (const category of fs.readdirSync(commandsPath)) {
    const categoryPath = path.join(commandsPath, category)
    const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith(".js"))
    for (const commandFile of commandFiles) {
        const commandPath = path.join(categoryPath, commandFile)
        const command = require(commandPath)

        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON())
        } else {
            console.warn(`[WARNING] Command file at ${commandPath} is in the wrong format`)
        }
    }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Refreshing ${commands.length} slash (/) commands`)

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID),
            { body: commands },
        )
    } catch(err) {
        console.error(err)
    }
})()