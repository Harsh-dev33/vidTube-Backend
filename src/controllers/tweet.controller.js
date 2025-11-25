import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    // create tweet
    const { content } = req.body;
    if (!content) {
        throw new ApiError(400, "content is required");
    }

    if (!mongoose.isValidObjectId(req.user.id)) {
        throw new ApiError(400, "Invalid Object id");
    }

    try {
        const tweet = await Tweet.create({
            content,
            owner: req.user.id,
        });

        return res.status(201).json(new ApiResponse(201, tweet, "Tweet Created Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Error creating tweet"));
    }

});

const getUserTweets = asyncHandler(async (req, res) => {
    // get tweets for a given user (by userId param)
    const { userId } = req.params;
    if (!userId || !mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid or missing userId parameter");
    }

    try {
        // ensure the user exists (optional but helpful)
        const userExists = await User.findById(userId).select("_id");
        if (!userExists) {
            throw new ApiError(404, "User not found");
        }

        // return all tweets created by this user. Include _id and timestamps by default.
        const userTweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 }).lean();

        // return an empty array if none — that's not necessarily an error
        return res.status(200).json(new ApiResponse(200, userTweets, "User tweets fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Error fetching user tweets"));
    }
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid or missing tweetId parameter");
    }

    if (!content) {
        throw new ApiError(400, "Content is required to update tweet");
    }

    try {
        const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,
            { content },
            { new: true }
        );

        return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Error updating tweet"));
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet    
    const { tweetId } = req.params;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid or missing tweetId parameter");
    }

    try {
        const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

        return res.status(200).json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Error deleting tweet"));
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
