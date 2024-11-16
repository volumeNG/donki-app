import { QueryAndAnswer } from "@/constants/interface";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";

interface TheDonkiProps {
  displayDropdown: boolean;
  setDisplayDropdown: Dispatch<SetStateAction<boolean>>;
  listOfQueryAndAnswers: Array<QueryAndAnswer>;
  addTolistOfQueryAndAnswers: (object: QueryAndAnswer) => void;
  updateQuery: (object: QueryAndAnswer) => void;
  queryAndAnswer: QueryAndAnswer | undefined;
  setQueryAndAnswer: Dispatch<SetStateAction<QueryAndAnswer | undefined>>;
  setListOfQueryAndAnswers: Dispatch<SetStateAction<Array<QueryAndAnswer>>>;
  stopButton: boolean;
  setStopButton: Dispatch<SetStateAction<boolean>>;
  stopResponseFunc: () => void;
  increaseUntruthful: () => void;
  tapVertices: any;
  setTapVertices: any;
  tappedQueryAndAnswer: QueryAndAnswer | undefined;
  setTappedQueryAndAnswer: Dispatch<SetStateAction<QueryAndAnswer | undefined>>;
  isAiDropdown: boolean;
  setIsAiDropdown: Dispatch<SetStateAction<boolean>>;
  userFile: any | null;
  setUserFileResponse: Dispatch<SetStateAction<any | null>>;
}

export const TheDonkiContext = createContext<TheDonkiProps | null>(null);
function TheDonkiProvider({ children }: any) {
  const [displayDropdown, setDisplayDropdown] = useState(true);
  const [userFile, setUserFileResponse] = useState<any | null>(null);
  const [stopButton, setStopButton] = useState(false);
  const [queryAndAnswer, setQueryAndAnswer] = useState<QueryAndAnswer>();
  const [listOfQueryAndAnswers, setListOfQueryAndAnswers] = useState<
    QueryAndAnswer[]
  >([]);
  const [tapVertices, setTapVertices] = useState(null);
  const [isAiDropdown, setIsAiDropdown] = useState(false);
  const [tappedQueryAndAnswer, setTappedQueryAndAnswer] =
    useState<QueryAndAnswer>();
  const stopResponseRef = useRef(false);

  useEffect(() => {
    if (stopResponseRef.current) {
      stopResponseRef.current = false;
    }
  }, [stopButton]);

  /**This handles removing items from the list */
  const updateQuery = (query: QueryAndAnswer) => {
    setListOfQueryAndAnswers((prevList) =>
      prevList.filter((element) => element.id != query.id)
    );
  };

  /**This gets the response from the server */
  const getResponse = async (newQuery: QueryAndAnswer) => {
    setStopButton(true);
    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/ai-config/mobile/asked`;

    // Prepare form data
    const formData = new FormData();

    formData.append(
      "conversation",
      JSON.stringify([
        {
          role: "user",
          content: newQuery.query,
        },
      ])
    );
    formData.append("model", "gpt-3.5-turbo");

    if (userFile != null) {
      formData.append("pdf", userFile);
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      /** There is no way to stream chunks with react native without the use of a web interface
       * Hence the use of the response.text() if the response is ok
       */
       console.log(response);
      if (response.ok) {
        const data = await response.text(); // Get the full response as text
        return data;
      } else {
        return "Unable to fetch data";
      }
    } catch (error) {
      Alert.alert("Error", error?.toString());
      return "error";
    }
  };

  const stopResponseFunc = () => {
    stopResponseRef.current = true; // Update the ref value
  };

  const addTolistOfQueryAndAnswers = async (newEntry: QueryAndAnswer) => {
    if (newEntry.query != null || newEntry.query != undefined) {
      setListOfQueryAndAnswers((prev) => [...prev, newEntry]);
      const response = await getResponse(newEntry);
      setUserFileResponse(null);
      if (response) {
        const words = response.split(" ");
        const messageLength = 1;
        let displayedText = "";
        for (let i = 0; i < words.length; i += messageLength) {
          const chunk = words.slice(
            i,
            Math.min(i + messageLength, words.length)
          );
          displayedText += chunk.join(" ") + " ";
          setListOfQueryAndAnswers((prev) =>
            prev.map((entry) =>
              entry.id === newEntry.id
                ? { ...entry, answer: displayedText } // Update the answer field
                : entry
            )
          );

          if (stopResponseRef.current) {
            setStopButton(false);
            stopResponseRef.current = false;
            return; // Exit the loop immediately
          }

          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }
      setStopButton(false);
    }
  };

  //TODO: Work on this
  const increaseUntruthful = async () => {
    const url = `${process.env.EXPO_PUBLIC_BASE_URL}/ai-config/increase-untruthful-count`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (ex) {
      console.log("Error", "Something went wrong. Please try again.", true);
    }
  };

  const memoizedListOfQueryAndAnswers = useMemo(
    () => listOfQueryAndAnswers,
    [listOfQueryAndAnswers]
  );
  return (
    <TheDonkiContext.Provider
      value={{
        displayDropdown,
        setDisplayDropdown,
        setListOfQueryAndAnswers,
        listOfQueryAndAnswers: memoizedListOfQueryAndAnswers,
        addTolistOfQueryAndAnswers,
        queryAndAnswer,
        updateQuery,
        setQueryAndAnswer,
        stopResponseFunc,
        stopButton,
        setStopButton,
        increaseUntruthful,
        tapVertices,
        setTapVertices,
        tappedQueryAndAnswer,
        setTappedQueryAndAnswer,
        isAiDropdown,
        setIsAiDropdown,
        userFile,
        setUserFileResponse,
      }}
    >
      {children}
    </TheDonkiContext.Provider>
  );
}

export default TheDonkiProvider;

// {
//     "statusCode": 200,
//     "success": true,
//     "message": "Info retrieved  successfully!",
//     "data": {
//         "id": "1",
//         "status": "warning",
//         "description": "There will be an update on the 4th of November by 12:00 WAT. ",
//         "createdAt": "2024-11-03T18:23:45.572Z",
//         "updatedAt": "2024-11-03T18:23:45.572Z"
//     }
// }
