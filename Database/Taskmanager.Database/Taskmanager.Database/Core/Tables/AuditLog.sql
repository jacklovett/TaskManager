CREATE TABLE [Core].[AuditLog] (
    [LogId]         INT              IDENTITY (1, 1) NOT NULL,
    [EventType]     CHAR (1)         NOT NULL,
    [TableName]     NVARCHAR (100)   NOT NULL,
    [ColumnName]    NVARCHAR (100)   NOT NULL,
    [OriginalValue] NVARCHAR (MAX)   NULL,
    [NewValue]      NVARCHAR (MAX)   NULL,
    [CreatedDate]   DATETIME         CONSTRAINT [DF_AuditLog_CreatedDate] DEFAULT (getdate()) NOT NULL,
    [CreatedBy]     NVARCHAR (50)    NOT NULL,
    [RowGuid]       UNIQUEIDENTIFIER CONSTRAINT [DF_AuditLog_RowGuid] DEFAULT (newid()) NOT NULL,
    CONSTRAINT [PK_AuditLog] PRIMARY KEY CLUSTERED ([LogId] ASC)
);

