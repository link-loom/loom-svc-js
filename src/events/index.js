const definition = {
  events: [
    { name: 'reversebytes.beat.server', filename: '/events/server/server.event', topics: [] },
    { name: 'reversebytes.beat.chatbot', filename: '/events/chatbot/chatbot.event', topics: ['chatbot'] },
    { name: 'reversebytes.beat.client', filename: '/events/client/client.event', topics: ['client'] }
  ],
  topics: [
    { name: 'general' },
    { name: 'chatbot' },
    { name: 'client' }
  ]
}

module.exports = definition
