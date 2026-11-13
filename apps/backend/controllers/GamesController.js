export default {
  // GET /api/users/me/rating-count - Return the authenticated user's rating count
  getMyRatingCount(req, res) {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }

    res.status(200).json({
      userId: req.user.id,
      count: 0,
    })
  },
}
