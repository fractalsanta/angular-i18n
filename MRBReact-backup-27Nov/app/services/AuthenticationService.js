export const login = () => {
  window.location =
    "https://authp.bodhi-dev.io/login?namespace=bodhi&redirect=http%3A%2F%2Flocalhost%3A3000";
};

export const logout = () => {
  window.location =
    "https://authp.bodhi-dev.io/logout?redirect=http%3A%2F%2Flocalhost%3A3000";
};
