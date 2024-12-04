import { StyleSheet, View } from "react-native";
import FileListScreen from "./FileListScreen";
import AudioPlayer from "./AudioPlayer";
import { FileInfo } from "./src/types/FileInfo";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";

const App: React.FC = () => {
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isRandom, setIsRandom] = useState<boolean>(false);

  useEffect(() => {
    // Configure audio settings
    async function configureAudio() {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true, // Keeps audio playing when the app is in the background
        playsInSilentModeIOS: true, // Allows audio to play even if the iOS device is in silent mode
        shouldDuckAndroid: true, // Reduces volume of other audio sources when your app plays audio
        playThroughEarpieceAndroid: false, // Determines if audio should play through the earpiece on Android
      });
    }

    configureAudio();
  }, []);

  const handleItemPress = (item: FileInfo) => {
    const index = files.findIndex((file) => file.key === item.key);
    setCurrentFileIndex(index);
  };

  const handleRandom = () => setIsRandom(!isRandom)

  const handleNext = () => {
    if (currentFileIndex !== null && currentFileIndex < files.length - 1) {
      if (!isRandom) {
        setCurrentFileIndex(currentFileIndex + 1);
      } else {
        setCurrentFileIndex(Math.floor(Math.random() * (files.length + 1)));
      }
    }
  };

  const handlePrevious = () => {
    if (currentFileIndex !== null && currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <AudioPlayer
        file={currentFileIndex !== null ? files[currentFileIndex] : undefined}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isRandom={isRandom}
        onRandom={handleRandom}
      />
      <FileListScreen onItemPress={handleItemPress} setFiles={setFiles} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
});

export default App;
