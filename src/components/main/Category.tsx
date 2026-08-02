import { Host, ScrollView, Row, Text } from '@expo/ui';
import { View } from 'react-native';
import { Image } from 'expo-image';
const categories = [
    { id: 1, name: "All" },
    { id: 2, name: "Chicken"},
    { id: 3, name: "Beef" },
    { id: 4, name: "Fish"},
    { id: 5, name: "Vegetable" },
    { id: 6, name: "Dessert" },
    { id: 7, name: "Snack" },
    { id: 8, name: "Drink"},
    { id: 9, name: "Soup"},
    { id: 10, name: "Salad"},
]

export default function Category() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView direction="horizontal">
        <Row spacing={12}>
         {categories.map((category)=>(
          <View key={category.id}>
            <Text>{category.name}</Text>
          </View>
         ))}
        </Row>
      </ScrollView>
    </Host>
  );
}
