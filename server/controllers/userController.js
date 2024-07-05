exports.postRouterController = {
  async register(req, res) {
    res.status(200).json({
      message: 'register'
    });
  },
  async login(req, res) {
    res.status(200).json({
      message: 'login'
    });
  }
};


