export type AuthenticationType = {
  domain: string;
  clientId: string;
  audience?: string;
  scopes?: string[];
};

export type Auth0ProviderProps = AuthenticationType & {
  children: React.ReactNode;
  storage?: PersistentStorage;
};

export type UserAuth0 = {
  aud: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nickname: string;
  picture: string;
  sid: string;
  sub: string;
  updated_at: string;
};

export type Credentials = {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
};

export type Auth0ContextType = {
  authentication: AuthenticationType;
  user?: UserAuth0;
  setUser: React.Dispatch<React.SetStateAction<UserAuth0 | undefined>>;
  credentials?: Credentials;
  setCredentials: React.Dispatch<React.SetStateAction<any | undefined>>;
  storage?: PersistentStorage;
};

export type PersistentStorage = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
};
