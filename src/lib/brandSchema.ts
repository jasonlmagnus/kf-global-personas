import { z } from 'zod';

export const colorSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  text: z.string(),
  textLight: z.string(),
  background: z.string(),
  headerText: z.string(),
});

export const typographySchema = z.object({
  fontFamily: z.string(),
  googleFontUrl: z.string().optional(),
});

export const navItemSchema = z.object({
  name: z.string(),
  path: z.string(),
});

export const footerLinkSchema = z.object({
  name: z.string(),
  path: z.string(),
});

export const footerSchema = z.object({
  copyrightName: z.string().optional(),
  links: z.array(footerLinkSchema).optional(),
});

export const chatbotSchema = z.object({
  headerColor: z.string(),
  assistantName: z.string(),
  assistantSubtitle: z.string(),
  welcomeMessage: z.string(),
  userBubbleColor: z.string(),
  assistantBubbleColor: z.string(),
});

export const brandConfigSchema = z.object({
  brandName: z.string(),
  logoUrl: z.string(),
  faviconUrl: z.string(),
  colors: colorSchema,
  typography: typographySchema,
  navigation: z.array(navItemSchema),
  footer: footerSchema,
  chatbot: chatbotSchema,
});

export type BrandConfig = z.infer<typeof brandConfigSchema>;
