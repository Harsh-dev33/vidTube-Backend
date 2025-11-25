import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import fs from "fs";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Middleware to clean up uploaded files on request abort
const cleanupOnAbort = (req, res, next) => {
  req.on("aborted", () => {
    if (req.files) {
      // Delete avatar file
      if (req.files.avatar?.[0]?.path) {
        fs.promises
          .unlink(req.files.avatar[0].path)
          .catch((err) => console.log("Error deleting avatar on abort:", err));
      }
      // Delete coverImage file
      if (req.files.coverImage?.[0]?.path) {
        fs.promises
          .unlink(req.files.coverImage[0].path)
          .catch((err) => console.log("Error deleting coverImage on abort:", err));
      }
    }
  });
  next();
};

router.route("/register").post(
  cleanupOnAbort,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh").post(verifyJWT, refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);
router.route("/update-user-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage);
router.route("/user-channel-profile:username").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
