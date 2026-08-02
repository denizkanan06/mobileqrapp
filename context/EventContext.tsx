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
  addParticipantsToEvent: (
    eventId: number,
    participants: Event["participants"]
  ) => void;
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
      try {
        const parsedEvents = JSON.parse(savedEvents) as Event[];

        const normalizedEvents = parsedEvents.map((event) => ({
          ...event,
          participants: event.participants ?? [],
        }));

        setEvents(normalizedEvents);
      } catch (error) {
        console.error("Etkinlik verileri okunamadı:", error);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events, loaded]);

  const addEvent = (event: Event) => {
    setEvents((previousEvents) => [...previousEvents, event]);
  };

  const deleteEvent = (id: number) => {
    setEvents((previousEvents) =>
      previousEvents.filter((event) => event.id !== id)
    );
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const addParticipantsToEvent = (
    eventId: number,
    participants: Event["participants"]
  ) => {
    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              participants,
            }
          : event
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
        addParticipantsToEvent,
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