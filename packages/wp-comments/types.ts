import { Package, Derived } from "frontity/types";

interface WpComments extends Package {
  name: "@frontity/wp-comments";
  libraries: {
    comments: {
      Component: React.FC;
    };
  };
  state: {
    comments: {
      areOpen: string;
    };
  };
}

export default WpComments;
