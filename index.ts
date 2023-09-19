import Auth0Context from "./src/Auth0Context.ts";
import Auth0Provider from "./src/Auth0Provider.tsx";
import useAuth0 from "./src/useAuth0.ts";
import createStorage from "./src/utils/createStorage.ts";
import handleDomainUrl from "./src/utils/handleDomainUrl.ts";

const __UNSAFE__Auth0Context = Auth0Context;

export {
  __UNSAFE__Auth0Context,
  Auth0Provider,
  useAuth0,
  createStorage,
  handleDomainUrl,
};

export type * from "./src/types.d.ts";
