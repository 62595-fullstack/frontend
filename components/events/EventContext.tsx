'use client'

import { createContext, useContext } from "react";
import { OrganizationEvent } from "@/lib/api";

type EventContextValue = {
  event: OrganizationEvent | null;
  isCreator: boolean;
  setEvent: (event: OrganizationEvent) => void;
};

export const EventContext = createContext<EventContextValue>({
  event: null,
  isCreator: false,
  setEvent: () => {},
});

export const useEvent = () => useContext(EventContext).event;
export const useEventContext = () => useContext(EventContext);
