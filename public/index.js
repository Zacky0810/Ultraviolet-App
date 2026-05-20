"use strict";

/**
 * Elements
 */
const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const searchEngine = document.getElementById("uv-search-engine");
const error = document.getElementById("uv-error");
const errorCode = document.getElementById("uv-error-code");
const frame = document.getElementById("uv-frame");

/**
 * BareMux Connection
 */
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

/**
 * Submit Handler
 */
form.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		/**
		 * Register Service Worker
		 */
		await registerSW();

		/**
		 * Build Search/URL
		 */
		const url = search(address.value, searchEngine.value);

		/**
		 * Show Frame
		 */
		frame.style.display = "block";

		/**
		 * Wisp URL
		 */
		const wispUrl = `${
			location.protocol === "https:" ? "wss" : "ws"
		}://${location.host}/wisp/`;

		/**
		 * Set Transport
		 */
		if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
			await connection.setTransport("/epoxy/index.mjs", [
				{ wisp: wispUrl },
			]);
		}

		/**
		 * Encode Proxy URL
		 */
		const proxyUrl =
			__uv$config.prefix + __uv$config.encodeUrl(url);

		/**
		 * Load Proxy Internally
		 */
		frame.src = proxyUrl;

		/**
		 * Hide Proxy URL From Address Bar
		 */
		history.pushState({}, "", "/app");

		/**
		 * Optional:
		 * Save Current Session
		 */
		sessionStorage.setItem("encodedUrl", proxyUrl);

	} catch (err) {
		error.textContent = "Failed to start proxy session.";
		errorCode.textContent = err.toString();

		console.error(err);
	}
});

/**
 * Restore Previous Session
 */
window.addEventListener("load", () => {
	const saved = sessionStorage.getItem("encodedUrl");

	if (saved) {
		frame.style.display = "block";
		frame.src = saved;

		history.replaceState({}, "", "/app");
	}
});