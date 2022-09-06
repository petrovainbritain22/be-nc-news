-- psql -f view-test-db.sql > view-test-db.txt

\c nc_news_test;
 select article_id, votes from articles;
 
 UPDATE articles SET votes = articles.votes + 1 WHERE article_id = 2;

 select article_id, votes from articles;