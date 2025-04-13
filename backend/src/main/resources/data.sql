-- Insert Parents into person table
INSERT INTO person (id, naam, geboortedatum) VALUES
(1, 'Jan de Vries', '1980-05-15'),
(2, 'Lisa Jansen', '1982-08-22'),
(3, 'Peter Bakker', '1978-03-10'),
(4, 'Sanne van Dijk', '1985-11-30'),
(5, 'Mark de Boer', '1983-07-18');

-- Insert Parents into parent table
INSERT INTO parent (id, telefoonnummer, email) VALUES
(1, '0612345678', 'jan.devries@example.com'),
(2, '0687654321', 'lisa.jansen@example.com'),
(3, '0611122233', 'peter.bakker@example.com'),
(4, '0644455566', 'sanne.vandijk@example.com'),
(5, '0677788899', 'mark.deboer@example.com');

-- Insert Children into person table
INSERT INTO person (id, naam, geboortedatum) VALUES
(6, 'Emma de Vries', '2018-02-14'),
(7, 'Lucas Jansen', '2019-06-25'),
(8, 'Sophie Bakker', '2017-09-03'),
(9, 'Daan van Dijk', '2018-12-10'),
(10, 'Mila de Boer', '2019-04-18');

-- Insert Children into child table
INSERT INTO child (id, allergieen, voorkeur_eten, start_datum, eind_datum, uren_per_week, contact_persoon) VALUES
(6, 'Pinda''s', 'Pasta', '2023-09-01', '2024-08-31', 20, 'Jan de Vries'),
(7, 'Geen', 'Brood', '2023-09-01', '2024-08-31', 25, 'Lisa Jansen'),
(8, 'Lactose', 'Fruit', '2023-09-01', '2024-08-31', 30, 'Peter Bakker'),
(9, 'Geen', 'Groente', '2023-09-01', '2024-08-31', 15, 'Sanne van Dijk'),
(10, 'Noten', 'Rijst', '2023-09-01', '2024-08-31', 20, 'Mark de Boer');

-- Insert Attendances (for September 2023)
INSERT INTO attendance (id, check_in_time, check_out_time, child_id) VALUES
(1, '2023-09-01 08:00:00', '2023-09-01 17:00:00', 6),
(2, '2023-09-01 08:30:00', '2023-09-01 17:30:00', 7),
(3, '2023-09-01 09:00:00', '2023-09-01 18:00:00', 8),
(4, '2023-09-02 08:00:00', '2023-09-02 17:00:00', 6),
(5, '2023-09-02 08:30:00', '2023-09-02 17:30:00', 7),
(6, '2023-09-02 09:00:00', '2023-09-02 18:00:00', 8),
(7, '2023-09-03 08:00:00', '2023-09-03 17:00:00', 9),
(8, '2023-09-03 08:30:00', '2023-09-03 17:30:00', 10),
(9, '2023-09-04 08:00:00', '2023-09-04 17:00:00', 6),
(10, '2023-09-04 08:30:00', '2023-09-04 17:30:00', 7);

-- Insert Invoices (for September 2023)
INSERT INTO invoice (id, amount, paid, invoice_date, parent_id) VALUES
(1, 680.00, true, '2023-09-01', 1),  -- 20 uur/week * 4 weken * 8.50
(2, 850.00, true, '2023-09-01', 2),  -- 25 uur/week * 4 weken * 8.50
(3, 1020.00, false, '2023-09-01', 3), -- 30 uur/week * 4 weken * 8.50
(4, 510.00, true, '2023-09-01', 4),  -- 15 uur/week * 4 weken * 8.50
(5, 680.00, false, '2023-09-01', 5); -- 20 uur/week * 4 weken * 8.50 