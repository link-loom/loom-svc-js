const definition = {
  broker: {
    events: [
      { name: 'reversebytes.beat.server', filename: '/events/broker/server/server.event', topics: [] },
      { name: 'reversebytes.beat.chatbot', filename: '/events/broker/chatbot/chatbot.event', topics: ['chatbot'] },
      { name: 'reversebytes.beat.client', filename: '/events/broker/client/client.event', topics: ['client'] }
    ],
    topics: [
      { name: 'general' },
      { name: 'chatbot' },
      { name: 'client' }
    ]
  },
  producer: {
    events: [
      { name: 'reversebytes.beat.server', filename: '/events/producer/server/server.event', topics: [] }
    ]
  }
}

module.exports = definition
