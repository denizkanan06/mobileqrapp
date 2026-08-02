"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Event } from "@/types/event";

type EventContextType = {
  events: Event[];
  addEvent: (event: Event) => void;
  deleteEvent: (id: number) => void;
  updateEvent: (event: Event) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");

    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events, loaded]);

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event]);
  };

  const deleteEvent = (id: number) => {
    setEvents((prev) =>
      prev.filter((event) => event.id !== id)
    );
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return (
    <EventContext.Provider
      value={{
        events,
        addEvent,
        deleteEvent,
        updateEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error(
      "useEventContext must be used inside EventProvider"
    );
  }

  return context;
}