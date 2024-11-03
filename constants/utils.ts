import * as Clipboard from "expo-clipboard";

export const copyToClipboard = async (content:string) => {
  await Clipboard.setStringAsync(content);
};
