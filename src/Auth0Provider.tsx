import React from "react";
import { useEffect, useState } from "react";
import { Auth0ProviderProps, Credentials, UserAuth0 } from "./types";
import handleDomainUrl from "./utils/handleDomainUrl";
import Auth0Context from "./Auth0Context";

const Auth0Provider: React.FC<Auth0ProviderProps> = ({
  children,
  storage,
  ...authentication
}) => {
  useEffect(() => {
    if (storage) {
      (async () => {
        const user = JSON.parse((await storage.getItem("user")) as string);
        setUser(user);
      })();

      (async () => {
        const credentials = JSON.parse(
          (await storage.getItem("credentials")) as string
        );
        setCredentials(credentials);
      })();
    }
  }, [storage]);

  const [user, setUser] = useState<UserAuth0 | undefined>(undefined);
  const [credentials, setCredentials] = useState<Credentials | undefined>(
    undefined
  );

  return (
    <Auth0Context.Provider
      value={{
        authentication: {
          ...authentication,
          domain: handleDomainUrl(authentication.domain),
        },
        user,
        credentials,
        setCredentials,
        setUser,
        storage,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};

export default Auth0Provider;
