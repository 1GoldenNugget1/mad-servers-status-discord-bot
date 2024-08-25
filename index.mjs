//importing important shiz
import { GatewayIntentBits,EmbedBuilder } from "discord.js";
import DiscordJS from 'discord.js';
import dotenv from 'dotenv';
import  prettyMiliseconds from 'pretty-ms';
import fetch  from 'node-fetch';

dotenv.config()
//setting up new discordjs client 
const client = new DiscordJS.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ] 
});
 
//setting up on ready  console message and bot status 
client.on('ready', () =>{
    console.log('bot is active');
    client.user.setActivity('My prefix is "$"')
});
//creating  messageCreate  event listener and setting up command switch
client.on('messageCreate', async (message) =>{
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command =  args.shift().toLocaleLowerCase();
    const embedColor = '#30b052'
    const footer = {text: 'test footer'};
    const prefix = '$'

    switch(command){
        
        //creating help command which lists all  avail commands in one embed 
        case 'help':
            let embed = new EmbedBuilder()
            .setColor(embedColor)
            .setFooter(footer)
            .setTimestamp()
            .addFields(
                {name: `${prefix}help`, value:'shows list of avail commands'},
                {name: `${prefix}status`, value:'shows status of our servers'},

            )
            message.channel.send({embeds:[embed]});
            break;
        
        
        //setting up  Arma3 & SE Servers status  command 
        case 'status':
            //Get server details from BattleMetrics
            //Set variables required for request
            let token = process.env.BattlemetricsKey;
            let serverID = process.env.arma3ID;
            let url = "https://api.battlemetrics.com/servers/";

            //Set headers
            let headers = {
                Authorization: "Bearer "+token
            }

            const ArmaResponse = await fetch(url+serverID, {method: "get", headers: headers})
            .catch(err => console.log(err))
            const data = await ArmaResponse.json();

            console.log(data);

            try {
                //Get data from response and set status
                let ArmaName = data["data"]["attributes"]["name"];
                let ArmaStatus = data["data"]["attributes"]["status"];
                let ArmaStatusString;
                
                if(ArmaStatus == "online") ArmaStatusString = "🟢";
                else if(ArmaStatus == "dead") ArmaStatusString = "🔴";
                let ArmaPlayers = data["data"]["attributes"]["players"];
                let ArmaMaxPlayers = data["data"]["attributes"]["maxPlayers"];

                //Create embed
                let statusEmbed = new EmbedBuilder()
                .setTitle('Server status')
                .setColor(embedColor)
                .setFooter(footer)
                .setTimestamp()
                .addFields(
                    {name: '**ARMA 3**', value:' '},
                    {name: 'Name', value:ArmaName, inline: true},
                    {name: 'Status', value:ArmaStatusString, inline: true},
                    {name: 'Players', value:ArmaPlayers+'/'+ArmaMaxPlayers, inline: true},
                    {name: '**Space Engineers**', value:' '},
                )
                message.channel.send({embeds:[statusEmbed]});
            }catch(error) {
                console.error('Error fetching data:', error);
                message.reply('An error occurred while fetching data.');
            }
            break;
            
        case 'uptime':
            //bot uptime command 
            let upt = prettyMiliseconds(client.uptime,{compact: true});
            let latency = client.ws.ping
            let uptime  = new EmbedBuilder()
            .setTitle('**BOT UPTIME AND LATENCY')
            .setColor(embedColor)
            .setTimestamp()
            .setFooter(footer)
            .setTimestamp()
            .addFields(
                {name: `:alarm_clock: Bots Latency:`,value:`${Math.round(latency)}ms`},
                {name: "🤖 Uptime Bota:", value: `${upt}`}
            )
            message.channel.send({embeds:[uptime]});
        break;
            
       case 'ban':
    // ban command setup
    if (message.content.startsWith(`${prefix}ban`)) {
        // Get the mentioned user from the message
        const user = message.mentions.users.first();
    
        // If a user was mentioned
        if (user) {
            // Get the member from the user
            const member = message.guild.members.cache.get(user.id);
    
            try {
            // Ban the member and send a confirmation message
            await member.ban();
            message.reply(`${user.tag} was banned.`);
            } catch (err) {
            // Log any errors
            console.error(err);
            message.reply('failed to ban this user (check bot perms first)');
            }
        } else {
            // If no user was mentioned
            message.reply('you have to mention user to ban them ');
        }
        } 
        break; 
        
        case 'kick':
            const user = message.mentions.users.first();
  
            // If a user was mentioned
            if (user) {
              // Get the member from the user
              const member = message.guild.members.cache.get(user.id);
        
              try {
                // Kick the member and send a confirmation message
                await member.kick();
                message.reply(`${user.tag} was kicked.`);
              } catch (err) {
                // Log any errors
                console.error(err);
                message.reply('failed to kick this user (check bot perms first)');
              }
            } else {
              // If no user was mentioned
              message.reply('you have to mention user to kick them');
            } 






            
        
    }

    
})
client.login(process.env.creds)
