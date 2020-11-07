IF  NOT EXISTS (SELECT * FROM [rmh].[RockendAction] WHERE ActionName = 'SMH.LoginCheck' )
BEGIN

INSERT INTO [rmh].[RockendAction]
           ([ActionName]
           ,[AssemblyName]
           ,[ClassName]
           ,[Namespace])
VALUES
           (
           'SMH.LoginCheck'
           , 'Rockend.Strata.Processor.LoginCheck'
           , 'Login'
           , 'Rockend.Strata.Processor.LoginCheck'
           )

END

