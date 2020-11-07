-- UAT ran 20161028
-- SUPPORT ran  20161111
-- PROD ran  20161111

if not exists (select 1 from syscolumns where name = 'LastSource')
 BEGIN
	PRINT 'creating LastSource'
	ALTER TABLE rmh.AgencyInfoMeta ADD LastSource varchar(4) not null default 'UNK'
 END
else
 BEGIN
  PRINT 'LastSource already exists'
 END
