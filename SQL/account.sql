SELECT *
FROM account;

SELECT *
FROM profile;

--delete all data from account table
DELETE
FROM account
where id != 0;

DELETE
FROM profile
where id != 0;



DROP TABLE IF EXISTS account;

--  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhaDc2MDg4NjdAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzgxNjYyNDIsImV4cCI6MTczODE2OTg0MiwiYXVkIjoibG9jYWxob3N0OjMwMDAiLCJpc3MiOiJsb2NhbGhvc3Q6MzAwMCJ9.Q8Ifh18cFQsGzNen5NuBF46kjRcuewW0VTBr9JwKkyc",
