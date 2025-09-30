import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// eslint-disable-next-line import/extensions
import EStranslation from "@/assets/translations/es.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: EStranslation,
      },
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((err) => {
    console.log("Error initializing i18n module:", err);
  });

export { i18n };
