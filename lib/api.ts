export const API_BASE = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = await res.text();
  const contentType = res.headers.get("content-type") ?? "";
  const isHtmlResponse = contentType.includes("text/html");

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    if (body) {
      if (isHtmlResponse) {
        if (body.includes("ERR_NGROK_8012") || /ngrok/i.test(body)) {
          message =
            "The API tunnel is reachable, but ngrok cannot connect to the backend service at localhost:5000 (ERR_NGROK_8012).";
        } else {
          message = "The API returned an HTML error page instead of JSON.";
        }
      } else {
      try {
        const parsed = JSON.parse(body);
        // ASP.NET Core ProblemDetails
        if (parsed?.detail) message = parsed.detail;
        else if (parsed?.title) message = parsed.title;
        // Plain JSON string e.g. "Organization with ID 15 does not exist."
        else if (typeof parsed === "string") message = parsed;
        else message = body;
      } catch {
        message = body;
      }
      }
    }
    throw new Error(message);
  }

  if (!body) return undefined as T;
  if (isHtmlResponse) {
    throw new Error("The API returned HTML instead of JSON.");
  }
  try { return JSON.parse(body) as T; } catch { return body as T; }
}

export type Organization = { id: number; name: string; description: string };

export type Post = {
  id: number;
  title?: string;
  createdDate?: string;
  organizationId?: number;
  bodytext?: string;
};
export type Attachment = {
  id?: number;
  fileName: string;
  fileType: string;
  content: string; // base64-encoded binary
  createdDate?: string;
};

export type OrganizationEvent = {
  id: number;
  organizationId: number;
  userOrganizationBindingId: number;
  title: string;
  description: string;
  rules: string;
  attachment: Attachment | null;
  createdDate?: string;
  startDate?: string;
  ageLimit?: number;
  creatorName?: string;
};
export type UserOrganizationBinding = { id: number; organizationId: number };
export type GdprDeleteResult = boolean;
export type FriendSummary = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  friendsSince: string;
};

export type UserSearchResult = {
  id: string;
  firstName: string;
  lastName: string;
};

export type UserSummary = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number;
};

export type MemberSummary = {
  id: string;
  firstName: string;
  lastName: string;
  memberSince: string;
  role: string;
};

type RawOrganization = {
  Id?: number;
  id?: number;
  Name?: string;
  name?: string;
  Description?: string;
  description?: string;
};

type RawPost = {
  Id?: number;
  Title?: string;
  BodyText?: string;
  CreatedDate?: string;
  OrganizationId?: number;
  OrganizationEventId?: number;
};

type RawEvent = {
  Id?: number;
  id?: number;
  OrganizationId?: number;
  organizationId?: number;
  UserOrganizationBindingId?: number;
  userOrganizationBindingId?: number;
  Title?: string;
  title?: string;
  Description?: string;
  description?: string;
  Rules?: string;
  rules?: string;
  Attachment?: Attachment | null;
  attachment?: Attachment | null;
  CreatedDate?: string;
  createdDate?: string;
  StartDate?: string;
  startDate?: string;
  AgeLimit?: number;
  ageLimit?: number;
  CreatorName?: string;
  creatorName?: string;
};

function parseJsonish(data: unknown): unknown {
  if (typeof data !== "string") return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

function unwrapResult(data: unknown): unknown {
  const payload = parseJsonish(data);
  if (payload && typeof payload === "object" && "Result" in payload) {
    return parseJsonish((payload as { Result?: unknown }).Result);
  }
  return payload;
}

function parseArrayResponse<TRaw, TParsed>(
  data: unknown,
  normalize: (raw: TRaw) => TParsed
): TParsed[] {
  const payload = unwrapResult(data);
  if (!Array.isArray(payload)) return [];
  return payload.map((item) => normalize(item as TRaw));
}

function normalizePost(raw: RawPost): Post {
  return {
    id: raw.Id ?? 0,
    title: raw.Title ?? "",
    createdDate: raw.CreatedDate ?? "",
    organizationId: raw.OrganizationId ?? raw.OrganizationEventId ?? 0,
    bodytext: raw.BodyText ?? "",
  };
}

function normalizeOrganization(raw: RawOrganization): Organization {
  return {
    id: raw.Id ?? raw.id ?? 0,
    name: raw.Name ?? raw.name ?? "",
    description: raw.Description ?? raw.description ?? "",
  };
}

function parsePostsResponse(data: unknown): Post[] {
  return parseArrayResponse<RawPost, Post>(data, normalizePost);
}

function parseOrganizationsResponse(data: unknown): Organization[] {
  return parseArrayResponse<RawOrganization, Organization>(
    data,
    normalizeOrganization
  );
}

function normalizeEvent(raw: RawEvent): OrganizationEvent {
  return {
    id: raw.Id ?? raw.id ?? 0,
    organizationId: raw.OrganizationId ?? raw.organizationId ?? 0,
    userOrganizationBindingId:
      raw.UserOrganizationBindingId ?? raw.userOrganizationBindingId ?? 0,
    title: raw.Title ?? raw.title ?? "",
    description: raw.Description ?? raw.description ?? "",
    rules: raw.Rules ?? raw.rules ?? "",
    attachment: raw.Attachment ?? raw.attachment ?? null,
    createdDate: raw.CreatedDate ?? raw.createdDate ?? "",
    startDate: raw.StartDate ?? raw.startDate ?? "",
    ageLimit: raw.AgeLimit ?? raw.ageLimit ?? 0,
    creatorName: raw.CreatorName ?? raw.creatorName ?? "",
  };
}

function parseEventsResponse(data: unknown): OrganizationEvent[] {
  return parseArrayResponse<RawEvent, OrganizationEvent>(data, normalizeEvent);
}

export const api = {
  // posts
  getPosts: async (): Promise<Post[]> => {
    const data = await request<unknown>("/posts");
    return parsePostsResponse(data);
  },

  getPostsByOrganization: async (organizationsId: number): Promise<Post[]> => {
    const data = await request<unknown>(`/posts/${organizationsId}`);
    return parsePostsResponse(data);
  },

  // organizations
  getOrganizations: async (): Promise<Organization[]> => {
    const data = await request<unknown>("/organizations");
    return parseOrganizationsResponse(data);
  },
  getOrganizationById: async (id: number): Promise<Organization> => {
    const data = await request<unknown>(`/organizations/${id}`);
    const parsed = parseOrganizationsResponse(data);
    if (parsed[0]) return parsed[0];

    const payload = unwrapResult(data);
    if (payload && typeof payload === "object") {
      return normalizeOrganization(payload as RawOrganization);
    }

    return { id, name: "", description: "" };
  },
  createOrganization: (org: { name: string; description: string }) =>
    request<string>(`/organizations`, {
      method: "POST",
      body: JSON.stringify({ id: 0, name: org.name, description: org.description, createdDate: new Date().toISOString() }),
    }),
  deleteOrganization: (id: number) =>
    request<boolean>(`/organizations/${id}`, { method: "DELETE" }),

  // bindings
  getUserOrganizationBindings: (organizationId: number) =>
    request<UserOrganizationBinding[]>(
      `/UserOrganizationBinding/${organizationId}`
    ),
  getUserOrganizationBindingsForCurrentUser: () =>
    request<UserOrganizationBinding[]>(`/UserOrganizationBinding/me`),
  getUserOrganizationBindingForCurrentUser: (organizationId: number) =>
    request<UserOrganizationBinding>(
      `/UserOrganizationBinding/${organizationId}/me`
    ),

  // events
  getOrganizationEvents: async (organizationId: number): Promise<OrganizationEvent[]> => {
    const data = await request<unknown>(`/OrganizationEvents/${organizationId}`);
    return parseEventsResponse(data);
  },
  createOrganizationEvent: (event: OrganizationEvent) =>
    request<string>(`/OrganizationEvents`, {
      method: "POST",
      body: JSON.stringify(event),
    }),
  deleteOrganizationEvent: (id: number) =>
    request<void>(`/OrganizationEvents/${id}`, { method: "DELETE" }),
  updateEvent: (id: number, fields: { description?: string; rules?: string }) =>
    request<void>(`/OrganizationEvents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    }),

  // GDPR
  deleteGdprByUserId: (userId: number) =>
    request<GdprDeleteResult>(`/GDPR/${userId}`, { method: "DELETE" }),

  // users
  getMe: () => request<UserSummary>(`/users/me`),
  searchUsers: (query: string) => request<UserSearchResult[]>(`/users?query=${encodeURIComponent(query)}`),
  getUserById: (userId: string) => request<UserSummary>(`/users/${userId}`),
  getPostsByUser: async (userId: string): Promise<Post[]> => {
    const data = await request<unknown>(`/users/${userId}/posts`);
    return parsePostsResponse(data);
  },
  getFriendsByUser: (userId: string) => request<FriendSummary[]>(`/users/${userId}/friends`),
  getMyFriends: () => request<FriendSummary[]>(`/users/me/friends`),
  addFriend: (friendUserId: string) => request<FriendSummary>(`/users/me/friends`, {
    method: "POST",
    body: JSON.stringify({ friendUserId }),
  }),
  removeFriend: (friendUserId: string) => request<void>(`/users/me/friends/${friendUserId}`, { method: "DELETE" }),
};

export async function getEventById(eventId: number): Promise<OrganizationEvent | null> {
  return request<OrganizationEvent | null>(`/OrganizationEvents/event/${eventId}`);
}
