import type { Request, Response } from "express";
import validator from "validator";

export const signupDataValidation = (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({ error: "Invalid email format" });
	}

	if (!validator.isStrongPassword(password)) {
		return res.status(400).json({ error: "Invalid password format" });
	}
	return true;
};
