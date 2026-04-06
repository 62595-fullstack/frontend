'use client'

import { createContext, useContext } from "react";
import { OrganizationEvent } from "@/lib/api";

export const EventContext = createContext<OrganizationEvent | null>(null);
export const useEvent = () => useContext(EventContext);
