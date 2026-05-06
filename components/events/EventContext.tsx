'use client'

import { createContext, useContext } from "react";
import { OrganizationEvent } from "@/lib/api";

type EventContextValue = {
  event: OrganizationEvent | null;
  isCreator: boolean;
  isRegistered: boolean;
  setEvent: (event: OrganizationEvent) => void;
  setIsRegistered: (registered: boolean) => void;
};

export const EventContext = createContext<EventContextValue>({
  event: null,
  isCreator: false,
  isRegistered: false,
  setEvent: () => {},
  setIsRegistered: () => {},
});

export const useEvent = () => useContext(EventContext).event;
export const useEventContext = () => useContext(EventContext);
