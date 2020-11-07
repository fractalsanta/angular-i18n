/********** AgencyMergeHistory 
To be used with when moving an appKey from one agency to another.
Populated by AgencyMerge proc.

   ***/
If EXISTS (SELECT * FROM sysobjects WHERE type = 'U' AND name = 'AgencyMergeHistory')
 BEGIN
    PRINT 'Table exists: AgencyMergeHistory DOING NOTHING'        
 END
ELSE
 BEGIN
	PRINT 'Creating Table: AgencyMergeHistory'

--	DROP TABLE AgencyMergeHistory
	CREATE TABLE [dbo].[AgencyMergeHistory]
	(
		[Id] int IDENTITY(1000, 1) NOT NULL,
		AgencyApplicationid int not null , 
		FromAgencyId int not null ,
		ToAgencyId int not null ,
		Note nvarchar(1024) not null ,

		[Created] datetimeoffset NOT NULL default GETUTCDATE()

	 CONSTRAINT [PK_AgencyMergeHistory] PRIMARY KEY CLUSTERED 
	(
		[Id] ASC
	))
	
	CREATE NONCLUSTERED INDEX IDX_AgencyMergeHistory_Created ON [dbo].[AgencyMergeHistory] 
	(
		Created ASC
	)
	
	CREATE NONCLUSTERED INDEX IDX_AgencyMergeHistory_AgencyApplicationId ON [dbo].[AgencyMergeHistory] 
	(
		AgencyApplicationId ASC
	)


		
 END

GO


DROP PROCEDURE [rmh].[AgencyMerge]
GO

/****** Object:  StoredProcedure [rmh].[AgencyMerge]    ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [rmh].[AgencyMerge]
      @FromAgencyId int,
      @ToAgencyId int ,
      @Note nVarchar(1024)
AS
 BEGIN
	-- First record what we are about to do
	INSERT INTO AgencyMergeHistory ( AgencyApplicationid, FromAgencyId , ToAgencyId , Note )
	SELECT AgencyApplicationId , @FromAgencyId , @ToAgencyId , @Note
	FROM rmh.AgencyApplication WHERE AgencyAccessId = @FromAgencyId


	update rmh.AgencyApplication set agencyaccessid = @ToAgencyId where agencyaccessid = @FromAgencyId
	update agencyContent set agencyaccessid = @ToAgencyId where agencyaccessid = @FromAgencyId
	update rmh.VersionInfo set agencyaccessid = @ToAgencyId where agencyaccessid = @FromAgencyId

 END
