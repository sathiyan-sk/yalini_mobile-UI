/**
 * Hook to load vector icon fonts required by @expo/vector-icons
 * This prevents the Android Expo Go \"Font family not found\" error
 */
import { useFonts } from 'expo-font';

// Import the actual font assets from @expo/vector-icons
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons';

export function useIconFonts() {
  return useFonts({
    ...Ionicons.font,
    ...Feather.font,
    ...MaterialCommunityIcons.font,
    ...AntDesign.font,
    ...FontAwesome.font,
    ...FontAwesome5.font,
    ...MaterialIcons.font,
  });
}