import type { Request, Response } from "express";
// import mongoose from "mongoose";
import ConnectionRequest from "../../../models/connection-request.ts";
import "../middlewares/auth.ts";

export const USER_SAFE_DATA = [
	"name",
	"age",
	"email",
	"profissionalTitle",
	"photoUrl",
	"skills",
	"about",
	"address",
	"country",
	"linkedinProfileUrl",
	"yearsOfExperience",
]; // PULBLIC USER INFO

export async function getMyConnetions(req: Request, res: Response) {
	try {
		const { user } = req;

		const connections = await ConnectionRequest.find({
			$or: [
				{
					toUserId: user._id,
					status: "accepted",
				},
				{
					fromUserId: user._id,
					status: "accepted",
				},
			],
		} as Record<string, unknown>)
			.populate("fromUserId", USER_SAFE_DATA)
			.populate("toUserId", USER_SAFE_DATA);

		const myConnections = connections.map((connection) => {
			if (connection.fromUserId._id.toString() === user._id.toString()) {
				return connection.toUserId;
			}
			return connection.fromUserId;
		});

		res.status(200).json({ myConnections, quantity: myConnections.length });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		res.status(500).json({
			error: "Failed to get connections",
			details: errorMessage,
		});
	}
}
