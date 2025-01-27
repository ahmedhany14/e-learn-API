SELECT *
from public.account;


--delete all data from account table
DELETE FROM account where email = 'ahmed@gamil.com';

DROP TABLE IF EXISTS account;

