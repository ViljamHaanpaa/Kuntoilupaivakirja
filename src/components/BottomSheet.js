//this is for the category selector
import React from "react";
import { useEffect } from "react";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { categories } from "./SportCategories";

// Category selector for the bottom sheet
const CategorySelector = ({ onCategorySelect, onClose }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    const options = [...categories, "Sulje"];
    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex !== cancelButtonIndex) {
          onCategorySelect(options[buttonIndex]);
        }
        onClose();
      }
    );
  }, [onCategorySelect, onClose, showActionSheetWithOptions, categories]);

  return null;
};

export const BottomSheetCategory = ({ onCategorySelect, onClose }) => (
  <CategorySelector onCategorySelect={onCategorySelect} onClose={onClose} />
);
