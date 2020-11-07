-- add the new Betaversion field
IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'RwacBetaVersion' 
	AND Object_ID = Object_ID(N'rmh.AdminSetting'))
	BEGIN
		PRINT 'creating RwacBetaVersion column'	
		ALTER TABLE rmh.AdminSetting
			ADD RwacBetaVersion nvarchar(10) null
	END

GO

-- add the new DeployerMinuteInterval field
IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'DeployerMinuteInterval' 
	AND Object_ID = Object_ID(N'rmh.AdminSetting'))
	BEGIN
		PRINT 'creating DeployerMinuteInterval column'	
		ALTER TABLE rmh.AdminSetting
			ADD DeployerMinuteInterval int not null default 10
	END

GO

-- add the new DeploySecondThrottle field
IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'DeploySecondThrottle' 
	AND Object_ID = Object_ID(N'rmh.AdminSetting'))
	BEGIN
		PRINT 'creating DeploySecondThrottle column'	
		ALTER TABLE rmh.AdminSetting
			ADD DeploySecondThrottle int not null default 0
	END

GO

/********** RwacDeploy Table   ***/
If EXISTS (SELECT * FROM sysobjects WHERE type = 'U' AND name = 'RwacDeploy')
 BEGIN
    PRINT 'Table exists: RwacDeploy DOING NOTHING'        
 END
ELSE
 BEGIN
	PRINT 'Creating Table: RwacDeploy'

--	DROP TABLE RwacDeploy
	CREATE TABLE [dbo].[RwacDeploy]
	(
		[RwacDeployId] int IDENTITY(10000,1) NOT NULL,
		
		AppKey int not null ,
		CurrentVersion nvarchar(10) not null , 
		DeployVersion nvarchar(10) not null ,
		Attempts int not null default 0 ,
		LastAttempt datetimeoffset null ,
		UpdateConfirmed datetimeoffset null ,
		IsBeta bit not null default 0 ,
		CreatedBy nvarchar(8) not null default 'AUTO',
		LastError nvarchar(1024) null,


		[Created] datetimeoffset NOT NULL default GETUTCDATE() ,
		[Updated] datetimeoffset NOT NULL default GETUTCDate()
	 CONSTRAINT [PK_RwacDeploy] PRIMARY KEY CLUSTERED 
	(
		[RwacDeployId] ASC
	))
	
	CREATE NONCLUSTERED INDEX IDX_RwacDeploy_Created ON [dbo].[RwacDeploy] 
	(
		Created ASC
	)
	
	CREATE NONCLUSTERED INDEX IDX_RwacDeploy_AppKey ON [dbo].[RwacDeploy] 
	(
		AppKey ASC
	)
	
	CREATE NONCLUSTERED INDEX IDX_RwacDeploy_UpdateConfirmed ON [dbo].[RwacDeploy] 
	(
		UpdateConfirmed ASC
	)
	
	CREATE NONCLUSTERED INDEX IDX_RwacDeploy_Attempts ON [dbo].[RwacDeploy] 
	(
		Attempts ASC
	)
	
 END

GO