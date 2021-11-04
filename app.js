const { App } = require('@slack/bolt');
require("dotenv").config()
let currentThread = ''
let currentMessage = {}

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
        if (message.thread_ts){
            
        }else {
            const result = await client.chat.postEphemeral({
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
                text: `Hey there <@${message.user}>! Do you have a question about JS/React?`,
                user: message.user
            
            });
        }
        
    } catch (error) {
        console.error(error);
    }
    currentThread = message.ts
    currentMessage = message
});

app.action('button_click', async ({ body, ack, say, client }) => {
// Acknowledge the action
    await ack();
    console.log(body)
    await say({ text: `Thanks <@${body.user.id}>, your question has been submitted to the instructors
                    
Try sending some code snippets using \`\`\` to give us a closer look at your problem, if applicable`, thread_ts: currentThread });
    try {
        const result = await client.chat.postMessage({
            channel: "C02KP1PR0UX",
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `

    Name: ${body.user.username}
Channel: ${body.channel.name}
Question:

    ${currentMessage.text}
                        `,
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
Channel: ${body.channel.name}
Question:
    
    ${currentMessage.text}
                                `,
        });
    } catch (error) {
        console.error(error);
    }
});

app.action('resolve_issue', async ({ body, ack, say, client }) => {
    // Acknowledge the action
        await ack();
        try{
            // console.log(body)
            // let ts = body.message.text.slice(body.message.text.indexOf('amp:')+5, body.message.text.indexOf('Question'))
            // let channelFound = body.message.text.slice(body.message.text.indexOf(',')+2, body.message.text.indexOf(';'))
            // console.log(ts, channelFound)
            // await client.reactions.add({
            //     channel: channelFound,
            //     name: 'white_check_mark',
            //     timestamp: ts
            // })
            const result = await client.chat.delete({
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

