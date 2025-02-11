router.put("/update-username", auth, async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.userId;

    // Check if username is already taken
    const existingUser = await User.findOne({
      username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username is already taken",
      });
    }

    // Update username
    const user = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Update username error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
