-- psql -f view-test-db.sql > view-test-db.txt

\c nc_news_test;

 SELECT count (comment_id) as comment_count, articles.article_id, articles.topic, articles.created_at
 FROM comments 
 RIGHT OUTER JOIN articles 
 ON comments.article_id = articles.article_id
 GROUP BY articles.article_id, comments.article_id;

 SELECT count (comment_id) as comment_count, articles.article_id, articles.topic
 FROM comments 
 RIGHT OUTER JOIN articles 
 ON comments.article_id = articles.article_id
 WHERE articles.article_id = 4
 GROUP BY articles.article_id, comments.article_id;
 
 
 