using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.Owin.FileSystems;
using SharpFileSystem;
using SharpFileSystem.IO;
using IFileSystem = Microsoft.Owin.FileSystems.IFileSystem;

namespace Jobbr.Dashboard.Backend
{
    /// <summary>
    /// Bridge between SharpFileSystem.IFileSystem and Microsoft.Owin.FileSystems.IFileSystem
    /// </summary>
    public class FileSystemWrapper : IFileSystem
    {
        private readonly SharpFileSystem.IFileSystem fileSystem;

        public FileSystemWrapper(SharpFileSystem.IFileSystem fileSystem)
        {
            this.fileSystem = fileSystem;
        }

        public bool TryGetFileInfo(string subpath, out IFileInfo fileInfo)
        {
            var path = FileSystemPath.Parse(subpath);

            if (this.fileSystem.Exists(path))
            {
                fileInfo = new FileInfo(path, this.fileSystem);

                return true;
            }

            fileInfo = new FileInfo(FileSystemPath.Root.AppendFile("index.html"), this.fileSystem);

            return true;
        }

        public bool TryGetDirectoryContents(string subpath, out IEnumerable<IFileInfo> contents)
        {
            var path = FileSystemPath.Parse(subpath);

            if (this.fileSystem.Exists(path) == false)
            {
                contents = null;
                return false;
            }

            var entitiesFromDirectory = this.fileSystem.GetEntities(path);

            var list = new List<IFileInfo>(entitiesFromDirectory.Count);

            foreach (var entity in entitiesFromDirectory)
            {
                list.Add(new FileInfo(entity, this.fileSystem));
            }

            contents = list;

            return list.Count > 0;
        }

        private class FileInfo : IFileInfo
        {
            private readonly SharpFileSystem.IFileSystem fileSystem;
            private static readonly DateTime AssemblyLastModified = DateTime.UtcNow;
            private FileSystemPath entity;

            public FileInfo(FileSystemPath entity, SharpFileSystem.IFileSystem fileSystem)
            {
                this.fileSystem = fileSystem;
                this.entity = entity;

                using (var stream = this.fileSystem.OpenFile(entity, FileAccess.Read))
                {
                    this.Length = stream.ReadAllBytes().Length;
                }
            }

            public Stream CreateReadStream()
            {
                return this.fileSystem.OpenFile(entity, FileAccess.Read);
            }

            public long Length { get; }
            public string PhysicalPath => null;
            public string Name => this.entity.EntityName;
            public DateTime LastModified => AssemblyLastModified;
            public bool IsDirectory => this.entity.IsDirectory;
        }
    }
}