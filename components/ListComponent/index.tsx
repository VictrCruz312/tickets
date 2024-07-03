import React from "react";
import { FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type ListItem = {
  id: string | number;
  [key: string]: any;
};

type ListComponentProps = {
  items: ListItem[];
  onItemPress?: (item: ListItem) => void;
  onDeletePress?: (item: ListItem) => void;
  ListFooterComponent?: React.ReactElement;
};

const ListComponent: React.FC<ListComponentProps> = ({ items, onItemPress, onDeletePress, ListFooterComponent }) => {
  const renderItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity
      onPress={() => onItemPress?.(item)} // Chama onItemPress com o item atual, se definido
      style={styles.itemContainer}
    >
      {Object.keys(item).map((key) => {
        if (key !== "id") {
          return (
            <Text key={key} style={styles.itemText}>
              {`${key}: ${item[key]}`}
            </Text>
          );
        }
      })}
      {onDeletePress && (
        <TouchableOpacity onPress={() => onDeletePress(item)} style={styles.deleteIconContainer}>
          <MaterialIcons name="delete" size={24} color="red" style={styles.deleteIcon} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return <FlatList style={styles.list} data={items} renderItem={renderItem} keyExtractor={(item) => String(item.id)} ListFooterComponent={ListFooterComponent} />;
};

// Estilos para o componente
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  list: {
    backgroundColor: "#dadada",
  },
  itemText: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 5,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  deleteIcon: {
    width: 24,
    height: 24,
    tintColor: "red",
  },
});

export default ListComponent;
