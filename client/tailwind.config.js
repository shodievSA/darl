/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
    fontFamily: {
        'inter-medium': ["Inter-Medium"],
        'inter-regular': ["Inter-Regular"]
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["black", "dark", "halloween", "night"],
    darkTheme: "black",
    base: true,
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", 
  },
};
