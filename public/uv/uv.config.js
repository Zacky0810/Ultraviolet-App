// Custom Runtime Config

self.__runtime$config = {
	prefix: "/service/",

	encodeUrl: Ultraviolet.codec.xor.encode,
	decodeUrl: Ultraviolet.codec.xor.decode,

	handler: "/runtime/handler.js",
	client: "/runtime/client.js",
	bundle: "/runtime/bundle.js",
	config: "/runtime/config.js",
	sw: "/runtime/worker.js",
};