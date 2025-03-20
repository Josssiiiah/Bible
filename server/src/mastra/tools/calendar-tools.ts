import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { initializeGoogleAuth } from "../utils/auth-server";

// Cache the OAuth client to avoid reinitializing it for each request
let oauth2Client: OAuth2Client | null = null;

/**
 * Helper function to ensure the OAuth client is initialized
 */
async function getOAuth2Client(): Promise<OAuth2Client> {
  if (!oauth2Client) {
    const client = await initializeGoogleAuth();
    if (!client) {
      throw new Error(
        "Failed to initialize Google Calendar authentication. Please make sure you have proper credentials set up."
      );
    }
    oauth2Client = client;
  }
  return oauth2Client;
}

/**
 * List available calendars
 */
export const listCalendarsTool = createTool({
  id: "list-calendars",
  description: "List all available Google Calendars for the authenticated user",
  inputSchema: z.object({}),
  outputSchema: z.array(
    z.object({
      id: z.string(),
      summary: z.string(),
    })
  ),
  execute: async () => {
    const auth = await getOAuth2Client();
    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.calendarList.list();
    const calendars = response.data.items || [];

    return calendars.map((cal) => ({
      id: cal.id || "",
      summary: cal.summary || "Untitled Calendar",
    }));
  },
});

/**
 * List events from a calendar
 */
export const listEventsTool = createTool({
  id: "list-events",
  description: "List events from a Google Calendar",
  inputSchema: z.object({
    calendarId: z.string().describe("ID of the calendar to list events from"),
    timeMin: z
      .string()
      .optional()
      .describe("Start time in ISO format (optional)"),
    timeMax: z
      .string()
      .optional()
      .describe("End time in ISO format (optional)"),
  }),
  outputSchema: z.array(
    z.object({
      id: z.string(),
      summary: z.string(),
      start: z.string(),
      end: z.string(),
      location: z.string().optional(),
      attendees: z
        .array(
          z.object({
            email: z.string(),
            responseStatus: z.string().optional(),
          })
        )
        .optional(),
    })
  ),
  execute: async ({ context }) => {
    const auth = await getOAuth2Client();
    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.list({
      calendarId: context.calendarId,
      timeMin: context.timeMin,
      timeMax: context.timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    return events.map((event) => ({
      id: event.id || "",
      summary: event.summary || "Untitled Event",
      start: event.start?.dateTime || event.start?.date || "",
      end: event.end?.dateTime || event.end?.date || "",
      location: event.location,
      attendees: event.attendees?.map((attendee) => ({
        email: attendee.email || "",
        responseStatus: attendee.responseStatus,
      })),
    }));
  },
});

/**
 * Create a new calendar event
 */
export const createEventTool = createTool({
  id: "create-event",
  description: "Create a new event in Google Calendar",
  inputSchema: z.object({
    calendarId: z.string().describe("ID of the calendar to create event in"),
    summary: z.string().describe("Title of the event"),
    description: z.string().optional().describe("Description of the event"),
    start: z.string().describe("Start time in ISO format"),
    end: z.string().describe("End time in ISO format"),
    location: z.string().optional().describe("Location of the event"),
    attendees: z
      .array(
        z.object({
          email: z.string().describe("Email address of the attendee"),
        })
      )
      .optional()
      .describe("List of attendees"),
  }),
  outputSchema: z.object({
    id: z.string(),
    summary: z.string(),
    htmlLink: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const auth = await getOAuth2Client();
    const calendar = google.calendar({ version: "v3", auth });

    const event = await calendar.events.insert({
      calendarId: context.calendarId,
      requestBody: {
        summary: context.summary,
        description: context.description,
        start: { dateTime: context.start },
        end: { dateTime: context.end },
        location: context.location,
        attendees: context.attendees,
      },
    });

    return {
      id: event.data.id || "",
      summary: event.data.summary || "",
      htmlLink: event.data.htmlLink,
    };
  },
});

/**
 * Update an existing calendar event
 */
export const updateEventTool = createTool({
  id: "update-event",
  description: "Update an existing event in Google Calendar",
  inputSchema: z.object({
    calendarId: z.string().describe("ID of the calendar containing the event"),
    eventId: z.string().describe("ID of the event to update"),
    summary: z.string().optional().describe("New title of the event"),
    description: z.string().optional().describe("New description of the event"),
    start: z.string().optional().describe("New start time in ISO format"),
    end: z.string().optional().describe("New end time in ISO format"),
    location: z.string().optional().describe("New location of the event"),
    attendees: z
      .array(
        z.object({
          email: z.string().describe("Email address of the attendee"),
        })
      )
      .optional()
      .describe("List of attendees"),
  }),
  outputSchema: z.object({
    id: z.string(),
    summary: z.string(),
    updated: z.boolean(),
  }),
  execute: async ({ context }) => {
    const auth = await getOAuth2Client();
    const calendar = google.calendar({ version: "v3", auth });

    const requestBody: any = {};

    if (context.summary) requestBody.summary = context.summary;
    if (context.description) requestBody.description = context.description;
    if (context.start) requestBody.start = { dateTime: context.start };
    if (context.end) requestBody.end = { dateTime: context.end };
    if (context.location) requestBody.location = context.location;
    if (context.attendees) requestBody.attendees = context.attendees;

    const event = await calendar.events.patch({
      calendarId: context.calendarId,
      eventId: context.eventId,
      requestBody,
    });

    return {
      id: event.data.id || "",
      summary: event.data.summary || "",
      updated: true,
    };
  },
});

/**
 * Delete a calendar event
 */
export const deleteEventTool = createTool({
  id: "delete-event",
  description: "Delete an event from Google Calendar",
  inputSchema: z.object({
    calendarId: z.string().describe("ID of the calendar containing the event"),
    eventId: z.string().describe("ID of the event to delete"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const auth = await getOAuth2Client();
    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.delete({
      calendarId: context.calendarId,
      eventId: context.eventId,
    });

    return {
      success: true,
      message: `Event ${context.eventId} successfully deleted from calendar ${context.calendarId}`,
    };
  },
});
