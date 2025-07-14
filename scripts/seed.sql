USE url_crawler;
INSERT INTO results (url, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count, internal_links, external_links, broken_links, has_login_form, status, crawl_time, crawl_depth)
VALUES ('https://example.com', 'Example Domain', 'HTML5', 1, 0, 0, 0, 0, 0, 2, 0, '[]', false, 'done', NULL, NULL);