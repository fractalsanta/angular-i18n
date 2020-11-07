Create View [dbo].[vw_Hits]
As
	Select *, Convert(varchar, ResponseTime - RequestTime, 108) As Duration From rmh.hits
GO
