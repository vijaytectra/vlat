const express = require("express");
const router = express.Router();

/**
 * Proxy endpoint to fetch WordPress blogs
 * This avoids CORS issues by fetching from backend
 */
router.get("/wordpress", async (req, res) => {
  try {
    const { per_page = 9, orderby = "date", order = "desc" } = req.query;

    const apiUrl = new URL("https://vmls.edu.in/wp-json/wp/v2/posts");
    apiUrl.searchParams.append("per_page", per_page);
    apiUrl.searchParams.append("orderby", orderby);
    apiUrl.searchParams.append("order", order);
    apiUrl.searchParams.append("_embed", "true");

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts = await response.json();

    res.json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("[Blog Route] Error fetching WordPress blogs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch WordPress blogs",
      error: error.message,
    });
  }
});

module.exports = router;

