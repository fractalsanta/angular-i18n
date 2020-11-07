/*
UAT: run 14.07.2015
PROD:
SUPPORT: 

*/


/********** SpecialAppKey
Special monitoring for defined keys.
TypeId only has one at the moment, 1=Log ResponseXML
    ***/
If EXISTS (SELECT * FROM sysobjects WHERE type = 'U' AND name = 'SpecialAppKey')
 BEGIN
    PRINT 'Table exists: SpecialAppKey DOING NOTHING'        
 END
ELSE
 BEGIN
	PRINT 'Creating Table: SpecialAppKey'

--	DROP TABLE SpecialAppKey
	CREATE TABLE [dbo].[SpecialAppKey]
	(
		Id int IDENTITY(1000,1) NOT NULL,
		AppKey int not null ,
		TypeId int not null default 0,
		TimeKey datetimeoffset null , 
		[Created] datetimeoffset NOT NULL default GETUTCDATE() 
	 CONSTRAINT [PK_SpecialAppKey] PRIMARY KEY CLUSTERED 
	(
		Id ASC
	))
	
	CREATE NONCLUSTERED INDEX IDX_SpecialAppKey_Created ON [dbo].[SpecialAppKey] 
	(
		Created ASC
	)
	
	/** ForeignKey 
	ALTER TABLE [dbo].SpecialAppKey 
		WITH CHECK ADD CONSTRAINT FK_SpecialAppKey_OtherTable FOREIGN KEY( OtherTableId )
	REFERENCES [dbo].OtherTable ( OtherTableId )
	*/
		
 END

GO


