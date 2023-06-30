import { NextFunction, Request, Response } from "express";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../config/firebase";
import { VideoProgress } from "../../models/creator.model";
import { ValidatedRequest } from "../../models/request";

export const putLectureProgress = async (
	req: Request<any, any, { chapterId: string; progress: number }>,
	res: Response,
	next: NextFunction
) => {
	const validatedReq = req as ValidatedRequest;
	const { userId } = validatedReq.userData;
	const { id } = req.params;
	const { chapterId, progress } = req.body;

	const userRef = doc(db, "users", userId);

	try {
		const userSnap = await getDoc(userRef);

		const history = userSnap.get("history") as {
			id: string;
			videoProgress: VideoProgress;
		}[];

		for (const key in history) {
			if (history[key].id === id) {
				const historyItems = history[key].videoProgress.items;
				history[key].videoProgress.lastDate = new Date().toISOString();
				for (const j in historyItems) {
					if (historyItems[j].id === chapterId) {
						historyItems[j].current = progress;

						if (historyItems[j].total < progress) {
							historyItems[j].total = progress;
						}
					}
				}
			}
		}

		await updateDoc(userRef, {
			history,
		});

		res.status(200).json("Successfully updated");
	} catch (err) {
		next(err);
	}
};
