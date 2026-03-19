class StreamingRoute {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;
    this._streams = this._dependencies.streams;
  }

  /**
   * @swagger
   * /streaming/tick:
   *   get:
   *     summary: SSE tick stream (finite)
   *     description: Sends periodic tick events via Server-Sent Events.
   *     parameters:
   *       - in: query
   *         name: count
   *         schema:
   *           type: integer
   *           default: 5
   *         description: Number of tick events to send
   *       - in: query
   *         name: interval
   *         schema:
   *           type: integer
   *           default: 1000
   *         description: Milliseconds between ticks
   *     responses:
   *       200:
   *         description: SSE event stream (Content-Type text/event-stream)
   */
  async tick(ctx) {
    return this._streams.TickStream.run(ctx);
  }

  /**
   * @swagger
   * /streaming/heartbeat:
   *   get:
   *     summary: SSE heartbeat stream (indefinite)
   *     description: Sends periodic heartbeat events until client disconnects.
   *     parameters:
   *       - in: query
   *         name: interval
   *         schema:
   *           type: integer
   *           default: 5000
   *         description: Milliseconds between heartbeats
   *     responses:
   *       200:
   *         description: SSE event stream (Content-Type text/event-stream)
   */
  async heartbeat(ctx) {
    return this._streams.HeartbeatStream.run(ctx);
  }
}

module.exports = StreamingRoute;
