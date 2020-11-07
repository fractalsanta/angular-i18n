/*
This script needs to be run manually immediately after creating the database.

Once this has been run, any and all changes to the database should be scripted.

*/

if exists (select * from dbo.sysobjects where id = object_id(N'[DatabaseVersion]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
 BEGIN
	PRINT 'not creating DatabaseVersion as it already exists'
 END
ELSE
 BEGIN
	CREATE TABLE [DatabaseVersion] (
		[DatabaseVersionID] [int] IDENTITY (100, 1) NOT NULL ,
		[BuildVersion] [varchar](16) NOT NULL ,
		[ScriptFailedName] [varchar] (256) NULL ,
		[CreatedDate] [datetime] NOT NULL ,
		[CreatedBy] [int] NULL
	)

	ALTER TABLE [DatabaseVersion] WITH NOCHECK ADD 
		CONSTRAINT [PK_DatabaseVersion] PRIMARY KEY  CLUSTERED 
		(
			[DatabaseVersionID]
		) 

	ALTER TABLE [DatabaseVersion] WITH NOCHECK ADD 
		CONSTRAINT [DF_DatabaseVersion_CreatedDate] DEFAULT (getdate()) FOR [CreatedDate],
		CONSTRAINT [UNQ_DatabaseVersion] UNIQUE  NONCLUSTERED 
		(
			[BuildVersion]
		) 

 END
GO


-- Create the scripts run Table
if exists (select * from dbo.sysobjects where id = object_id(N'[DatabaseVersionScriptsRun]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
 BEGIN
	PRINT 'not creating DatabaseVersionScriptsRun as it already exists'
 END
ELSE
 BEGIN
	CREATE TABLE [DatabaseVersionScriptsRun] (
		[DatabaseVersionScriptsRunID] [int] IDENTITY (100, 1) NOT NULL ,
		[DatabaseVersionID] [int] NOT NULL ,
		[ScriptName] [varchar] (256) NOT NULL ,
		[CreatedDate] [datetime] NOT NULL ,
		[CreatedBy] [int] NULL 
	)

	ALTER TABLE [DatabaseVersionScriptsRun] WITH NOCHECK ADD 
		CONSTRAINT [PK_DatabaseVersionScriptsRun] PRIMARY KEY  CLUSTERED 
		(
			[DatabaseVersionScriptsRunID]
		) 

	ALTER TABLE [DatabaseVersionScriptsRun] WITH NOCHECK ADD 
		CONSTRAINT [DF_DatabaseVersionScriptsRun_CreatedDate] DEFAULT (getdate()) FOR [CreatedDate],
		CONSTRAINT [UNQ_DatabaseVersionScriptsRun_ScriptName] UNIQUE  NONCLUSTERED 
		(
			[ScriptName]
		) 

 END
GO


-- WARNING: This file has been generated. Any manual changes must be made within preserved regions or they will be lost.

/****
    Purpose: 
             DELETE procedure for the DatabaseVersion table   
    Notes:   
             Standard DELETE procedure. 
    Author:       
        Genie
    HISTORY:
        22/12/2005 7:37:51 PM : Created
****/

If EXISTS (SELECT * FROM sysobjects WHERE type = 'P' AND name = 'DatabaseVersionDelete')
    BEGIN
        PRINT 'Dropping Procedure: DatabaseVersionDelete'
        DROP PROCEDURE DatabaseVersionDelete
    END
GO

PRINT 'Creating Procedure DatabaseVersionDelete'
GO
CREATE PROCEDURE DatabaseVersionDelete
    @DatabaseVersionID int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    DELETE
        DatabaseVersion
    WHERE
        DatabaseVersionID = @DatabaseVersionID

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END

GO
-- WARNING: This file has been generated. Any manual changes must be made within preserved regions or they will be lost.

/****
    Purpose: 
             INSERT procedure for the DatabaseVersion table   
    Notes:   
             Standard INSERT procedure. 
    Author:       
        Genie
    HISTORY:
        22/12/2005 7:37:51 PM : Created
****/

If EXISTS (SELECT * FROM sysobjects WHERE type = 'P' AND name = 'DatabaseVersionInsert')
    BEGIN
        PRINT 'Dropping Procedure: DatabaseVersionInsert'
        DROP PROCEDURE DatabaseVersionInsert
    END
GO

PRINT 'Creating Procedure DatabaseVersionInsert'
GO
CREATE PROCEDURE DatabaseVersionInsert
    @BuildVersion varchar(16)
    , @ScriptFailedName varchar(256)
    , @CreatedBy int
    , @DatabaseVersionID int OUTPUT 
    , @CreatedDate datetime OUTPUT 
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    -- Set the values of the output variable audit date fields.
    DECLARE @currentTimeStamp datetime
    SET @currentTimeStamp = GetDate()

    SET @CreatedDate = @currentTimeStamp


    INSERT
        dbo.DatabaseVersion
        (
        BuildVersion
        , ScriptFailedName
        , CreatedBy 
	, CreatedDate
        )
    VALUES
        (
        @BuildVersion
        , @ScriptFailedName
        , @CreatedBy 
	, @CreatedDate
        )

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT

    IF(@Err = 0)
    BEGIN
	    SET @DatabaseVersionID = SCOPE_IDENTITY()
    END



    RETURN @Err
 END

GO
-- WARNING: This file has been generated. Any manual changes must be made within preserved regions or they will be lost.

/****
    Purpose: 
             SELECT procedure for the DatabaseVersion table   
    Notes:   
             Standard SELECT procedure. 
    Author:       
        Genie
    HISTORY:
        22/12/2005 7:37:51 PM : Created
****/

If EXISTS (SELECT * FROM sysobjects WHERE type = 'P' AND name = 'DatabaseVersionSelect')
    BEGIN
        PRINT 'Dropping Procedure: DatabaseVersionSelect'
        DROP PROCEDURE DatabaseVersionSelect
    END
GO

PRINT 'Creating Procedure DatabaseVersionSelect'
GO
CREATE PROCEDURE DatabaseVersionSelect
    @DatabaseVersionID int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    SELECT
        DatabaseVersionID
        , BuildVersion
        , ScriptFailedName
        , CreatedDate
        , CreatedBy
    FROM
        dbo.DatabaseVersion
    WHERE
        DatabaseVersionID = @DatabaseVersionID

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END

GO
-- WARNING: This file has been generated. Any manual changes must be made within preserved regions or they will be lost.

/****
    Purpose: 
             UPDATE procedure for the DatabaseVersion table   
    Notes:   
             Standard UPDATE procedure. 
    Author:       
        Genie
    HISTORY:
        22/12/2005 7:37:51 PM : Created
****/

If EXISTS (SELECT * FROM sysobjects WHERE type = 'P' AND name = 'DatabaseVersionUpdate')
    BEGIN
        PRINT 'Dropping Procedure: DatabaseVersionUpdate'
        DROP PROCEDURE DatabaseVersionUpdate
    END
GO

PRINT 'Creating Procedure DatabaseVersionUpdate'
GO
CREATE PROCEDURE DatabaseVersionUpdate
    @DatabaseVersionID int
    , @BuildVersion varchar(16)
    , @ScriptFailedName varchar(256)
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    UPDATE
        dbo.DatabaseVersion 
    SET 
        BuildVersion = @BuildVersion
        , ScriptFailedName = @ScriptFailedName
    WHERE
        DatabaseVersionID = @DatabaseVersionID

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END

GO

-- Note: This file was originally generated by Genie
/****
    Purpose: 
             UPDATE procedure for the DatabaseVersionScriptsRun table   
    Notes:   
             Standard UPDATE procedure. 
    Author:       
        Genie

****/

If EXISTS (SELECT * FROM sysobjects WHERE type = 'P' AND name = 'DatabaseVersionScriptsRunUpdate')
    BEGIN
        PRINT 'Dropping Procedure: DatabaseVersionScriptsRunUpdate'
        DROP PROCEDURE DatabaseVersionScriptsRunUpdate
    END
GO

PRINT 'Creating Procedure DatabaseVersionScriptsRunUpdate'
GO
CREATE PROCEDURE DatabaseVersionScriptsRunUpdate
    @DatabaseVersionScriptsRunID int
    , @DatabaseVersionID int
    , @ScriptName varchar(256)
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    UPDATE
        dbo.DatabaseVersionScriptsRun 
    SET 
        DatabaseVersionID = @DatabaseVersionID
        , ScriptName = @ScriptName
    WHERE
        DatabaseVersionScriptsRunID = @DatabaseVersionScriptsRunID

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END

GO

-- Note: This file was originally generated by Genie
/****
    Purpose: 
             SELECT procedure for the DatabaseVersionScriptsRun table   
    Notes:   
             Standard SELECT procedure. 
    Author:       
        Genie

****/

If EXISTS (SELECT * FROM sysobjects WHERE type = 'P' AND name = 'DatabaseVersionScriptsRunSelect')
    BEGIN
        PRINT 'Dropping Procedure: DatabaseVersionScriptsRunSelect'
        DROP PROCEDURE DatabaseVersionScriptsRunSelect
    END
GO

PRINT 'Creating Procedure DatabaseVersionScriptsRunSelect'
GO

CREATE PROCEDURE DatabaseVersionScriptsRunSelect
    @DatabaseVersionScriptsRunID int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    SELECT
        DatabaseVersionScriptsRunID
        , DatabaseVersionID
        , ScriptName
        , CreatedDate
        , CreatedBy
    FROM
        dbo.DatabaseVersionScriptsRun
    WHERE
        DatabaseVersionScriptsRunID = @DatabaseVersionScriptsRunID

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END

GO

-- Note: This file was originally generated by Genie
/****
    Purpose: 
             INSERT procedure for the DatabaseVersionScriptsRun table   
    Notes:   
             Standard INSERT procedure. 
    Author:       
        Genie

****/

If EXISTS (SELECT * FROM sysobjects WHERE type = 'P' AND name = 'DatabaseVersionScriptsRunInsert')
    BEGIN
        PRINT 'Dropping Procedure: DatabaseVersionScriptsRunInsert'
        DROP PROCEDURE DatabaseVersionScriptsRunInsert
    END
GO

PRINT 'Creating Procedure DatabaseVersionScriptsRunInsert'
GO

CREATE PROCEDURE DatabaseVersionScriptsRunInsert
    @DatabaseVersionID int
    , @ScriptName varchar(256)
    , @CreatedBy int
    , @DatabaseVersionScriptsRunID int OUTPUT 
    , @CreatedDate datetime OUTPUT 
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    -- Set the values of the output variable audit date fields.
    DECLARE @currentTimeStamp datetime
    SET @currentTimeStamp = GetDate()

    SET @CreatedDate = @currentTimeStamp


    INSERT
        dbo.DatabaseVersionScriptsRun
        (
        DatabaseVersionID
        , ScriptName
        , CreatedBy 
	, CreatedDate
        )
    VALUES
        (
        @DatabaseVersionID
        , @ScriptName
        , @CreatedBy 
	, @CreatedDate
        )

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT

    IF(@Err = 0)
    BEGIN
	    SET @DatabaseVersionScriptsRunID = SCOPE_IDENTITY()
    END



    RETURN @Err
 END

GO
-- Note: This file was originally generated by Genie

/****
    Purpose: 
             DELETE procedure for the DatabaseVersionScriptsRun table   
    Notes:   
             Standard DELETE procedure. 
    Author:       
        Genie

****/

If EXISTS (SELECT * FROM sysobjects WHERE type = 'P' AND name = 'DatabaseVersionScriptsRunDelete')
    BEGIN
        PRINT 'Dropping Procedure: DatabaseVersionScriptsRunDelete'
        DROP PROCEDURE DatabaseVersionScriptsRunDelete
    END
GO

PRINT 'Creating Procedure DatabaseVersionScriptsRunDelete'
GO
CREATE PROCEDURE DatabaseVersionScriptsRunDelete
    @DatabaseVersionScriptsRunID int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    -- Delete the Actual record
    DELETE
        dbo.DatabaseVersionScriptsRun
    WHERE
        DatabaseVersionScriptsRunID = @DatabaseVersionScriptsRunID

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END

GO



-- add the initial 'testing' records
SET IDENTITY_INSERT [DatabaseVersion] ON

INSERT INTO 
	[DatabaseVersion]
	( [DatabaseVersionID]
	, [BuildVersion]
	, [CreatedDate] )
VALUES
	( 100
	, 100
	, GetDate()
	)
	
	
SET IDENTITY_INSERT [DatabaseVersion] OFF

/*
Need to add this record so it doesn't get run.
The test delete's this record before doing it's test then re-creates it.
*/


SET IDENTITY_INSERT [DatabaseVersionScriptsRun] ON

INSERT INTO 
	[DatabaseVersionScriptsRun]
	([DatabaseVersionScriptsRunID]
	, [DatabaseVersionID]
	, [ScriptName]
	, [CreatedDate]
	)
VALUES
	( 100
	, 100
	, 'NewUpdate.sql'
	, GetDate()
	)
	
INSERT INTO 
	[DatabaseVersionScriptsRun]
	([DatabaseVersionScriptsRunID]
	, [DatabaseVersionID]
	, [ScriptName]
	, [CreatedDate]
	)
VALUES
	( 101
	, 100
	, 'PreviouslyRunUpdate.sql'
	, GetDate()
	)

SET IDENTITY_INSERT [DatabaseVersionScriptsRun] OFF
