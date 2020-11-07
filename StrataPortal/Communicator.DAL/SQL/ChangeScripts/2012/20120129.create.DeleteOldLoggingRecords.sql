/****** Object:  StoredProcedure [dbo].[DeleteExpiredSessions]    Script Date: 01/30/2012 09:40:05 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DeleteOldLoggingRecords]') AND type in (N'P', N'PC'))
BEGIN
	PRINT 'Dropping DeleteOldLoggingRecords'
	DROP PROCEDURE [dbo].[DeleteOldLoggingRecords]
END
GO

/*****************************************************************************/


CREATE PROCEDURE [dbo].DeleteOldLoggingRecords
	@deleteBefore datetime
AS

	DELETE logging where Created < @deleteBefore

	RETURN 0

GO

