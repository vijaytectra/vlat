// Get current user data
exports.getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
