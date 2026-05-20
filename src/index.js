import { hostname } from "node:os";
import { createServer } from "node:http";
import express from "express";
import websocket from "wisp-server-node";

/**
 * Dynamic Imports
 * Helps avoid simple static detection
 */
const runtimeModule = await import(
	"@titaniumnetwork-dev/ultraviolet"
);

const transportModule = await import(
	"@mercuryworkshop/epoxy-transport"
);

const muxModule = await import(
	"@mercuryworkshop/bare-mux/node"
);

/**
 * Rename Internal Variables
 */
const clientRuntime = runtimeModule.uvPath;
const transportRuntime = transportModule.epoxyPath;
const workerRuntime = muxModule.baremuxPath;

/**
 * App
 */
const app = express();

/**
 * Remove Fingerprints
 */
app.disable("x-powered-by");

/**
 * Security Headers
 */
app.use((req, res, next) => {
	res.setHeader(
		"Cross-Origin-Opener-Policy",
		"same-origin"
	);

	res.setHeader(
		"Cross-Origin-Embedder-Policy",
		"require-corp"
	);

	res.setHeader(
		"Cross-Origin-Resource-Policy",
		"cross-origin"
	);

	next();
});

/**
 * Public Files
 */
app.use(express.static("./public"));

/**
 * Hidden Runtime Assets
 */
app.use(
	"/runtime/",
	express.static(clientRuntime)
);

app.use(
	"/engine/",
	express.static(transportRuntime)
);

app.use(
	"/worker/",
	express.static(workerRuntime)
);

/**
 * Main Route
 */
app.get("/", (req, res) => {
	res.sendFile("index.html", {
		root: "./public",
	});
});

/**
 * App Route
 */
app.get("/app", (req, res) => {
	res.sendFile("index.html", {
		root: "./public",
	});
});

/**
 * Health Route
 */
app.get("/status", (req, res) => {
	res.json({
		status: "online",
	});
});

/**
 * Custom 404
 */
app.use((req, res) => {
	res.status(404).sendFile("404.html", {
		root: "./public",
	});
});

/**
 * Create Server
 */
const server = createServer(app);

/**
 * WebSocket Handling
 */
server.on("upgrade", (req, socket, head) => {
	if (
		req.url.startsWith("/socket/")
	) {
		websocket.routeRequest(
			req,
			socket,
			head
		);

		return;
	}

	socket.end();
});

/**
 * Port
 */
let port = Number(
	process.env.PORT || 8080
);

if (isNaN(port)) {
	port = 8080;
}

/**
 * Startup
 */
server.listen(port, () => {
	const address = server.address();

	console.log("");
	console.log("Server Online");
	console.log("---------------------------");
	console.log(
		`Local: http://localhost:${address.port}`
	);
	console.log(
		`Network: http://${hostname()}:${address.port}`
	);
	console.log("---------------------------");
	console.log("");
});

/**
 * Graceful Shutdown
 */
function shutdown() {
	console.log("Closing server...");

	server.close(() => {
		process.exit(0);
	});
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);