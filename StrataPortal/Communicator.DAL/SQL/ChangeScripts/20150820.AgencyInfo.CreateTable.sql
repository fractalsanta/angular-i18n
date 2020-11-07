/********** AgencyInfo 
Store info about agencies (versions of things they're on etc)

   ***/

If EXISTS (SELECT * FROM sysobjects WHERE type = 'U' AND name = 'AgencyInfo')
 BEGIN
    PRINT 'Table exists: AgencyInfo DOING NOTHING'        
 END
ELSE
 BEGIN
	PRINT 'Creating Table: AgencyInfo'

--	DROP TABLE AgencyInfo
	CREATE TABLE rmh.[AgencyInfo]
	(
		Id int IDENTITY(1000, 1) NOT NULL,
		ClientCode nvarchar(10) NOT null ,

		Name nvarchar(64) not null ,
		Value nvarchar(1024) not null ,
		GroupId int not null default 0 , -- 0=ungrouped

		Created datetimeoffset NOT NULL default GETUTCDATE() ,
		Updated datetimeoffset NULL 

	 CONSTRAINT [PK_AgencyInfo] PRIMARY KEY CLUSTERED 
	(
		[Id] ASC
	))
	
	CREATE NONCLUSTERED INDEX IDX_AgencyInfo_Name ON rmh.[AgencyInfo] 
	(
		Name ASC
	)
	
	CREATE NONCLUSTERED INDEX IDX_AgencyInfo_ClientCode ON rmh.[AgencyInfo] 
	(
		ClientCode ASC
	)
	
	CREATE UNIQUE INDEX UNQ_AgencyInfo_ClientCodeName ON rmh.[AgencyInfo] 
	(
		ClientCode ASC, Name
	)

	CREATE NONCLUSTERED INDEX IDX_AgencyInfo_Created ON rmh.[AgencyInfo] 
	(
		Created ASC
	)
	


		
 END

GO

