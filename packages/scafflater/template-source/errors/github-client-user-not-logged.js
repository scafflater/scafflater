class GithubClientUserNotLoggedError extends Error {
  constructor() {
    super(
      `You are not logged into any GitHub hosts. Run gh auth login to authenticate.`
    );
    this.name = "GithubClientUserNotLoggedError";
  }
}

module.exports = GithubClientUserNotLoggedError;
