// copied from here: https://github.com/ascorbic/daneel/blob/main/lib/edge/streams.ts

export function getResponseStream() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  function send(data: string) {
    writer.write(encoder.encode(data));
  }

  return {
    send,
    stream: stream.readable,
    close: () => writer.close(),
  };
}
