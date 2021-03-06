/****** Object:  StoredProcedure [dbo].[AgentContentDelete]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[AgentContentDelete]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AgentContentDelete]
    @AgentContentId int
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    -- Phsically Delete the record
    DELETE
        dbo.AgentContent
    WHERE
        AgentContentId = @AgentContentId

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
