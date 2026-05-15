import type { Request, Response } from "express";
import mongoose from "mongoose";
import ConnectionRequest from "../../../models/connection-request.ts";

export async function deleteConnectionFromMyConnections(
	req: Request,
	res: Response,
) {
	try {
		const { connectionId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(connectionId)) {
			return res.status(400).json({ error: "Invalid connection Id format" });
		}
		const deletedConnection =
			await ConnectionRequest.findByIdAndDelete(connectionId);

		if (!deletedConnection) {
			return res.status(401).json({ error: "Connection not found" });
		}

		res.status(200).json({
			message: "Connecton removed successfully",
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";

		res
			.status(500)
			.json({ error: "Failed to remove connection", details: errorMessage });
	}
}
