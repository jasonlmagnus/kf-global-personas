import { render, screen } from "@testing-library/react";
import HeaderBanner from "../HeaderBanner";

jest.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: { brandName: "Test Brand" },
    isLoading: false,
  }),
}));

describe("HeaderBanner", () => {
  it("renders the brand name from theme", () => {
    render(<HeaderBanner />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Brand"
    );
  });
});
