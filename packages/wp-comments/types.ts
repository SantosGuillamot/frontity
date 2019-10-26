import { Package, Derived } from "frontity/types";

interface WpComments extends Package {
  name: "@frontity/wp-comments";
  roots: {
    comments: React.FC;
  };
  state: {
    comments: {
      areOpen: boolean;
    };
  };
}

export default WpComments;
