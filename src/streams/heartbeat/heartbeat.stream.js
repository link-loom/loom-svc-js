class HeartbeatStream {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = dependencies.utilities;
    this._console = dependencies.console;

    /* Assigments */
    this._namespace = '[Stream]::[Heartbeat]';
  }

  /**
   * Demonstrates SSE with an indefinite heartbeat.
   *
   * Sends periodic heartbeat events until the client disconnects.
   * Useful as a reference for long-lived streaming patterns.
   *
   * Query params:
   *   - interval: milliseconds between heartbeats (default: 5000)
   */
  async run({ stream, params }) {
    try {
      if (!stream) {
        return this._utilities.io.response.error('Stream not available');
      }

      const intervalMs = parseInt(params?.interval, 10) || 5000;
      let beat = 0;

      stream.send({ message: 'Heartbeat started' }, { event: 'open' });

      while (!stream.closed) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));

        if (stream.closed) break;

        beat++;
        stream.send(
          { beat, timestamp: Date.now() },
          { event: 'heartbeat', id: String(beat) },
        );
      }
    } catch (error) {
      this._console.error(error);

      if (!stream.closed) {
        stream.close();
      }
    }
  }
}

module.exports = HeartbeatStream;
