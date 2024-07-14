import React from "react";
import { LANGUAGES } from "../utils/presets";

export default function Translation(props) {
  const {
    translation,
    textElement,
    toLanguage,
    translating,
    setTranslation,
    setTranslating,
    setToLanguage,
  } = props;

  return (
    <div className="flex flex-col gap-2 max-w-[400px] w-full mx-auto">
      <div className="flex items-stretch gap-2 ">
        <select
          className="flex-1 outline-none bg-white focus:outline-none 
        border border-solid border-transparent
        hover:border-blue-300 duration-200 p-2 rounded"
          value={toLanguage}
          onChange={(e) => setToLanguage(e.target.value)}
        >
          <option value={"Select Language"}>Select Language</option>
          {Object.entries(LANGUAGES).map(([key, value]) => {
            return (
              <option key={key} value={value}>
                {" "}
                {key}{" "}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
