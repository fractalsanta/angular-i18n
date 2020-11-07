/****** Object:  View [dbo].[vw_Hits]    Script Date: 09/12/2011 09:56:32 ******/
DROP VIEW [dbo].[vw_Hits]
GO


Create View [dbo].[vw_Hits]
As
	Select TOP 500 *, Convert(varchar, ResponseTime - RequestTime, 108) As Duration 
	From rmh.hits
	ORDER BY 1 DESC
GO
