-- UAT ran 20161028
-- SUPPORT 16.12.16
-- PROD 16.12.16

if not exists (select 1 from syscolumns where name = 'BetaAssemblyName')
 BEGIN
	PRINT 'creating BetaAssemblyName'
	ALTER TABLE rmh.RockendAction ADD BetaAssemblyName nvarchar(100) null 
 END
else
 BEGIN
  PRINT 'BetaAssemblyName already exists'
 END

-- select top 10 * from rmh.RockendAction
