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
            if(message.user){
                const result = await client.chat.postMessage({
                    channel: message.channel,
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": `Hey there <@${message.user}> it looks like you are asking a question. Would you like us to add this to the question queue?`
                            }
                        },
                        {
                            "type": "actions",
                            "elements": [
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Yes, please add to queue"
                                    },
                                    "action_id": "yes_button"
                                },
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Nah, I'm just chatting"
                                    },
                                    "action_id": "no_button"
                                }
                            ]
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "Not sure what the question queue is? *<https://vschooldesign.notion.site/V-School-Question-Queue-Bot-fdbacba99f8d4f4aab5cc75e06b6ba05|Learn more about the queue>*"
                            }
                        }
                    ],
                    text: `Hey there <@${message.user}> it looks like you are asking a question. Would you like us to add this to the question queue?`,
                    user: message.user,
                    thread_ts: message.ts
                
                });
            }
        }
        
    } catch (error) {
        console.error(error);
    }
});

app.action('yes_button', async ({ body, ack, say, client }) => {
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

        const result = await client.conversations.history({
            channel: 'C02KP1PR0UX'
        });
        
        conversationHistory = result.messages;
        
    } catch (error) {
        console.error(error);
    }
    try {
        await client.chat.postEphemeral({
            channel: body.channel.id,
            thread_ts: body.message.thread_ts,
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Thanks <@${body.user.id}>, your question has been added to the question queue. Our instructors and TA's will respond to the questions in the queue in the order that they are received.\n\nPosition in Queue: ${conversationHistory.length}\n\n---------------------\n\nWhile you are waiting, please provide us with any additional information that could help get us up to speed with your question. \n\nFor example:\n\n• Recordings of the issue \n • code snippets (using \`\`\`) \n • Links to design files, etc.\n\nThese are all helpful in providing us with more context so that we can get you an answer as quickly as possible.`
                    }
                },
                // {
                //     "type": "actions",
                //     "elements": [
                //         {
                //             "type": "button",
                //             "text": {
                //                 "type": "plain_text",
                //                 "text": "Check Queue Position"
                //             },
                //             "action_id": "check_queue"
                //         }
                //     ]
                // }
            ],
            text: `Thanks <@${body.user.id}>, your question has been added to the question queue. Our instructors and TA's will respond to the questions in the queue in the order that they are received.\n\nPosition in Queue: ${conversationHistory.length}\n\n---------------------\n\nWhile you are waiting, please provide us with any additional information that could help get us up to speed with your question. \n\nFor example:\n\n• Recordings of the issue \n • code snippets (using \`\`\`) \n • Links to design files, etc.\n\nThese are all helpful in providing us with more context so that we can get you an answer as quickly as possible.`,
            user: body.message.parent_user_id
        })
    }catch (error){
        console.log(error)
    }
});

// app.action('check_queue', async ({body, ack, say, client}) => {
//     await ack()
//     try{
//         const result = await client.conversations.history({
//             channel: 'C02KP1PR0UX'
//         });
        
//         conversationHistory = result.messages;
//         console.log(body)
//         await client.chat.postMessage({
//             channel: body.channel.id,
//             thread_ts: body.container.message_ts,
//             "blocks": [
//                 {
//                     "type": "section",
//                     "text": {
//                         "type": "mrkdwn",
//                         "text": `Current Position in Queue: ${conversationHistory.length}\n\n---------------------`
//                     }
//                 },
//                 {
//                     "type": "actions",
//                     "elements": [
//                         {
//                             "type": "button",
//                             "text": {
//                                 "type": "plain_text",
//                                 "text": "Check Queue Position"
//                             },
//                             "action_id": "check_queue"
//                         }
//                     ]
//                 }
//             ],
//             text: `Current Position in Queue: ${conversationHistory.length}\n\n---------------------`
//         })
//     }catch(error){
//         console.log(error)
//     }
// })

app.action('no_button', async ({body, ack, say, client}) => {
    try{
        await client.chat.delete({
            channel: body.channel.id,
            ts: body.message.ts
          });
    }catch(error){
        console.log(error)
    }
})


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

