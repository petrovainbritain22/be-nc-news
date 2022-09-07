-- psql -f view-test-db.sql > view-test-db.txt

\c nc_news_test;


select author, article_id, title from articles;
--  SELECT count (comment_id) as comment_count, articles.author, articles.title, articles.article_id
--  FROM comments 
--  RIGHT OUTER JOIN articles 
--  ON comments.article_id = articles.article_id
--  GROUP BY articles.article_id, comments.article_id
--  ORDER BY articles.article_id;

--  SELECT count (comment_id) as comment_count, articles.article_id, articles.topic
--  FROM comments 
--  RIGHT OUTER JOIN articles 
--  ON comments.article_id = articles.article_id
--  WHERE articles.article_id = 4
--  GROUP BY articles.article_id, comments.article_id;
 
 
 