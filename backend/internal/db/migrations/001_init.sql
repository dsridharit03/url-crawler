CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
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
    status TEXT,
    UNIQUE (url)
);
