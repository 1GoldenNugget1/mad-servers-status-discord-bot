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
    if(!message.content.startsWith('$')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command =  args.shift().toLocaleLowerCase();
    const embedColor = '#30b052'
    const footer = {text: 'test footer'};

    switch(command){
        
        //creating help command which lists all  avail commands in one embed 
        case 'help':
            let embed = new EmbedBuilder()
            .setColor(embedColor)
            .setFooter(footer)
            .setTimestamp()
            .addFields(
                {name: '!help', value:'shows list of avail commands'},
                {name: '!status', value:'shows status of our servers'},

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
            



            
        
    }

    
})
client.login(process.env.creds)
