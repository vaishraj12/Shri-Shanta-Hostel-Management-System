import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {

      fontFamily: {
        grotesque: ["Bricolage Grotesque", "sans-serif"]
      },

      colors: {
        sidebar: {
    DEFAULT: "hsl(var(--sidebar-background))",
    foreground: "hsl(var(--sidebar-foreground))",
    accent: "hsl(var(--sidebar-accent))",
    border: "hsl(var(--sidebar-border))",
  },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        popover: "hsl(var(--popover))",

        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",

        muted: "hsl(var(--muted))",
        accent: "hsl(var(--accent))",

        destructive: "hsl(var(--destructive))",

        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))"
      }

    }
  },
  plugins: [tailwindcssAnimate]
}

export default config