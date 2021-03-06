

ALTER PROCEDURE [rmh].[CheckAgencyGUIDAndSetRWACVersion]
	  @AgencyGUID UniqueIdentifier,
	  @ApplicationKey int,
	  @ApplicationCode nVarchar(2),
	  @ApplicationDescription nVarchar(200),
	  @SerialNumber nVarchar(20),
	  @Version int = 0,
	  @AgencyName nvarchar(200) = null,	  
	  @RWACVersion int = 0
	  	  
AS
	  Declare @AgencyAccessID Int
	  Declare @AgencyApplicationID Int
	  DECLARE @VersionInfoId int

	  IF @ApplicationKey IS NULL OR @ApplicationKey = 0 
	  BEGIN
			IF LEN(@SerialNumber) > 0
			BEGIN -- REST
				--  If we have a serial number check for the application using it
				SELECT @AgencyAccessID = a.AgencyAccessID, @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID, @ApplicationKey = aa.ApplicationKey  
				FROM [rmh].[AgencyApplication] aa
					  INNER JOIN rmh.AgencyAccess a ON a.AgencyAccessID = aa.AgencyAccessID
				WHERE aa.SerialNumber = @SerialNumber -- no need to filter on applicationCode as SM apps never have serial numbers			
				
			END
			ELSE
			BEGIN -- STRATA
				--  If we have a GUID check for the application using it
				-- only if there is only one AppKey for the GUID and 'SM'
				IF((SELECT COUNT(*) FROM [rmh].[AgencyApplication] aa 
					INNER JOIN rmh.AgencyAccess a ON a.AgencyAccessID = aa.AgencyAccessID
					WHERE a.AgencyGUID = @AgencyGUID AND aa.ApplicationCode = 'SM') = 1)
				BEGIN -- There is only one AppKey so ok to use and return it
					SELECT 
						@AgencyAccessID = a.AgencyAccessID, @AgencyApplicationID = aa.AgencyApplicationID, @ApplicationKey = aa.ApplicationKey 
					FROM 
						[rmh].[AgencyApplication] aa
					INNER JOIN 
						rmh.AgencyAccess a ON a.AgencyAccessID = aa.AgencyAccessID
					WHERE 
						a.AgencyGUID = @AgencyGUID AND aa.ApplicationCode = 'SM'
				END
			END

	  END 
	  Else
	  BEGIN
			-- Find details for known application key
			SELECT @AgencyAccessID = a.AgencyAccessID, @AgencyGUID = a.AgencyGUID, @AgencyApplicationID = aa.AgencyApplicationID 
			FROM [rmh].[AgencyApplication] aa
				  INNER JOIN rmh.AgencyAccess a ON a.AgencyAccessID = aa.AgencyAccessID
			WHERE aa.ApplicationKey = @ApplicationKey
	  END

	  IF @AgencyGUID IS NOT NULL AND @AgencyAccessID IS NULL
	  BEGIN
			SELECT @AgencyAccessID = AgencyAccessID FROM [rmh].[AgencyAccess] WHERE AgencyGUID = @AgencyGUID
	  END

	  IF @AgencyAccessID IS NULL
	  BEGIN
			-- Didn't find one so we need to generate a new GUID
			SELECT @AgencyGUID = NewID()
			Insert [rmh].[AgencyAccess] (AgencyGUID) VALUES (@AgencyGUID)
			SELECT @AgencyAccessID = SCOPE_IDENTITY()
	  END 

	  IF @AgencyApplicationID IS NULL
	  BEGIN
			-- Need to make sure the application is registered for this agency
			If NOT EXISTS(SELECT * FROM [rmh].[AgencyApplication] WHERE ApplicationKey = @ApplicationKey)
			BEGIN
				  While @ApplicationKey = 0
				  BEGIN
						SELECT @ApplicationKey = 100000 + CONVERT(Int, Rand() * 899999)

						IF EXISTS(SELECT * FROM AgencyApplication WHERE ApplicationKey = @ApplicationKey)
						BEGIN
							  SELECT @ApplicationKey = 0
						END
				  END

					-- Make sure there is a matching versionInfo record for the application (from July 2015)
				  INSERT rmh.VersionInfo ( ApplicationCode , SerialNumber , AgencyAccessId , AppVersion , AppKey ) 
				  VALUES			  ( @ApplicationCode , @SerialNumber , @AgencyAccessId , @Version , @ApplicationKey )
				  
				  SELECT @VersionInfoId = SCOPE_IDENTITY()

				  -- create the app
				  INSERT [rmh].[AgencyApplication] (AgencyAccessID, ApplicationCode, ApplicationKey, SerialNumber, [Description] , VersionInfoId ) 
				  VALUES (@AgencyAccessID, @ApplicationCode, @ApplicationKey, @SerialNumber, @ApplicationDescription , @VersionInfoId )
				  
				  SELECT @AgencyApplicationID = SCOPE_IDENTITY()
			END
	  END 

	  IF LEN(@SerialNumber) > 0 AND @AgencyName IS NOT NULL AND @AgencyName <> ''
	  BEGIN
		UPDATE rmh.AgencyAccess SET AgencyName = @AgencyName WHERE AgencyAccessID = @AgencyAccessID
	  END		
	  
	  IF(@RWACVersion is null OR @RWACVersion = 0)
	   BEGIN
	    SET @RWACVersion = 4800  -- might be another one but most of the time it will be 4800 and it doesn't really matter, setting this will ensure the newest version gets deployed.
	   END

	-- Set/update the application version number
	UPDATE [rmh].[AgencyApplication] Set Version = @Version, [Description] = @ApplicationDescription, RWACVersion = @RWACVersion  WHERE AgencyApplicationID = @AgencyApplicationID
	

		-- auto rwac update
	  DECLARE @DeployedRwacVersion int
	  SELECT @DeployedRwacVersion = CAST(RWACVersion as int) FROM rmh.AdminSetting WHERE AdminSettingId = 1 -- there is only 1 record
	  
	  IF(@RWACVersion < @DeployedRwacVersion)
	   BEGIN
		-- rwac has started and is on an older version so add a record into RwacUpdate (ialways add, even if a record already exists for the version/appKey...could be a re-install or move to new machine)
		IF not exists( SELECT 1 FROM RwacDeploy WHERE AppKey = @ApplicationKey AND DeployVersion = @DeployedRwacVersion AND CurrentVersion = @RWACVersion ) -- the CurrentVersion check ensures we don't get multiple duplicate records (while the RWAC is restarting) for the same starting version
		 BEGIN
			-- also ensure that the App is listening and active (this proc gets called for all serialNumbers to get the appKey which happens before checking activations etc)
			-- for now just check if listened has a date, may want to improve later to also filter out older than n minutes ago
			IF exists ( SELECT 1 FROM rmh.AgencyApplication app JOIN [Activation] act on app.AgencyApplicationId = act.AgencyApplicationId where app.AgencyApplicationID = @AgencyApplicationID AND Listened is not null AND act.IsActive = 1 )
			 BEGIN
				INSERT RwacDeploy (AppKey, CurrentVersion, DeployVersion, CreatedBy )
				VALUES (  @ApplicationKey , @RWACVersion , @DeployedRwacVersion , 'RSRT' )
			 END
		 END
	
	   END

	  SELECT @ApplicationKey ApplicationKey, @AgencyGUID AgencyGUID

