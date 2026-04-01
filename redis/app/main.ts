import * as net from "net";

const server: net.Server = net.createServer((connection: net.Socket) => {
	connection.on("data", (data: Buffer) => {
		const request = data.toString().trim();

		if (!request.includes("PING")) {
			return connection.end();
		}

		const response = "+PONG\r\n";
		connection.write(response);
	});
});

server.listen(6379, "127.0.0.1");
