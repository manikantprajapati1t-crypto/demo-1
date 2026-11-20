import { createContext, useContext } from "react";

/** True once the page loader has finished and hero animations may play. */
export const ReadyContext = createContext(false);
export const useReady = () => useContext(ReadyContext);
