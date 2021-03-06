import { createStore, InitializedStore, observe } from "@frontity/connect";
import clone from "clone-deep";
import wpSource from "../../../";
import WpSource from "../../../../types";
import Api from "../../api";
// JSON mocks
import { mockResponse } from "./mocks/helpers";
import cat1 from "./mocks/category/cat-1.json";
import cat1Posts from "./mocks/category/cat-1-posts.json";
import cat1PostsPage2 from "./mocks/category/cat-1-posts-page-2.json";
import cat1PostsCpt from "./mocks/category/cat-1-posts-cpt.json";

let store: InitializedStore<WpSource>;
let api: jest.Mocked<Api>;
beforeEach(() => {
  store = createStore(clone(wpSource()));
  store.actions.source.init();
  api = store.libraries.source.api as jest.Mocked<Api>;
});

describe("category", () => {
  test("doesn't exist in source.category", async () => {
    // Mock Api responses
    api.get = jest
      .fn()
      .mockResolvedValueOnce(mockResponse([cat1]))
      .mockResolvedValueOnce(
        mockResponse(cat1Posts, {
          "X-WP-Total": "5",
          "X-WP-TotalPages": "2"
        })
      );
    // Fetch entities
    await store.actions.source.fetch("/category/cat-1/");
    expect(store.state.source).toMatchSnapshot();
  });

  test("was populated but not accessed", async () => {
    // Add category to the store
    await store.libraries.source.populate({
      state: store.state,
      response: mockResponse([cat1])
    });
    // Mock Api responses
    api.get = jest.fn().mockResolvedValueOnce(
      mockResponse(cat1PostsPage2, {
        "X-WP-Total": "5",
        "X-WP-TotalPages": "2"
      })
    );
    // Observe changes in isFetching and isReady properties
    const dataState = [];
    observe(() => {
      const { isFetching, isReady } = store.state.source.get(
        "/category/cat-1/page/2/"
      );
      dataState.push({ isFetching, isReady });
    });
    // Fetch entities
    await store.actions.source.fetch("/category/cat-1/page/2/");
    expect(api.get).toBeCalledTimes(1);
    expect(store.state.source).toMatchSnapshot();
    // Values history of isFetching and isReady
    expect(dataState).toEqual([
      { isFetching: false, isReady: false }, // first values are from a different object
      { isFetching: false, isReady: false }, // initial values from the data object
      { isFetching: true, isReady: false }, // fetch starts
      { isFetching: false, isReady: true } // fetch ends
    ]);
  });

  test("fetchs from a different endpoint with extra params", async () => {
    // Add custom post endpoint and params
    store.state.source.postEndpoint = "multiple-post-type";
    store.state.source.params = { type: ["post", "cpt"] };
    // Mock Api responses
    api.get = jest
      .fn()
      .mockResolvedValueOnce(mockResponse([cat1]))
      .mockResolvedValueOnce(
        mockResponse(cat1PostsCpt, {
          "X-WP-Total": "5",
          "X-WP-TotalPages": "2"
        })
      );
    // Fetch entities
    await store.actions.source.fetch("/category/cat-1/");
    expect(api.get.mock.calls).toMatchSnapshot();
    expect(store.state.source).toMatchSnapshot();
  });

  test("returns 404 if category doesn't exist in WP", async () => {
    // Mock Api responses
    api.get = jest.fn().mockResolvedValue(mockResponse([]));
    // Fetch entities
    await store.actions.source.fetch("/category/non-existent/");
    expect(api.get).toBeCalledTimes(1);
    expect(store.state.source).toMatchSnapshot();
  });

  test("returns 404 if the page fetched is out of range", async () => {
    // Mock Api responses
    api.get = jest
      .fn()
      .mockResolvedValueOnce(mockResponse([cat1]))
      .mockResolvedValueOnce(mockResponse([]));
    // Fetch entities
    await store.actions.source.fetch("/category/cat-1/page/3");
    expect(store.state.source).toMatchSnapshot();
  });

  test("doesn't return 404 if the first page is empty", async () => {
    // Mock Api responses
    api.get = jest
      .fn()
      .mockResolvedValueOnce(mockResponse([cat1]))
      .mockResolvedValueOnce(
        mockResponse([], {
          "X-WP-Total": "0",
          "X-WP-TotalPages": "0"
        })
      );
    // Fetch entities
    await store.actions.source.fetch("/category/cat-1/");
    expect(store.state.source).toMatchSnapshot();
  });

  test("doesn't return 404 if the first page is empty (no headers)", async () => {
    // Mock Api responses
    api.get = jest
      .fn()
      .mockResolvedValueOnce(mockResponse([cat1]))
      .mockResolvedValueOnce(mockResponse([], {}));
    // Fetch entities
    await store.actions.source.fetch("/category/cat-1/");
    expect(store.state.source).toMatchSnapshot();
  });
});
