-- Insert top-level categories
INSERT INTO categories (name, description, "parentId") VALUES
('Men''s Clothing', 'Clothing products for men including shirts, jeans, trousers, and watches.', NULL),
('Women''s Clothing', 'Clothing products for women including dresses, skirts, and blouses.', NULL),
('Accessories', 'Various accessories including bags, belts, hats, and sunglasses.', NULL);

-- Insert subcategories for Men's Clothing
INSERT INTO categories (name, description, "parentId") VALUES
('Shirts', 'Men''s shirts in various styles and materials.', (SELECT id FROM categories WHERE name = 'Men''s Clothing')),
('Jeans', 'Men''s jeans in various fits and colors.', (SELECT id FROM categories WHERE name = 'Men''s Clothing')),
('Trousers', 'Men''s trousers including chinos and dress pants.', (SELECT id FROM categories WHERE name = 'Men''s Clothing')),
('Watches', 'Men''s watches in different styles and brands.', (SELECT id FROM categories WHERE name = 'Men''s Clothing'));

-- Insert subcategories for Women's Clothing
INSERT INTO categories (name, description, "parentId") VALUES
('Dresses', 'Women''s dresses for all occasions.', (SELECT id FROM categories WHERE name = 'Women''s Clothing')),
('Skirts', 'Women''s skirts in various styles and lengths.', (SELECT id FROM categories WHERE name = 'Women''s Clothing')),
('Blouses', 'Women''s blouses and tops.', (SELECT id FROM categories WHERE name = 'Women''s Clothing')),
('Handbags', 'Women''s handbags including purses and totes.', (SELECT id FROM categories WHERE name = 'Women''s Clothing'));

-- Insert subcategories for Accessories
INSERT INTO categories (name, description, "parentId") VALUES
('Bags', 'Various types of bags including tote bags and backpacks.', (SELECT id FROM categories WHERE name = 'Accessories')),
('Belts', 'Belts for men and women in different styles.', (SELECT id FROM categories WHERE name = 'Accessories')),
('Hats', 'Fashionable hats and caps.', (SELECT id FROM categories WHERE name = 'Accessories')),
('Sunglasses', 'Stylish sunglasses for protection and fashion.', (SELECT id FROM categories WHERE name = 'Accessories'));
