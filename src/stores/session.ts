const SESSION_KEY = "session";

const session = {
  set: function (value: string) {
    sessionStorage.setItem(SESSION_KEY, value);
  },
  get: function () {
    const result = sessionStorage.getItem(SESSION_KEY);
    return result ? result : null;
  },
  delete: function () {
    sessionStorage.removeItem(SESSION_KEY);
  },
};

export default session;
