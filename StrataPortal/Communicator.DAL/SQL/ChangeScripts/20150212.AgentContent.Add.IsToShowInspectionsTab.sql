
-- run against PROD 24.03.2015 mw

IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'ShowInspectionsTab' AND Object_ID = Object_ID(N'dbo.AgentContentREST'))
	BEGIN
		PRINT 'creating ShowInspectionsTab column'	
		ALTER TABLE dbo.AgentContentREST 
			ADD ShowInspectionsTab bit not null DEFAULT 0
	END