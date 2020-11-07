
/*
Executed:
UAT 30.09.2015 MW
PROD 14.10.2015 mw
*/

IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'IsFsDocumentDescriptionOn' 
	AND Object_ID = Object_ID(N'dbo.AgentContentSTRATA'))
	BEGIN
		PRINT 'creating IsFsDocumentDescriptionOn column'	
		ALTER TABLE dbo.AgentContentSTRATA
			ADD IsFsDocumentDescriptionOn bit not null DEFAULT 0
	END
