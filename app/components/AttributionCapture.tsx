"use client";

import { useEffect } from "react";
import { rememberAttribution } from "../lib/attribution";

// Запоминает источник при заходе на сайт (метки из адреса, реферер, страница входа), чтобы он дошёл
// до заявки, даже если человек сначала походил по странице или обновил её без параметров.
export function AttributionCapture() {
  useEffect(() => {
    rememberAttribution();
  }, []);
  return null;
}
