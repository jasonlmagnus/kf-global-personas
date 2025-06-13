import { z } from "zod";

// Defining a schema for a list of strings with at least one item
const nonEmptyStringList = z.array(z.string()).min(1);

// Main Persona Schema
export const personaSchema = z.object({
  title: z.string().nonempty(),
  role: z.string().nonempty(),
  persona: z.object({
    summary: z.string().nonempty(),
    name: z.string().nonempty(),
    age: z.number().positive(),
    pronouns: z.string().nonempty(),
    education: z.string().nonempty(),
    job_title: z.string().nonempty(),
    reports_to: z.string().nonempty(),
    direct_reports: z.number().int().positive().optional(),
    responsibilities: nonEmptyStringList,
    goals: nonEmptyStringList,
    challenges: nonEmptyStringList,
    communication_style: z.string().nonempty(),
    preferred_channels: nonEmptyStringList,
    tools: nonEmptyStringList,
    quote: z.string().nonempty(),
    image_url: z.string().url(),
  }),
  behavioral_insights: z.object({
    drivers: nonEmptyStringList,
    competencies: nonEmptyStringList,
    traits: nonEmptyStringList,
  }),
  talking_points: nonEmptyStringList,
  objections: nonEmptyStringList,
  ideal_content: z.object({
    formats: nonEmptyStringList,
    topics: nonEmptyStringList,
  }),
});
