import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface ColorContextProps {
  colorScheme: "light" | "dark";
  setColorScheme: Dispatch<SetStateAction<"light" | "dark">>;
  displayToast: boolean;
  setToastDisplay: Dispatch<SetStateAction<boolean>>;
}
export const ColorContext = createContext<ColorContextProps | null>(null);

function DonkiColorProvider({ children }: any) {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  const [displayToast, setToastDisplay] = useState<boolean>(false);
  return (
    <ColorContext.Provider
      value={{ colorScheme, setColorScheme, displayToast, setToastDisplay }}
    >
      {children}
    </ColorContext.Provider>
  );
}

export default DonkiColorProvider;
