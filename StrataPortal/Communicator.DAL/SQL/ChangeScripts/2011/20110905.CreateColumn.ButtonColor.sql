
IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'ButtonColor' 
	AND Object_ID = Object_ID(N'dbo.AgentContent'))
	BEGIN
		PRINT 'creating ButtonColor column'	
		ALTER TABLE dbo.AgentContent
			ADD ButtonColor varchar(8) not null DEFAULT '#111111'
	END



