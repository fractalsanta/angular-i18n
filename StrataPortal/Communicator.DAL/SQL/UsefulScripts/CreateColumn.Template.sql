


IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'ColumnName' 
	AND Object_ID = Object_ID(N'dbo.TableName'))
	BEGIN
		PRINT 'creating ColumnName column'	
		ALTER TABLE dbo.TableName
			ADD ColumnName varchar(8) not null DEFAULT ''
	END
