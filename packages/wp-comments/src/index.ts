import WpComments from "../types";
import Component from "./components";

const comments = (): WpComments => ({
  name: "@frontity/wp-comments",
  libraries: {
    comments: { Component }
  },
  state: {
    comments: {
      areOpen: "true"
    }
  }
});

export default comments;
