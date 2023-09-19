import { createContext } from "react";
import { Auth0ContextType } from "./types";

const Auth0Context = createContext<Auth0ContextType>({} as Auth0ContextType);

export default Auth0Context;
