//importing important shiz
import { GatewayIntentBits,EmbedBuilder } from "discord.js";
import DiscordJS from 'discord.js';
import dotenv from 'dotenv';
import  prettyMiliseconds from 'pretty-ms';
import BattleNode from 'battle-node';

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
//config for battle-node lib
var configARMA = {
    ip: '127.0.0.1',
    port: process.env.armaPort,
    rconPassword: process.env.armaPassword
};
  
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

    switch(command){
        //creating help command which lists all  avail commands in one embed 
        case 'help':
            const footer = {text: 'test footer'}
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
        //setting up 
        case 'armastatus':
            let bnode = new BattleNode(configARMA);
 
            bnode.login();
             
            bnode.on('login', function(err, success) {
              
              if (err) { console.log('Unable to connect to server.'); }
             
              if (success == true) {
                console.log('Logged in RCON successfully.');
              }
              else if (success == false) {
                console.log('RCON login failed! (password may be incorrect)');
              }
                        
            });



            
        
    }

    
})
client.login(process.env.creds)
