import type { Request, Response } from "express";
import mongoose from "mongoose";
import ConnectionRequest from "../../../models/connection-request.ts";
import { USER_SAFE_DATA } from "./get-my-connections.ts";

export async function getMyConnectionRequest(req: Request, res: Response) {
	try {
		const { user } = req;

		const connectionRequests = await ConnectionRequest.find({
			toUserId: new mongoose.Types.ObjectId(user._id.toString()),
			status: "pendding",
		} as Record<string, unknown>).populate("fromUserId", USER_SAFE_DATA);

		res
			.status(200)
			.json({ connectionRequests, quantity: connectionRequests.length });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		res.status(500).json({
			error: "Failed to get connections requests",
			details: errorMessage,
		});
	}
}
