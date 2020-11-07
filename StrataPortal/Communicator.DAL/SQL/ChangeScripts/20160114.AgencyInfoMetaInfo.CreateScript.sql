
/********** AgencyInfoBackupJan16 
-- First back up the existing data because we're going to delete it (because the existing records do now know about SerialNumber)
***/
-- create the backup table
If EXISTS (SELECT * FROM sysobjects WHERE type = 'U' AND name = 'AgencyInfoBackupJan16')
 BEGIN
    PRINT 'Table exists: AgencyInfoBackupJan16 DOING NOTHING'        
 END
ELSE
 BEGIN
	PRINT 'Creating Table: AgencyInfoBackupJan16'

--	DROP TABLE AgencyInfoBackupJan16
	CREATE TABLE rmh.AgencyInfoBackupJan16
	(
		Id int IDENTITY(1000, 1) NOT NULL,
		ClientCode nvarchar(10) NOT null ,

		Name nvarchar(64) not null ,
		Value nvarchar(1024) not null ,
		GroupId int not null default 0 , -- 0=ungrouped

		Created datetimeoffset NOT NULL default GETUTCDATE() ,
		Updated datetimeoffset NULL 

	 CONSTRAINT [PK_AgencyInfoBackupJan16] PRIMARY KEY CLUSTERED 
	(
		[Id] ASC
	))
 END

-- backup the records
SET Identity_Insert rmh.AgencyInfoBackupJan16 ON

 INSERT INTO rmh.AgencyInfoBackupJan16 ( Id , ClientCode , Name , Value , Created , Updated )
 SELECT Id , ClientCode , Name , Value , Created , Updated FROM rmh.AgencyInfo

SET Identity_Insert rmh.AgencyInfoBackupJan16 OFF

-- ****** BACKUP COMPLETE ******


/********** CREATE AgencyInfoMeta    ***/
If EXISTS (SELECT * FROM sysobjects WHERE type = 'U' AND name = 'AgencyInfoMeta')
 BEGIN
    PRINT 'Table exists: AgencyInfoMeta DOING NOTHING'        
 END
ELSE
 BEGIN
	PRINT 'Creating Table: AgencyInfoMeta'

--	DROP TABLE AgencyInfoMeta
	CREATE TABLE rmh.[AgencyInfoMeta]
	(
		[AgencyInfoMetaId] int IDENTITY(1000,1) NOT NULL,
		ClientCode nvarchar(10) NOT null ,
		SerialNumber varchar(20) null ,
		Name nvarchar(64) null , -- probably not populated immediately
		SageName nvarchar(64) null , -- not populated immediately 

		[Created] datetimeoffset NOT NULL default GETUTCDATE() ,
		[Updated] datetimeoffset NOT NULL default GETUTCDate()
	 CONSTRAINT [PK_AgencyInfoMeta] PRIMARY KEY CLUSTERED 
	(
		[AgencyInfoMetaId] ASC
	))
	
	CREATE NONCLUSTERED INDEX IDX_AgencyInfoMeta_Created ON rmh.[AgencyInfoMeta] 
	(
		Created ASC
	)
	
	CREATE NONCLUSTERED INDEX IDX_AgencyInfoMeta_SerialNumber ON rmh.[AgencyInfoMeta] 
	(
		SerialNumber ASC
	)
	CREATE NONCLUSTERED INDEX IDX_AgencyInfoMeta_ClientCode ON rmh.[AgencyInfoMeta] 
	(
		ClientCode ASC
	)
		
 END

GO

-- add the field that will be the FK to the meta table (do not add FK yet, done last)
alter table rmh.AgencyInfo add AgencyInfoMetaId int not null default -1 -- default so adds the column, 
GO


-- NOT updating the existing info records, they have been backed up so DELETE then re-run getSystemInfo for all clients once changes are complete
-- Truncate AgencyInfo
TRUNCATE TABLE rmh.AgencyInfo

-- remove the ClientCode column (indexes first)
drop index rmh.AgencyInfo.UNQ_AgencyInfo_ClientCodeName
drop index rmh.AgencyInfo.IDX_AgencyInfo_ClientCode
alter table rmh.AgencyInfo drop column ClientCode


/** ForeignKey  - added last so can create initial data */
ALTER TABLE rmh.AgencyInfo 
	WITH CHECK ADD CONSTRAINT FK_AgencyInfo_AgencyInfoMeta FOREIGN KEY( AgencyInfoMetaId )
REFERENCES rmh.AgencyInfoMeta ( AgencyInfoMetaId )

/*
SELECT * from rmh.agencyInfo 
SELECT * from rmh.agencyInfoMeta 

select agency.* , app.* from rmh.AgencyApplication app join rmh.agencyaccess agency on agency.AgencyAccessId = app.AgencyAccessId where serialnumber in ( '10000207','10009999','10002400' ) 

*/