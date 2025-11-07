export interface CategoryInfo {
  label: string;
  slug: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { label: 'Electronics', slug: 'electronics', description: 'Phones, laptops, and more gadgets.' },
  { label: 'Fashion', slug: 'fashion', description: 'Casual and formal wear.' },
  { label: 'Home Appliances', slug: 'home-appliances', description: 'Make home tasks easier.' },
  { label: 'Footwear', slug: 'footwear', description: 'Shoes for every occasion.' }
];

