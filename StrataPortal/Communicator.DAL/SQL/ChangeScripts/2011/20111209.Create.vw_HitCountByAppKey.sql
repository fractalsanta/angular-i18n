 
CREATE VIEW vw_HitCountByAppKey
AS

SELECT TOP 3000
	hits.ApplicationKey , 
	COUNT(hits.HitID) total , 
	hits.ActionName ,
	aa.[Description] , 
	aa.SerialNumber
FROM 
	rmh.Hits hits
INNER JOIN
	rmh.AgencyApplication aa 
	ON aa.ApplicationKey = hits.ApplicationKey
GROUP BY 
	hits.ApplicationKey , 
	aa.[Description] , 
	aa.SerialNumber , 
	hits.ActionName
ORDER BY
	total desc

