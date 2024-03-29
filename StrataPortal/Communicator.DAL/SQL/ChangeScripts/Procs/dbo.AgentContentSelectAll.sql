/****** Object:  StoredProcedure [dbo].[AgentContentSelectAll]    Script Date: 09/12/2011 08:34:19 ******/
DROP PROCEDURE [dbo].[AgentContentSelectAll]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AgentContentSelectAll]
AS
 BEGIN

    DECLARE @Err int , @Rowcount int

    SELECT
        AgentContentId
        , AgencyAccessId
        , Banner
        , TopImage
        , MiddleImage
        , BottomRightImage
        , LoginPageTopText
		, OwnerReportsOn
		, IncExpReportsOn
    FROM
        dbo.AgentContent

    SELECT @Err = @@ERROR, @Rowcount = @@ROWCOUNT


    RETURN @Err
 END
GO
