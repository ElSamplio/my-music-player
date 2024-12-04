import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio, AVPlaybackStatus } from "expo-av";
import { FileInfo } from "./src/types/FileInfo";

interface AudioPlayerProps {
  file: FileInfo | undefined;
  onNext: () => void;
  onPrevious: () => void;
  onRandom?: () => void;
  isRandom?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  file,
  onNext,
  onPrevious,
  isRandom,
  onRandom,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (sound) {
      sound.unloadAsync();
    }
    setSound(null);
    setIsPlaying(false);

    if (file?.fileUri) {
      loadAndPlay();
    }
  }, [file]);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        onNext(); // Automatically play the next song
      }
    }
  };

  const loadAndPlay = async () => {
    if (file?.fileUri) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: file.fileUri },
        { shouldPlay: true }
      );
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
    }
  };

  const playPause = async () => {
    if (sound) {
      isPlaying ? await sound.pauseAsync() : await sound.playAsync();
    }
  };

  const seek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Playing: {file?.fileName || "Select a file"}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={seek}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1DB954"
      />
      <View style={styles.controls}>
        <Button
          title="Random"
          onPress={onRandom}
          color={isRandom ? "#89A07F" : ""}
        />
        <Button title="Previous" onPress={onPrevious} />
        <Button title={isPlaying ? "Pause" : "Play"} onPress={playPause} />
        <Button title="Next" onPress={onNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  randomPressed: {
    backgroundColor: "#889900",
  },
});

export default AudioPlayer;
