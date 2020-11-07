/********** SpecialAppKeyType  
Table created to 'document' the different type Id's

  ***/
If EXISTS (SELECT * FROM sysobjects WHERE type = 'U' AND name = 'SpecialAppKeyType')
 BEGIN
    PRINT 'Table exists: SpecialAppKeyType DOING NOTHING'        
 END
ELSE
 BEGIN
	PRINT 'Creating Table: SpecialAppKeyType'

--	DROP TABLE SpecialAppKeyType
	CREATE TABLE [dbo].[SpecialAppKeyType]
	(
		[SpecialAppKeyTypeId] bigint IDENTITY(1,1) NOT NULL,
		Name nvarchar(32) null ,
		Notes nvarchar(512) null ,

		[Created] datetimeoffset NOT NULL default GETUTCDATE() ,
	 CONSTRAINT [PK_SpecialAppKeyType] PRIMARY KEY CLUSTERED 
	(
		[SpecialAppKeyTypeId] ASC
	))
	
	END

GO

Insert SpecialAppKeyType ( Name , Notes ) values ( 'LogXmlResponse' , 'logs xml repsonses from the AMH. Add records when requested by Tech Support, remove once done!' )
Insert SpecialAppKeyType ( Name , Notes ) values ( 'Benchmark Beta' , 'Clients that are a part of the Benchmark beta' )
Insert SpecialAppKeyType ( Name , Notes  ) values ( 'Rwac Beta', 'Auto updater will push Beta releases to these appKeys' )

