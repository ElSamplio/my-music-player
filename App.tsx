import { StyleSheet, View } from "react-native";
import FileListScreen from "./FileListScreen";
import AudioPlayer from "./AudioPlayer";
import { FileInfo } from "./src/types/FileInfo";
import { useState } from "react";

const App: React.FC = () => {
  const handleItemPress = (item: FileInfo) => {
    setCurrentFile(item);
  };

  const [currentFile, setCurrentFile] = useState<FileInfo>();

  return (
    <View style={styles.container}>
      <AudioPlayer file={currentFile} />
      <FileListScreen onItemPress={handleItemPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  player: {
    flex: 3,
  },
  list: {
    flex: 9,
  },
});

export default App;
