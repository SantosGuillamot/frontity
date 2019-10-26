import React from "react";
import { connect } from "frontity";
import { Connect } from "frontity/types";
import WpComments from "../../types";

const Root: React.FC<Connect<WpComments>> = ({ state }) => (
  <>
    <div>Is {state.comments.areOpen}</div>
  </>
);

export default connect(Root);
