// Keep only these types
export type EquipmentItem = {
  name: string;
  description?: string;
  source?: string; // How the item was obtained
};

export type Equipment = {
  items: EquipmentItem[];
};