// Packages

import { useEffect } from "react";

import { io } from "socket.io-client";

export default function Component({
	channel,
	onUpdate,
	onConnect,
	onDisconnect,
}) {
	useEffect(() => {
		const socket = io("ws://10.11.21.137:3002" || "", {
			path: "/",
			rememberUpgrade: true,
			auth: {
				channel,
			},
		});

		socket.on("connect", () => onConnect && onConnect());

		socket.on("disconnect", () => onDisconnect && onDisconnect());

		socket.on("update", (data) => onUpdate && onUpdate(data));

		// onUpdate && onUpdate();

		return () => socket.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
