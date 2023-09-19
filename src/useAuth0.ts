import { useContext, useEffect, useState } from "react";
import Auth0Context from "./Auth0Context";
import jwtDecode from "jwt-decode";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { UserAuth0 } from "./types";
import * as Crypto from "expo-crypto";

const redirectUri = AuthSession.makeRedirectUri({
  scheme: Constants.expoConfig?.scheme as string,
});

function useAuth0<UserExtraAttributes>() {
  const [codeChallenge, setCodeChallenge] = useState<string>();

  useEffect(() => {
    Crypto.getRandomBytesAsync(32).then((bytes) => {
      setCodeChallenge(bytes.toString());
    });

    if (process.env.NODE_ENV === "development")
      console.log(`Redirect URI: ${redirectUri}`);

    if (Platform.OS === "web") WebBrowser.maybeCompleteAuthSession();

    if (!Constants.expoConfig?.scheme) {
      throw new Error(
        `The scheme is missing from your app configuration. You must provide the scheme in app.json.`
      );
    }
  }, []);

  const {
    user,
    setUser,
    authentication,
    storage,
    setCredentials,
    credentials,
  } = useContext(Auth0Context);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: authentication.clientId,
      redirectUri: redirectUri,
      codeChallenge,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      scopes: authentication.scopes ?? ["openid", "profile", "email"],
      extraParams: authentication.audience
        ? {
            audience: authentication.audience,
          }
        : {},
      responseType: "code",
    },
    {
      authorizationEndpoint: `${authentication.domain}/authorize`,
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const authorize = async () => {
    try {
      setIsLoading(true);
      const result = await promptAsync();

      if (result?.type !== "success") throw new Error(result.type);

      const credentialsData = await fetch(
        `${authentication.domain}/oauth/token`,
        {
          body: JSON.stringify({
            code_verifier: request?.codeVerifier,
            code: result?.params.code,
            client_id: authentication.clientId,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
            audience: authentication.audience,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      ).then((res) => res.json());

      const userData = jwtDecode(credentialsData.id_token) as UserAuth0 &
        UserExtraAttributes;

      setUser(userData);
      setCredentials(credentialsData);
      if (storage) {
        await storage.setItem("credentials", JSON.stringify(credentialsData));
        await storage.setItem("user", JSON.stringify(userData));
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCredentials = () => credentials;

  const clearCredentials = async () => {
    setCredentials(undefined);

    if (storage)
      await Promise.all([
        storage.removeItem("user"),
        storage.removeItem("credentials"),
      ]);
  };

  const clearSession = async () => {
    clearCredentials();
    setUser(undefined);
    await fetch(
      `${authentication.domain}/v2/logout?client_id=${authentication.clientId}`,
      {
        headers: {
          Authorization: `${credentials?.token_type} ${credentials?.access_token}`,
        },
        method: "GET",
      }
    );
  };

  const sendChangePasswordEmail = async (email: string) => {
    return await fetch(
      `${authentication.domain}/dbconnections/change_password`,
      {
        body: JSON.stringify({
          client_id: authentication.clientId,
          email,
          connection: "Username-Password-Authentication",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    ).then((res) => res.text());
  };

  return {
    // States
    user: user as UserAuth0 & UserExtraAttributes,
    isLoading,
    error,
    // Methods
    authorize,
    clearSession,
    getCredentials,
    clearCredentials,
    sendChangePasswordEmail,
    // sendSMSCode,
    // authorizeWithSMS,
    // sendEmailCode,
    // authorizeWithEmail,
    // sendMultifactorChallenge,
    // authorizeWithOOB,
    // authorizeWithOTP,
    // authorizeWithRecoveryCode,
    // hasValidCredentials,
    // requireLocalAuthentication
  };
}

export default useAuth0;
