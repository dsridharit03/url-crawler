CREATE DATABASE IF NOT EXISTS url_crawler;
USE url_crawler;

CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    title TEXT,
    html_version VARCHAR(50),
    h1_count INT,
    h2_count INT,
    h3_count INT,
    h4_count INT,
    h5_count INT,
    h6_count INT,
    internal_links INT,
    external_links INT,
    broken_links TEXT,
    has_login_form BOOLEAN,
    status VARCHAR(50),
    UNIQUE (url)
);