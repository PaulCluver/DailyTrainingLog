SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE GetAllTrainingLogs
AS
BEGIN
	SELECT
		le.ID,
		et.Description AS 'Type',
		le.Time,
		le.Date
	FROM [TrainingLog].[dbo].LogEntry le
		INNER JOIN [TrainingLog].[dbo].ExerciseType et ON et.ID = le.TypeID
END
GO
