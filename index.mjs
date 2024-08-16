//importing important shiz
import { GatewayIntentBits,EmbedBuilder } from "discord.js";
import DiscordJS from 'discord.js';
import dotenv from 'dotenv';
import  prettyMiliseconds from 'pretty-ms';
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
    client.user.setActivity('My prefix is "!"')
});
//creating  messageCreate  event listener and setting up command switch
client.on('messageCreate', async (message) =>{
    if(message.author.bot) return;
    if(!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command =  args.shift().toLocaleLowerCase();
    const embedColor = '#30b052'

    switch(command){
        
            
        
    }

    
})
