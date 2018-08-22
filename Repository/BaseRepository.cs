using System;
using System.Data.Entity;
using System.Diagnostics;

namespace Taskmanager.Repository
{
    [DebuggerStepThrough]
    public abstract class BaseRepository<T> where T : DbContext, IDisposable
    {
        protected T Context { get; set; }
        protected BaseRepository(T context)
        {
            this.Context = context;
        }

        #region Disposable
        private bool _disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (_disposedValue) return;
            if (disposing)
            {
                Context.Dispose();
            }

            _disposedValue = true;
        }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
        }
        #endregion
    }
}