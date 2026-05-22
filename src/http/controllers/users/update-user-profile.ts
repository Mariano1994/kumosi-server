import type { Request, Response } from "express";
import User from "../../../models/user.ts";
import "../middlewares/auth.ts";

export async function updateUserProfile(req: Request, res: Response) {
	try {
		const dataToUpdateInUser = req.body;

		const invalidEditFilds = ["email", "password"];

		if (invalidEditFilds.every((key) => key in dataToUpdateInUser)) {
			return res.status(400).json({ error: " Email cannot be updated" });
		}

		const { user } = req;
		const files = req.files as {
			[fieldname: string]: Express.Multer.File[];
		};
		const profilePhoto = files.photoUrl?.[0] || null;
		const coverPhoto = files.coverPhotoUrl?.[0] || null;

		const profilePhotoUrl = (profilePhoto as any)?.path;
		const coverPhotoUrl = (coverPhoto as any)?.path;

		const newUserInfo = {
			...dataToUpdateInUser,
			photoUrl: profilePhotoUrl || null,
			coverPhotoUrl: coverPhotoUrl || null,
		};

		const updatedUser = await User.findByIdAndUpdate(user._id, newUserInfo, {
			runValidators: true,
			returnDocument: "after",
		});

		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({
			message: "Seu perfil foi atualizado com sucesso",
			user: updatedUser.toObject(),
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		res
			.status(500)
			.json({ error: "Erro ao atualizar perfil", details: errorMessage });
	}
}
