-- Insert sample jewelry products
INSERT INTO products (name, description, category, material, weight_grams, price, cost, stock_quantity, sku) VALUES
('Classic Gold Wedding Ring', 'Elegant 18k gold wedding band with polished finish', 'rings', 'gold', 5.2, 899.99, 450.00, 15, 'GWR001'),
('Diamond Solitaire Necklace', 'Beautiful 1 carat diamond pendant on 18k gold chain', 'necklaces', 'diamond', 8.5, 2499.99, 1200.00, 8, 'DSN001'),
('Gold Tennis Bracelet', 'Stunning tennis bracelet with multiple small diamonds', 'bracelets', 'diamond', 12.3, 1899.99, 950.00, 5, 'GTB001'),
('Pearl Drop Earrings', 'Elegant freshwater pearl earrings with gold setting', 'earrings', 'gold', 3.1, 299.99, 150.00, 20, 'PDE001'),
('Luxury Gold Watch', 'Premium Swiss movement watch with gold case and band', 'watches', 'gold', 85.0, 4999.99, 2500.00, 3, 'LGW001'),
('Silver Chain Necklace', 'Classic sterling silver chain necklace, 20 inches', 'necklaces', 'silver', 15.2, 199.99, 80.00, 25, 'SCN001'),
('Emerald Ring', 'Stunning emerald ring with gold setting and side diamonds', 'rings', 'gemstone', 6.8, 1599.99, 800.00, 7, 'EMR001'),
('Gold Hoop Earrings', 'Classic 14k gold hoop earrings, medium size', 'earrings', 'gold', 4.5, 399.99, 200.00, 12, 'GHE001');

-- Insert sample sales data
INSERT INTO sales (product_id, quantity, unit_price, total_amount, customer_name, customer_email, sale_date) VALUES
((SELECT id FROM products WHERE sku = 'GWR001'), 2, 899.99, 1799.98, 'John Smith', 'john@email.com', NOW() - INTERVAL '5 days'),
((SELECT id FROM products WHERE sku = 'DSN001'), 1, 2499.99, 2499.99, 'Sarah Johnson', 'sarah@email.com', NOW() - INTERVAL '3 days'),
((SELECT id FROM products WHERE sku = 'PDE001'), 1, 299.99, 299.99, 'Mike Brown', 'mike@email.com', NOW() - INTERVAL '2 days'),
((SELECT id FROM products WHERE sku = 'SCN001'), 3, 199.99, 599.97, 'Lisa Davis', 'lisa@email.com', NOW() - INTERVAL '1 day'),
((SELECT id FROM products WHERE sku = 'GHE001'), 1, 399.99, 399.99, 'Emma Wilson', 'emma@email.com', NOW());
