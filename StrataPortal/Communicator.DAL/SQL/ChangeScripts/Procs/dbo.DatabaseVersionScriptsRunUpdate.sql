/****** Object:  StoredProcedure [dbo].[DatabaseVersionScriptsRunUpdate]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[DatabaseVersionScriptsRunUpdate]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DatabaseVersionScriptsRunUpdate]
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
