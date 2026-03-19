class TickStream {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = dependencies.utilities;
    this._console = dependencies.console;

    /* Assigments */
    this._namespace = '[Stream]::[Tick]';
  }

  /**
   * Demonstrates SSE with periodic tick events.
   *
   * Sends a configurable number of events at a configurable interval,
   * then closes the stream. Useful as a reference for finite streaming patterns.
   *
   * Query params:
   *   - count:    number of tick events to send (default: 5)
   *   - interval: milliseconds between ticks (default: 1000)
   */
  async run({ stream, params }) {
    try {
      if (!stream) {
        return this._utilities.io.response.error('Stream not available');
      }

      const count = parseInt(params?.count, 10) || 5;
      const intervalMs = parseInt(params?.interval, 10) || 1000;

      stream.send(
        { message: 'Stream started', total: count },
        { event: 'open' },
      );

      for (let index = 1; index <= count; index++) {
        if (stream.closed) break;

        await new Promise((resolve) => setTimeout(resolve, intervalMs));

        stream.send(
          { index, total: count, timestamp: Date.now() },
          { event: 'tick', id: String(index) },
        );
      }

      stream.send({ message: 'Stream completed' }, { event: 'done' });
      stream.close();
    } catch (error) {
      this._console.error(error);

      if (!stream.closed) {
        stream.send(
          { success: false, message: 'Internal error' },
          { event: 'error' },
        );
        stream.close();
      }
    }
  }
}

module.exports = TickStream;
