-- Insert sample products with your categories and models
INSERT INTO products (name, description, category, model, material, weight_grams, price, cost, stock_quantity, sku, image_url) VALUES
-- Rings
('Classic Gold Ring', 'Beautiful classic gold ring', 'rings', 'classic', 'gold', 5.2, 299.99, 180.00, 15, 'RING-CLASSIC-001', '/placeholder.svg?height=300&width=300'),
('Diamond Engagement Ring', 'Elegant diamond engagement ring', 'rings', 'engagement', 'diamond', 3.8, 1299.99, 800.00, 8, 'RING-ENG-001', '/placeholder.svg?height=300&width=300'),
('Clash Ring', 'Modern clash design ring', 'rings', 'clash', 'gold', 4.5, 399.99, 250.00, 12, 'RING-CLASH-001', '/placeholder.svg?height=300&width=300'),

-- Earrings
('Gold Hoop Earrings', 'Classic gold hoop earrings', 'earrings', 'hoop', 'gold', 3.2, 199.99, 120.00, 20, 'EAR-HOOP-001', '/placeholder.svg?height=300&width=300'),
('Diamond Stud Earrings', 'Sparkling diamond stud earrings', 'earrings', 'stud', 'diamond', 2.1, 899.99, 550.00, 10, 'EAR-STUD-001', '/placeholder.svg?height=300&width=300'),

-- Bracelets
('Gold Chain Bracelet', 'Elegant gold chain bracelet', 'bracelets', 'chain', 'gold', 8.5, 449.99, 280.00, 18, 'BRAC-CHAIN-001', '/placeholder.svg?height=300&width=300'),
('Clash Bracelet', 'Modern clash design bracelet', 'bracelets', 'clash', 'gold', 12.3, 599.99, 380.00, 14, 'BRAC-CLASH-001', '/placeholder.svg?height=300&width=300'),

-- Chains
('Gold Necklace Chain', 'Beautiful gold necklace chain', 'chains', 'necklace', 'gold', 15.2, 699.99, 420.00, 16, 'CHAIN-NECK-001', '/placeholder.svg?height=300&width=300'),
('Silver Chain', 'Classic silver chain', 'chains', 'classic', 'silver', 12.8, 299.99, 180.00, 22, 'CHAIN-SIL-001', '/placeholder.svg?height=300&width=300'),

-- Arabic categories
('Gormmitte Gold', 'Traditional gormmitte in gold', 'gormmitte', 'traditional', 'gold', 18.5, 899.99, 550.00, 8, 'GOR-TRAD-001', '/placeholder.svg?height=300&width=300'),
('Dablij Silver', 'Classic dablij in silver', 'dablij', 'classic', 'silver', 14.2, 499.99, 300.00, 12, 'DAB-CLAS-001', '/placeholder.svg?height=300&width=300'),
('Podontife Gold', 'Elegant podontife in gold', 'podontife', 'elegant', 'gold', 22.1, 1199.99, 750.00, 6, 'POD-ELEG-001', '/placeholder.svg?height=300&width=300');

-- Insert sample orders
INSERT INTO orders (customer_name, customer_phone, customer_email, customer_address, payment_method, total_amount, status) VALUES
('Ahmed Hassan', '+20123456789', 'ahmed@email.com', '123 Cairo Street, Cairo, Egypt', 'cash_on_delivery', 599.98, 'confirmed'),
('Fatima Ali', '+20987654321', 'fatima@email.com', '456 Alexandria Ave, Alexandria, Egypt', 'credit_card', 1299.99, 'shipped'),
('Omar Mohamed', '+20555123456', 'omar@email.com', '789 Giza Road, Giza, Egypt', 'cash_on_delivery', 299.99, 'pending');
