import { api, getEventById } from "@/lib/api";

function mockFetch(status: number, body: string, contentType = "application/json") {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: { get: (key: string) => (key === "content-type" ? contentType : null) },
    text: () => Promise.resolve(body),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("api error handling", () => {
  it("throws with the detail field from a ProblemDetails response", async () => {
    mockFetch(400, JSON.stringify({ detail: "Age must be positive." }));
    await expect(api.getOrganizations()).rejects.toThrow("Age must be positive.");
  });

  it("throws with the title field when detail is absent", async () => {
    mockFetch(404, JSON.stringify({ title: "Not Found" }));
    await expect(api.getOrganizations()).rejects.toThrow("Not Found");
  });

  it("throws with the raw body when the error is a plain JSON string", async () => {
    mockFetch(400, JSON.stringify("Organization not found."));
    await expect(api.getOrganizations()).rejects.toThrow("Organization not found.");
  });

  it("throws a generic message when the error is an HTML page", async () => {
    mockFetch(500, "<html><body>Internal Server Error</body></html>", "text/html");
    await expect(api.getOrganizations()).rejects.toThrow(
      "The API returned an HTML error page instead of JSON."
    );
  });

  it("detects an ngrok tunnel error from the HTML body", async () => {
    mockFetch(
      502,
      "<html>ERR_NGROK_8012 tunnel not found</html>",
      "text/html"
    );
    await expect(api.getOrganizations()).rejects.toThrow(/ERR_NGROK_8012/);
  });

  it("throws when a successful response returns HTML instead of JSON", async () => {
    mockFetch(200, "<html>oops</html>", "text/html");
    await expect(api.getOrganizations()).rejects.toThrow(
      "The API returned HTML instead of JSON."
    );
  });
});

describe("api response normalization", () => {
  it("normalizes a PascalCase organization response", async () => {
    const raw = [{ Id: 1, Name: "Acme", Description: "A company" }];
    mockFetch(200, JSON.stringify(raw));
    const orgs = await api.getOrganizations();
    expect(orgs).toEqual([{ id: 1, name: "Acme", description: "A company" }]);
  });

  it("normalizes a camelCase organization response", async () => {
    const raw = [{ id: 2, name: "Beta", description: "B company" }];
    mockFetch(200, JSON.stringify(raw));
    const orgs = await api.getOrganizations();
    expect(orgs).toEqual([{ id: 2, name: "Beta", description: "B company" }]);
  });

  it("returns an empty array when the response is not an array", async () => {
    mockFetch(200, JSON.stringify(null));
    const orgs = await api.getOrganizations();
    expect(orgs).toEqual([]);
  });

  it("unwraps a { Result: [...] } envelope before parsing", async () => {
    const raw = { Result: JSON.stringify([{ Id: 3, Name: "Gamma", Description: "" }]) };
    mockFetch(200, JSON.stringify(raw));
    const orgs = await api.getOrganizations();
    expect(orgs[0]).toMatchObject({ id: 3, name: "Gamma" });
  });

  it("returns null from getEventById when response body is empty", async () => {
    mockFetch(200, "");
    const event = await getEventById(99);
    expect(event).toBeNull();
  });
});
