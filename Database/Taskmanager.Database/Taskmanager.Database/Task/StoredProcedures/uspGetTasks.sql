CREATE PROCEDURE [Task].[uspGetTasks]
		@AccountId INT = NULL
AS
/*
	NAME:			[Task].[uspGetTasks]
	
	DESCRIPTION:	Retrieve tasks
	
	PARAMETERS:		PARAM					|	DESCRIPTION
					----------------------------------------------------
					@AccountId INT			AccountId parameter to allow filtering based on the assignee
					
	EXEC:			EXEC	[Task].[uspGetTasks]
														
	HISTORY:		16-03-2017 - JL Created
*/
BEGIN
	SELECT t.TaskId
		,t.Project_Id 
		,p.Name AS ProjectName
		,t.Assignee_Id
		,a.FirstName + ' ' + a.LastName AS Assignee
		,t.Name AS Name
		,t.[Description]
		,t.Comments
		,t.Deadline
		,t.InProgress
		,t.IsTesting
		,t.IsCompleted	
		,t.IsBacklog
		,t.IsDeleted
		,t.CompletedDate	
	FROM [Task].Task t
	JOIN [Project].[Project] p
	ON p.ProjectId = t.Project_Id
	JOIN [Core].[Account] a
	ON a.AccountId = t.Assignee_Id
	WHERE t.Assignee_Id = ISNULL(@AccountId, t.Assignee_Id)
	AND t.IsDeleted = 0
	
END
