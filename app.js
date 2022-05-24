const { App } = require('@slack/bolt');
require('dotenv').config();
const axios = require('axios');
const FSJSChannels = [
  'GT8GCGXS5',
  'GT8GD1GG1',
  'GTJ7MNQE8',
  'GTJLZR2CQ',
  'GT8GDT4F3',
  'GT778UPM1',
];

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // add this
  appToken: process.env.SLACK_APP_TOKEN, // add this
});

app.event('message', async ({ message, client }) => {
  // say() sends a message to the channel where the event was triggered
  try {
    // Call chat.scheduleMessage with the built-in client
    if (
      !message.thread_ts &&
      message.user !== 'U02LS6X1XA4' &&
      message.channel !== 'C02KP1PR0UX'
    ) {
      if (message.user) {
        const channelInfo = await client.conversations.info({
          channel: message.channel,
        });

        const result = await client.chat.postMessage({
          channel: message.channel,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Hey there <@${message.user}> it looks like you are asking a question. Would you like us to add this to the question queue?`,
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Yes, please add to queue',
                  },
                  action_id: 'yes_button',
                },
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Yes, and a video call',
                  },
                  action_id: 'zoom_button',
                },
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: "Nah, I'm just chatting",
                  },
                  action_id: 'nah_button',
                },
              ],
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Not sure what the question queue is? *<https://www.notion.so/How-to-get-help-Question-Queue-fdbacba99f8d4f4aab5cc75e06b6ba05|Learn more about the queue>*',
              },
            },
          ],
          text: `Hey there <@${message.user}> it looks like you are asking a question. Would you like us to add this to the question queue?`,
          user: message.user,
          thread_ts: message.ts,
        });
        console.log(message.channel);
        // if(FSJSChannels.includes(message.channel)){
        if (message.channel === 'GTLT5AF4N') {
          const result = await client.chat.postMessage({
            channel: message.channel,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Please provide additional information to help the TA address your question',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: 'Please use this form to ',
                  emoji: true,
                },
              },
              {
                type: 'input',
                element: {
                  type: 'static_select',
                  placeholder: {
                    type: 'plain_text',
                    text: 'Select an part',
                    emoji: true,
                  },
                  options: [
                    {
                      text: {
                        type: 'plain_text',
                        text: 'Part 1: Understanding the problem',
                        emoji: true,
                      },
                      value: 'value-0',
                    },
                    {
                      text: {
                        type: 'plain_text',
                        text: 'Part 2: Creating a plan',
                        emoji: true,
                      },
                      value: 'value-1',
                    },
                    {
                      text: {
                        type: 'plain_text',
                        text: 'Part 3: Writing the code/syntax question',
                        emoji: true,
                      },
                      value: 'value-2',
                    },
                    {
                      text: {
                        type: 'plain_text',
                        text: 'Part 4: Looking back/feedback',
                        emoji: true,
                      },
                      value: 'value-2',
                    },
                  ],
                  action_id: 'static_select-action',
                },
                label: {
                  type: 'plain_text',
                  text: 'Which Part of the Problem Solving Process are you on?',
                  emoji: true,
                },
              },
              {
                type: 'input',
                element: {
                  type: 'plain_text_input',
                  multiline: true,
                  action_id: 'plain_text_input-action',
                },
                label: {
                  type: 'plain_text',
                  text: 'Description of question',
                  emoji: true,
                },
              },
              {
                type: 'input',
                element: {
                  type: 'plain_text_input',
                  multiline: true,
                  action_id: 'plain_text_input-action',
                },
                label: {
                  type: 'plain_text',
                  text: 'Enter any errors you find in the development console',
                  emoji: true,
                },
              },
              {
                type: 'input',
                element: {
                  type: 'plain_text_input',
                  multiline: true,
                  action_id: 'plain_text_input-action',
                },
                label: {
                  type: 'plain_text',
                  text: 'Submit the code in question. The whole file is good!',
                  emoji: true,
                },
              },
              {
                type: 'input',
                element: {
                  type: 'plain_text_input',
                  action_id: 'plain_text_input-action',
                },
                label: {
                  type: 'plain_text',
                  text: 'Google search phrase used',
                  emoji: true,
                },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Add text to thread message.',
                },
                accessory: {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Parse',
                    emoji: true,
                  },
                  value: 'click_me_123',
                  action_id: 'submit_more_button',
                },
              },
            ],
            text: `Hey there <@${message.user}> it looks like you are asking a question. Would you like us to add this to the question queue?`,
            user: message.user,
            thread_ts: message.ts,
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

const getUserEmail = async (client, userId) => {
  const userInfo = await client.users.info({
    user: userId,
  });

  const userEmail = userInfo.user.profile.email;

  return userEmail;
};

const sendZapierWebhook = (userEmail, preferredContact) => {
  const date = new Date();

  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  // convert time to MDT time
  const time = date.toLocaleTimeString('en-US', {
    timeZone: 'America/Denver',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });

  const timeFormatted = time.split(' ').join('');

  axios.post(process.env.ZAPIER_WEBHOOK_URL, {
    webhookObject: {
      email: userEmail,
      date: formattedDate,
      time: timeFormatted,
      preferredContact: preferredContact,
    },
  });
};

app.action('yes_button', async ({ body, ack, client }) => {
  // Acknowledge the action
  await ack();
  const channelInfo = await client.conversations.info({
    channel: body.channel.id,
  });

  const userEmail = await getUserEmail(client, body.user.id);
  sendZapierWebhook(userEmail, 'Slack Chat');

  deleteMessage(client, body);

  let conversationHistory = await sendQueueChannelMessage(
    body,
    channelInfo,
    client
  );

  sendEphemeral(client, body, conversationHistory);
});

app.action('submit_more_button', async ({ body, ack, client }) => {
  // Acknowledge the action
  await ack();
  const channelInfo = await client.conversations.info({
    channel: body.channel.id,
  });
  console.log(channelInfo);
});

app.action('zoom_button', async ({ body, ack, client }) => {
  // Acknowledge the action
  await ack();

  const channelInfo = await client.conversations.info({
    channel: body.channel.id,
  });

  const userEmail = await getUserEmail(client, body.user.id);
  sendZapierWebhook(userEmail, 'Zoom Call');

  deleteMessage(client, body);

  let conversationHistory = await sendQueueChannelMessage(
    body,
    channelInfo,
    client,
    'zoom'
  );

  sendEphemeral(client, body, conversationHistory);
});

app.action('address_issue', async ({ body, ack, client }) => {
  await ack();

  addReaction(body, client, 'eyes');

  body.message.blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${body.user.name} is addressing this issue`,
    },
  });
  body.message.text += `\n ${body.user.name} is addressing this issue`;
  await client.chat.update({
    channel: body.channel.id,
    ts: body.container.message_ts,
    blocks: body.message.blocks,
    text: body.message.text,
  });
});

app.action('instructor_request', async ({ body, ack, client }) => {
  await ack();

  addReaction(body, client, 'eric');
  body.message.blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${
        body.channel.id == 'C02NAB1SCEQ'
          ? '<@U01EMTGGADU>'
          : '<@U0E5W7QJE> <@U01ANMGRJPL>'
      } Your help is requested with this issue`,
    },
  });
  body.message.text += `${
    body.channel.id == 'C02NAB1SCEQ'
      ? '<@U01EMTGGADU>'
      : '<@U0E5W7QJE> <@U01ANMGRJPL>'
  } Your help is requested with this issue`;
  await client.chat.update({
    channel: body.channel.id,
    ts: body.container.message_ts,
    blocks: body.message.blocks,
    text: body.message.text,
  });
});

app.action('nah_button', async ({ body, ack, client }) => {
  await ack();
  console.log(client.chat);
  // deleteMessage(client, body.container)
  deleteMessage(client, body);
});

app.action('resolve_issue', async ({ body, ack, say, client }) => {
  // Acknowledge the action
  await ack();
  let txt = body.message.text;
  let ts = txt.slice(txt.lastIndexOf('/') + 1, txt.indexOf('>'));
  let channelFound = txt.slice(
    txt.indexOf('/', txt.indexOf('archives') + 'archives'.length) + 1,
    txt.lastIndexOf('/')
  );

  await client.reactions.add({
    channel: channelFound,
    name: 'white_check_mark',
    timestamp: ts,
  });
  deleteMessage(client, body);
});

async function sendQueueChannelMessage(
  body,
  channelInfo,
  client,
  buttonClicked
) {
  try {
    await client.chat.postMessage({
      channel: channelInfo.channel.name.includes('dev')
        ? 'C02KP1PR0UX'
        : 'C02NAB1SCEQ',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `

    Name: ${body.user.username}
Channel: ${channelInfo.channel.name}

${buttonClicked == 'zoom' ? '> 🎥 **Zoom Call Requested**' : ''}

Go to Question:
https://v-school.slack.com/archives/${channelInfo.channel.id}/${
              body.message.thread_ts
            }`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Mark as Resolved',
              },
              action_id: 'resolve_issue',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Address Issue',
              },
              action_id: 'address_issue',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Request Instructor',
              },
              action_id: 'instructor_request',
            },
          ],
        },
      ],
      text: `

Name: ${body.user.username}
Channel: ${channelInfo.channel.name}

Zoom Call Requested

Go to Question: 
https://v-school.slack.com/archives/${channelInfo.channel.id}/${body.message.thread_ts}`,
    });

    const result = await client.conversations.history({
      channel: channelInfo.channel.name.includes('dev')
        ? 'C02KP1PR0UX'
        : 'C02NAB1SCEQ',
    });

    return result.messages;
  } catch (error) {
    console.error(error);
  }
}

async function sendEphemeral(client, body, conversationHistory) {
  try {
    await client.chat.postEphemeral({
      channel: body.channel.id,
      thread_ts: body.message.thread_ts,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Thanks <@${body.user.id}>, your question has been added to the question queue and a video call has been requested. Our instructors and TA's will respond to the questions in the queue in the order that they are received.\n\n While you are waiting, please provide us with any additional information that could help get us up to speed with your question. \n\nFor example:\n\n• Recordings of the issue \n • code snippets (using \`\`\`) \n • Links to design files, etc.\n\nThese are all helpful in providing us with more context so that we can get you an answer as quickly as possible.`,
          },
        },
      ],
      text: `Thanks <@${body.user.id}>, your question has been added to the question queue and a video call has been requested. Our instructors and TA's will respond to the questions in the queue in the order that they are received.\n\nWhile you are waiting, please provide us with any additional information that could help get us up to speed with your question. \n\nFor example:\n\n• Recordings of the issue \n • code snippets (using \`\`\`) \n • Links to design files, etc.\n\nThese are all helpful in providing us with more context so that we can get you an answer as quickly as possible.`,
      user: body.message.parent_user_id,
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteMessage(client, body) {
  await client.chat.delete({
    channel: body.channel.id,
    ts: body.container.message_ts,
  });
}

async function addReaction(body, client, emoji) {
  await client.reactions.add({
    channel: body.channel.id,
    name: emoji,
    timestamp: body.container.message_ts,
  });
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3001);

  console.log('⚡️ Bolt app is running!');
})();
