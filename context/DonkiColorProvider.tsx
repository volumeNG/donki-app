import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ColorContextProps {
  colorScheme: "light" | "dark";
  setColorScheme: Dispatch<SetStateAction<"light" | "dark">>;
}
export const ColorContext = createContext<ColorContextProps | null>(null);

function DonkiColorProvider({ children }: any) {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  return (
    <ColorContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorContext.Provider>
  );
}

export default DonkiColorProvider;
