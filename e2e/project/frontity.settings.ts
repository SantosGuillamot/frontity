import { Settings } from "frontity/types";

const settings: Settings = [
  {
    name: "head",
    packages: ["head"]
  },
  {
    name: "fonts",
    packages: [
      {
        name: "@frontity/tiny-router",
        state: { router: { autoFetch: false } }
      },
      "fonts"
    ]
  }
];

export default settings;
