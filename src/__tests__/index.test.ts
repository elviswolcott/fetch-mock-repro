import { yesno } from "../index";

jest.mock("node-fetch", () => {
  const nodeFetch = jest.requireActual("node-fetch");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mock = require("fetch-mock");
  const mocked = mock.sandbox();
  /*
  Object.assign(mocked.config, {
    fetch: nodeFetch,
  });
  */
  const { default: exclude, ...internals } = nodeFetch;
  return {
    default: mocked,
    __esModule: true,
    ...internals,
    ...mocked,
  };
});
type mocked = typeof import("fetch-mock");
import _fetchMock, { Request, Response } from "node-fetch";
const fetchMock = (_fetchMock as unknown) as mocked;

// JSON to Request body
const jsonBody = (json: object): ArrayBuffer => {
  const content = JSON.stringify(json, null, 2);
  return Uint8Array.from(Buffer.from(content)).buffer;
};

const no = (url: string, options: object, request: Request): Response =>
  new Response(
    jsonBody({
      // ensures ticket depends on credentials
      answer: "no",
      image:
        "https://yesno.wtf/assets/no/26-34b31d1f0777f70c61488f67a36576a9.gif",
      forced: false,
    }),
    {
      status: 200,
    }
  );

describe("YesNo SDK", () => {
  beforeEach(() => {
    fetchMock.restore();
    fetchMock.reset();
  });
  it('answers "yes" or "no"', async () => {
    fetchMock.mock("https://yesno.wtf/api", no);
    const answer = (await yesno()).answer;
    expect(answer).toMatch(/(yes|no)/);
    console.log(1, fetchMock.calls().length);
  });
  it("includes an image", async () => {
    fetchMock.mock("https://yesno.wtf/api", no);
    const image = (await yesno()).image;
    expect(image).toBeTruthy();
    console.log(2, fetchMock.calls().length);
  });
});
