declare @max as int 
select @max=max(scheduleid) from dbo.schedule
DBCC CHECKIDENT ([schedule], reseed,  @max)

select @max=max(scheduleparameterid) from dbo.scheduleparameter
DBCC CHECKIDENT (scheduleparameter, reseed,  @max)

ALTER TABLE schedule alter COLUMN DelayType nvarchar(10)


declare @newScheduleId int
declare @ScheduleId int
declare @ServiceId int
declare @ApplicationKey int
declare @ActionName nvarchar(50)
declare @StartAt datetime
declare @DelayQuantity int
declare @DelayType nvarchar(10) 
declare @Hidden bit

--get the current schedules and put them in a cursor
DECLARE db_cursor CURSOR FOR  
select [Scheduleid],[ServiceId],[ApplicationKey],[ActionName],[StartAt],[DelayQuantity],[DelayType],[Hidden] 
from dbo.schedule where [ActionName]= 'kpi' and delaytype = 'day'

--loop trough that cursor
OPEN db_cursor   
FETCH NEXT FROM db_cursor INTO @ScheduleId,@ServiceId,@ApplicationKey,@ActionName,@StartAt,@DelayQuantity,@DelayType,@Hidden 

WHILE @@FETCH_STATUS = 0   
BEGIN   
       --for each row in the cursor insert a new schedule with the same info but different delay type
	   insert into [dbo].[schedule]([ServiceId],[ApplicationKey],[ActionName],[StartAt],[DelayQuantity],[DelayType],[Hidden])
	   values(@ServiceId,@ApplicationKey,@ActionName,@StartAt,@DelayQuantity,'monthly',@Hidden)  
	   --get the id of the last inserted schedule
	   --set @newScheduleId = @@IDENTITY
	   print(scope_identity())

	   --copy all the parameters from the original schedule into the new schedule
	   insert into [dbo].[ScheduleParameter]
	   select scope_identity(),[Name],[Value] from 
	   [dbo].[ScheduleParameter]  where scheduleid =@ScheduleId

	   FETCH NEXT FROM db_cursor INTO @ScheduleId,@ServiceId,@ApplicationKey,@ActionName,@StartAt,@DelayQuantity,@DelayType,@Hidden 

END   

CLOSE db_cursor   
DEALLOCATE db_cursor
--update all existing dayly schedules to runn weekly
update dbo.schedule set delaytype = 'weekly' where delayType = 'day' and actionname ='kpi'
--update all new monthly schedules so that their dayoftheweek is set to empty that way we avoid conflict between monthly and weekly running twice 
--if the begining of the month happens on the same day as the weekly is set to run
update dbo.scheduleparameter set Value = '' where Name='dayofweek' and scheduleid in 
(
	select scheduleid from dbo.schedule where actionname = 'kpi' and delaytype = 'monthly'
)
--add the day of month parameter for the run
insert into [dbo].[ScheduleParameter]
select scheduleid,'dayofmonth','1' from dbo.schedule where actionname = 'kpi' and delaytype = 'monthly'