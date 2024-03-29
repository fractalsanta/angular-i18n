/****** Object:  StoredProcedure [dbo].[DatabaseVersionScriptsRunDelete]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[DatabaseVersionScriptsRunDelete]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DatabaseVersionScriptsRunDelete]
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
