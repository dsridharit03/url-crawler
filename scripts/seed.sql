-- Create results table
   CREATE TABLE IF NOT EXISTS results (
       id SERIAL PRIMARY KEY,
       url TEXT NOT NULL UNIQUE,
       title TEXT,
       html_version TEXT,
       h1_count INTEGER,
       h2_count INTEGER,
       h3_count INTEGER,
       h4_count INTEGER,
       h5_count INTEGER,
       h6_count INTEGER,
       internal_links INTEGER,
       external_links INTEGER,
       broken_links TEXT,
       has_login_form BOOLEAN,
       status TEXT
   );

   -- Insert sample data
   INSERT INTO results (url, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count, internal_links, external_links, broken_links, has_login_form, status)
   VALUES ('https://example.com', 'Example Site', 'HTML5', 1, 2, 3, 0, 0, 0, 5, 10, '[]', false, 'success')
   ON CONFLICT (url) DO NOTHING;