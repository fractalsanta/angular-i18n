/****** Object:  StoredProcedure [dbo].[DatabaseVersionInsert]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[DatabaseVersionInsert]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DatabaseVersionInsert]
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
