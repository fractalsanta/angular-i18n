/****** Object:  StoredProcedure [dbo].[DatabaseVersionScriptsRunInsert]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[DatabaseVersionScriptsRunInsert]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DatabaseVersionScriptsRunInsert]
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
