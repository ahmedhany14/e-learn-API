SELECT *
FROM account;

INSERT INTO profile ("firstName", "lastName", "accountId") VALUES ('John', 'Doe', 20);

SELECT *
FROM profile;


select *from "order";


select *from order_backlog;
--delete all data from account table
DELETE
FROM account
where id = 21;

UPDATE account
    SET role = 'admin'
    WHERE id = 23;

DELETE
FROM profile
where id != 0;

DELETE
FROM "order"
where id != 0;

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profile';


DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS "order";
DROP TABLE IF EXISTS order_backlog;
--  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhaDc2MDg4NjdAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzgxNjYyNDIsImV4cCI6MTczODE2OTg0MiwiYXVkIjoibG9jYWxob3N0OjMwMDAiLCJpc3MiOiJsb2NhbGhvc3Q6MzAwMCJ9.Q8Ifh18cFQsGzNen5NuBF46kjRcuewW0VTBr9JwKkyc",
