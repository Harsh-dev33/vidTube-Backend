import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.body.accessToken ||
    (req.headers["authorization"] && req.headers["authorization"].replace("Bearer ", ""));

  if (!token) {
    throw new ApiError(401, "Access token is required");
  }

  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new ApiError(500, "ACCESS_TOKEN_SECRET is not defined in environment variables");
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodeToken._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "User not found");
    }
    // Attach user data to the request object for downstream middleware
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});
