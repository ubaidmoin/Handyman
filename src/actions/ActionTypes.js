// @flow
const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";
const CANCEL = "CANCEL";

function createRequestTypes(base) {
  const res = {};
  [REQUEST, SUCCESS, FAILURE, CANCEL].forEach(type => {
    res[type] = `${base}_${type}`;
  });
  return res;
}

// empty action type , Demo to create an action type
export const EMPTY = createRequestTypes("EMPTY");

// user related action types
export const USER = createRequestTypes("USER");

export const LOGOUT = "LOGOUT";

export const NETWORK_INFO = "NETWORK_INFO";
