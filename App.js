import { MainScreenNavigator } from "./src/navigators/MainScreenNavigator";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";
export default function App() {
  return (
    <ActionSheetProvider>
      <MainScreenNavigator />
    </ActionSheetProvider>
  );
}
