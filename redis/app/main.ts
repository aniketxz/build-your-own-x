import * as net from "net";

const parseRESP = (buffer: Buffer) => {
	const request = buffer.toString().trim();

	const parts = request.split("\r\n").filter((part: string) => part.length > 0);

	const result: string[] = [];

	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];

		if (part.startsWith("$")) {
			result.push(parts[i + 1]);
			i++;
		}
	}

	return result;
};

const server: net.Server = net.createServer((connection: net.Socket) => {
	connection.on("data", (data: Buffer) => {
		const parts = parseRESP(data);

		if (parts.length === 0) return;

		const command = parts[0].toUpperCase();

		if (command === "PING") {
			connection.write("+PONG\r\n");
		} else if (command === "ECHO") {
			if (!parts[1]) {
				connection.write(
					"-ERR wrong number of arguments for 'echo' command\r\n",
				);
			}
			connection.write(`$${parts[1].length}\r\n${parts[1]}\r\n`);
		} else {
			connection.write("-ERR unknown command\r\n");
		}
	});
});

server.listen(6379, "127.0.0.1");
