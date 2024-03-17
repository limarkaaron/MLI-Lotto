const express = require("express")
const app = express()

app.get("/", (req, res) => {
  res.send("Bot is running...")
})

app.listen(3000, () => {
  console.log("Project is ready")
})

const cooldowns = new Map()
const humanizeDuration = require('humanize-duration');
let Discord = require("discord.js")
let client = new Discord.Client()
let prize = 20;

client.on("ready", () => {
  client.user.setPresence({ activity: { name: "Crypto Trader" } })
})

client.on("message", message => {
  if (message.content === "?draw") {
    const cooldown = cooldowns.get(message.author.id);
    if (cooldown) {
      const remaining = humanizeDuration(cooldown - Date.now(), { round: true, largest: 1 });

      return message.channel.send(`${message.author}, You must wait \`${remaining}\` before drawing again.`)
    }
    else {
      let min = [1]; //min range for RNG
      let max = [100000]; //max range for RNG
      let num = Math.floor(Math.random() * (max - min + 1) + min) //inclusive +1
      let lucky_number = 11111; //LUCKY NUMBER
      //let lucky_number = Math.floor(Math.random() * (max - min + 1) + min) //inclusive +1

      message.channel.send(`🏆 GRAND PRIZE: $${prize} BTC 🏆\n`)
      if (num == lucky_number) { //lucky number
        let embed = new Discord.MessageEmbed()
          .setTitle("YOU WON $" + prize + "! 🎉")
          .setFooter(`Winning number: ${lucky_number}`)
          .setDescription(`${message.author} Send a screenshot to the admin :partying_face:`)
          .setColor("#0CFF00")
        message.channel.send(embed)
      }

      else if (lucky_number - 1000 <= num && num <= lucky_number + 1000) { //lucky number
        let embed = new Discord.MessageEmbed()
          .setTitle("SO CLOSE!")
          .setDescription(`${message.author} You have drawn: **${num}**`)
          .setColor("#FFAA00")
          .setFooter(`Winning number: ${lucky_number}`)
        message.channel.send(embed)
      }

      else { //you lost try again message
        let embed = new Discord.MessageEmbed()
          .setTitle("Better luck next time!")
          .setDescription(`${message.author} You have drawn: **${num}**`)
          .setColor("#FF0000")
          .setFooter(`Winning number: ${lucky_number}\n`)
        message.channel.send(embed)
      }

      cooldowns.set(message.author.id, Date.now() + 1800000);
      setTimeout(() => {
        cooldowns.delete(message.author.id)
      }, 1800000);    //time in milliseconds for cooldown
    }
  }
})
const mySecret = process.env['DISCORD_BOT_SECRET']
client.login(mySecret)