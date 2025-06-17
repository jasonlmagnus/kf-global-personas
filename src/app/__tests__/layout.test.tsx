/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import RootLayout, { ThemedLayout } from "../layout";
import React from "react";

// Mock next-auth useSession hook
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "loading" }),
}));

// Capture the brand passed to ThemeProvider
let receivedBrand: string | undefined;
jest.mock("@/contexts/ThemeContext", () => ({
  ThemeProvider: ({ brand, children }: any) => {
    receivedBrand = brand;
    return <div data-brand={brand}>{children}</div>;
  },
}));

jest.mock("@/contexts/ChatbotContext", () => ({
  ChatbotProvider: ({ children }: any) => <>{children}</>,
}));

jest.mock("@/components/providers/AuthProvider", () => ({ children }: any) => (
  <>{children}</>
));

jest.mock("@/components/GlobalNav", () => () => <nav />);
jest.mock("@/components/Footer", () => () => <footer />);
jest.mock("@/components/chatbot/ChatbotPanel", () => () => <div />);

describe("Layout Components", () => {
  beforeEach(() => {
    receivedBrand = undefined;
  });

  it("ThemedLayout uses Magnus theme when session has not loaded", () => {
    const { container } = render(
      <ThemedLayout>
        <div>content</div>
      </ThemedLayout>
    );
    expect(receivedBrand).toBe("magnus");
    const wrapper = container.querySelector("[data-brand]");
    expect(wrapper).toHaveAttribute("data-brand", "magnus");
  });
});
