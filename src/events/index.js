const definition = {
  // On producer
  producer: {
    // Describe all the topics that the consumer will subscribe to once it has connected to the broker.
    topics: [{ name: 'server' }, { name: 'chatbot' }, { name: 'client' }],
    events: [
      {
        name: 'reversebytes.beat.chatbot',
        command: '#request',
        filename: '/events/producer/chatbot/chatbot-request.event',
        topics: ['chatbot'],
      },
      {
        name: 'reversebytes.beat.server',
        command: '#request',
        filename: '/events/producer/server/server-request.event',
        topics: ['server'],
      },
    ],
  },
  // On consumer
  consumer: {
    // Listen events as consumer role
    events: [
      {
        name: 'reversebytes.beat.chatbot',
        command: '#response',
        filename: '/events/consumer/chatbot/chatbot-response.event',
        topics: ['chatbot'],
      },
      {
        name: 'reversebytes.beat.server',
        command: '#response',
        filename: '/events/consumer/server/server-response.event',
        topics: ['server'],
      },
    ],
  },
};

module.exports = definition;
