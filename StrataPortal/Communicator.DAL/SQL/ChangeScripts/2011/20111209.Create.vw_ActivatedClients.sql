
/*  
Use this query to determine which agencies have activated Communicator
*/
CREATE VIEW vw_ActivatedClients
AS

select 
	aa.AgencyApplicationID ,
	aa.ApplicationKey
	, aa.SerialNumber
	, aa.[Description]
	, aa.Listened
	, act.IsActive	 
	, act.MachineName
from 
	rmh.agencyApplication aa
left outer join	
	[Activation] act
ON 
	act.AgencyApplicationID = aa.AgencyApplicationID
WHERE
	listened is not null
	and serialNumber not like '1000%' 
	and aa.AgencyApplicationId not in ( 1 , 10 , 24 , 79 , 84 , 86 , 87 , 97 , 103 , 104 )
	
	

-- select * from [Activation]

