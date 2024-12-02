import React, { useState } from "react";
import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import useFetchList from "./src/hooks/useFetchList";
import { FileInfo } from "./src/types/FileInfo";

interface FileListScreenProps {
  onItemPress: (item: FileInfo) => void;
}

const FileListScreen: React.FC<FileListScreenProps> = ({ onItemPress }) => {
  const [query, setQuery] = useState<string>("");
  const { files, loading, error } = useFetchList(query);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <TextInput
        style={styles.textBox}
        placeholder="Buscar"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        style={styles.container}
        data={files}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => onItemPress(item)}
          >
            <Text>{item.fileName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  listItem: {
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
  },
  textBox: {
    borderColor: "#06a1b3",
    borderStyle: "solid",
    borderWidth: 1,
    margin: 20,
    borderRadius: 10,
  },
});

export default FileListScreen;
