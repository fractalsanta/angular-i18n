/****** Object:  StoredProcedure [dbo].[DatabaseVersionUpdate]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[DatabaseVersionUpdate]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DatabaseVersionUpdate]
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
