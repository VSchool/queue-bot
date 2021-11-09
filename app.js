const { App } = require('@slack/bolt');
require("dotenv").config()

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN // add this
});

app.event('message', async ({ message, client }) => {
    // say() sends a message to the channel where the event was triggered
    try {
        // Call chat.scheduleMessage with the built-in client
        if (!message.thread_ts && message.user !== 'U02LS6X1XA4' && message.channel !== 'C02KP1PR0UX' ){
            const result = await client.chat.postMessage({
                channel: message.channel,
                blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Hey there <@${message.user}>! Would you like to submit this question to the queue?`
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Yes, please submit"
                        },
                        "action_id": "button_click"
                    }
                }
                ],
                text: `Hey there <@${message.user}>! Would you like to submit this question to the queue?`,
                user: message.user,
                thread_ts: message.ts
            
            });
        }
        
    } catch (error) {
        console.error(error);
    }
});

app.action('button_click', async ({ body, ack, say, client }) => {
// Acknowledge the action
    await ack();
    const channelInfo = await client.conversations.info({
        channel: body.channel.id
    })
    await client.chat.delete({
        channel: body.channel.id,
        ts: body.container.message_ts
    })
    try {
        await client.chat.postEphemeral({
            channel: body.channel.id,
            thread_ts: body.message.thread_ts,
            text: `Thanks <@${body.user.id}>, your question has been submitted to the instructors
                    
Try sending some code snippets using \`\`\` to give us a closer look at your problem, if applicable`,
            user: body.message.parent_user_id
        })
    }catch (error){
        console.log(error)
    }
    try {
        await client.chat.postMessage({
            channel: "C02KP1PR0UX",
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `

    Name: ${body.user.username}
Channel: ${channelInfo.channel.name}

Go to Question:
https://v-school.slack.com/archives/${channelInfo.channel.id}/${body.message.thread_ts}`
                    },
                    "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Mark as Resolved"
                    },
                    "action_id": "resolve_issue"
                    }
                }
            ],
            text: `

Name: ${body.user.username}
Channel: ${channelInfo.channel.name}

Go to Question: 
https://v-school.slack.com/archives/${channelInfo.channel.id}/${body.message.thread_ts}`,
        });
    } catch (error) {
        console.error(error);
    }
});

app.action('resolve_issue', async ({ body, ack, say, client }) => {
    // Acknowledge the action
        await ack();
        let txt = body.message.text
        let ts = txt.slice(txt.lastIndexOf('/') + 1, -1)
        let channelFound = txt.slice(txt.indexOf('/', txt.indexOf('archives') + 'archives'.length)+1, txt.lastIndexOf('/'))
        
        await client.reactions.add({
            channel: channelFound,
            name: 'white_check_mark',
            timestamp: ts
        })
        try{
            await client.chat.delete({
                channel: body.channel.id,
                ts: body.message.ts
              });
            
        }catch(error){
            console.log(error)
        }
});



  
(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

