

const dotenv = require('dotenv');
dotenv.config();

const cron = require("cron");

const { Client, Intents, DiscordAPIError, MessageEmbed ,  MessageMentions: { USERS_PATTERN }, MessageSelectMenu} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const channelID = process.env.CHANNEL_ID;
const token = process.env.DISCORD_TOKEN;

const prefix = "!";

const lyrics =
`I feel so unsure
As I take your hand and lead you to the dance floor
As the music dies, something in your eyes
Calls to mind a silver screen
And all its sad good-byes
I'm never gonna dance again
Guilty feet have got no rhythm
Though it's easy to pretend
I know you're not a fool
Should've known better than to cheat a friend
And waste the chance that I'd been given
So I'm never gonna dance again
The way I danced with you`;

const rock = 
`ITS ABOUT DRIVE 😤
ITS ABOUT POWER 🔥
WE STAY HUNGRY😈
WE DEVOUR 👹
PUT IN THE WORK 💪
PUT IN THE HOURS ⌚
AND TAKE WHATS OURS🥶`;

const fitnessgram = `The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.`;

const arrivalDate = new Date("Jul 01 2019");
const gradDate = new Date("May 27 2023");
const totalDays = Math.ceil(Math.abs(gradDate - arrivalDate) / (1000 * 60 * 60 * 24));

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function join(t, a, s) {
    function format(m) {
        let f = new Intl.DateTimeFormat('en', m);
        return f.format(t);
    }
    return a.map(format).join(s);
}

function calculateDays(timeElapsed){
    var toSend = ""
    var today = new Date(timeElapsed);

    var secondsUntilGrad = Math.ceil(Math.abs(gradDate - today) / (1000));
    var minUntilGrad = Math.ceil(secondsUntilGrad / 60);
    var hoursUntilGrad = Math.ceil(minUntilGrad / 60);
    var daysUntilGrad = Math.ceil(hoursUntilGrad / 24); 
    var weeksUntilGrad = Math.ceil(daysUntilGrad / 7);
    var daysSinceArrival = Math.ceil(Math.abs(today - arrivalDate) / (1000 * 60 * 60 * 24));
    var sentencePercentage = ((daysSinceArrival/totalDays)*100).toFixed(2);

    toSend += "🥳 The Class of 2023 has served **" + sentencePercentage + "%** of our total time.";
    toSend += "\n";
    toSend += "🅿️ **" + daysSinceArrival + "** days have passed since our arrival on 01 Jul 2019.";
    toSend += "\n";
    toSend += "⏳ The time left until graduation on 29 May 2023 are as follows:"
    toSend += "\n";
    toSend += "     ⏲️ **" + weeksUntilGrad + "** weeks.";
    toSend += "\n";
    toSend += "     ⏲️ **" + daysUntilGrad + "** days.";
    toSend += "\n";
    toSend += "     ⏲️ **" + hoursUntilGrad.toLocaleString("en-US") + "** hours.";
    toSend += "\n";
    toSend += "     ⏲️ **" + minUntilGrad.toLocaleString("en-US") + "** minutes.";
    toSend += "\n";
    toSend += "     ⏲️ **" + secondsUntilGrad.toLocaleString("en-US") + "** seconds.";
    return toSend;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activities: [{ type: "LISTENING", name:`${prefix}help` }]});
    
    console.log("Set presence to listening for help.");
    let scheduledMessage = new cron.CronJob('0 12 * * *', () => {
        client.channels.fetch(channelID).then((channel) => {
            const timeElapsed = Date.now();
            var calculated = calculateDays(timeElapsed);
            var dateFormat= [{day: 'numeric'}, {month: 'short'}, {year: 'numeric'}];
            var todayDate = join(new Date, dateFormat, ' ');
            var toSend = "@everyone";
            toSend += "\n";
            toSend += "☀️ Good morning slingers! Today is " + todayDate;
            toSend += "\n";
            channel.send(toSend + calculated);
        }); 
    });
    scheduledMessage.start();
    console.log("Starting cron job");
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.mentions.has(client.user)) return;
    
    if (message.content.startsWith(`${prefix}help`)){
        const inputArray = message.content.split(" ");
        if (inputArray.length > 1) return message.channel.send("You cannot mention a user");
        var toSend = "";
        toSend += "These are my supported commands:"
        toSend += "\n";
        toSend += "\n";
        toSend += "**!pacer** - The FitnessGram™ Pacer Test";
        toSend += "\n";
        toSend += "**!bonk <@users>** - Bonks a user, or multiple at once";
        toSend += "\n";
        toSend += "**!serenade <@users>** - Sends a serenade to a user, or multiple at once";
        toSend += "\n";
        toSend += "**!power** - Motivates you";
        toSend += "\n";
        toSend += "**!despair** - Displays the time left until graduation";
        toSend += "\n";
        toSend += "**!source** - Displays the github repo of the bot";
        toSend += "\n";
        toSend += "**!lmgtfy <@users> [question]** - Googles someone's dumbass question for them. How convenient!";
        message.channel.send(toSend);
    }

    if(message.content.startsWith(`${prefix}lmgtfy`)){
        const inputArray = message.content.split(" ")
        
        var link = "https://googlethatforyou.com?q=";
        // for (let i = 1; i < inputArray.length; i++){
        //     const matches = inputArray[i].match(USERS_PATTERN);
        //     if (!matches) return message.channel.send("You have either not mentioned anybody or used the wrong name.");
        // }
        if(inputArray.length == 1) return message.channel.send("Refer to the **!help** why don't ya?")
        if(inputArray.length == 2) return message.channel.send("You did't ask me to google anything!")

        for(let i = 2; i < inputArray.length; i++){
            if(i == inputArray.length - 1){
                link += inputArray[i]
            }
            else link += inputArray[i]+"%20"
        }
        var dummy = null
        var tmp = 0
        message.mentions.users.forEach(user =>{
            if(tmp == 0){
                dummy = user
                tmp = tmp + 1
            }
            else tmp = tmp + 1
        })
        if (dummy == null){
            const embed = new MessageEmbed()
                .setDescription("Still no User!!!")
                .setImage("https://c.tenor.com/bGf86ooPYnQAAAAd/onmyhotline-diamondsonshine.gif")
            return message.channel.send({ embeds: [embed] })
        }
        return message.channel.send("Hey " + dummy.toString() + ", Let me google that for you!: " + link)
    }
    

    if (message.content.startsWith(`${prefix}pacer`)){
        const inputArray = message.content.split(" ");
        if (inputArray.length > 1) return message.channel.send("You cannot mention a user");
        message.channel.send(fitnessgram);
    }

    if (message.content.startsWith(`${prefix}bonk`)) {
        const inputArray = message.content.split(" ");
        for (let i = 1; i < inputArray.length; i++){
            const matches = inputArray[i].match(USERS_PATTERN);
            if (!matches) return message.channel.send("You have either not mentioned anybody or used the wrong name.");
        }
        message.mentions.users.forEach(user =>{
            const embed = new MessageEmbed()
                .setDescription(user.toString() + " has been bonked!")
                .setImage("https://c.tenor.com/tvSkixRvwsMAAAAC/bonk-meme.gif");
            message.channel.send({ embeds: [embed] }) 
        })
    }

    if (message.content.startsWith(`${prefix}serenade`)){
        const inputArray = message.content.split(" ");
        for (let i = 1; i < inputArray.length; i++){
            const matches = inputArray[i].match(USERS_PATTERN);
            if (!matches) return message.channel.send("You have either not mentioned anybody or used the wrong name.");
        }
        message.mentions.users.forEach(user =>{
            user.send(lyrics + "\nSent to you by: " + message.author.toString());
            message.channel.send("Sent " + user.toString() + " a serenade.");
        })
    }

    if (message.content.startsWith(`${prefix}power`)){
        const inputArray = message.content.split(" ");
        if (inputArray.length > 1) return message.channel.send("You cannot mention a user");
        message.channel.send(rock);
    }

    if (message.content.startsWith(`${prefix}despair`)){
        const inputArray = message.content.split(" ");
        if (inputArray.length > 1) return message.channel.send("You cannot mention a user");
        const timeElapsed = Date.now();
        calculated = calculateDays(timeElapsed);        
        message.channel.send(calculated);
    }

    if (message.content.startsWith(`${prefix}source`)){
        const inputArray = message.content.split(" ");
        if (inputArray.length > 1) return message.channel.send("You cannot mention a user");
        var toSend = "Made with love by f0ur3y3s";
        toSend += "\n"
        toSend += "https://github.com/incub4t0r/tanker";
        message.channel.send(toSend);
    }
});


client.login(token);
