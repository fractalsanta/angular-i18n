IF  NOT EXISTS (SELECT * FROM [rmh].[RockendAction] WHERE ActionName = 'DailyCheck' )
BEGIN

INSERT INTO [rmh].[RockendAction]
           ([ActionName]
           ,[AssemblyName]
           ,[ClassName]
           ,[Namespace])
     VALUES (
           'DailyCheck'
           , 'Rockend.REST.Processor.Daily'
           , 'DailyCheck'
           , 'Rockend.REST.Processor.Daily'
			)

END

