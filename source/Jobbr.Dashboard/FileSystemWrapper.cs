using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.Owin.FileSystems;
using SharpFileSystem;
using SharpFileSystem.IO;
using IFileSystem = Microsoft.Owin.FileSystems.IFileSystem;

namespace Jobbr.Dashboard
{
    /// <summary>
    /// Bridge between SharpFileSystem.IFileSystem and Microsoft.Owin.FileSystems.IFileSystem
    /// </summary>
    public class FileSystemWrapper : IFileSystem
    {
        private readonly SharpFileSystem.IFileSystem _fileSystem;

        public FileSystemWrapper(SharpFileSystem.IFileSystem fileSystem)
        {
            _fileSystem = fileSystem;
        }

        public bool TryGetFileInfo(string subpath, out IFileInfo fileInfo)
        {
            var path = FileSystemPath.Parse(subpath);

            if (_fileSystem.Exists(path))
            {
                fileInfo = new FileInfo(path, _fileSystem);

                return true;
            }

            fileInfo = new FileInfo(FileSystemPath.Root.AppendFile("index.html"), _fileSystem);

            return true;
        }

        public bool TryGetDirectoryContents(string subpath, out IEnumerable<IFileInfo> contents)
        {
            var path = FileSystemPath.Parse(subpath);

            if (_fileSystem.Exists(path) == false)
            {
                contents = null;
                return false;
            }

            var entitiesFromDirectory = _fileSystem.GetEntities(path);

            var list = new List<IFileInfo>(entitiesFromDirectory.Count);

            foreach (var entity in entitiesFromDirectory)
            {
                list.Add(new FileInfo(entity, _fileSystem));
            }

            contents = list;

            return list.Count > 0;
        }

        private class FileInfo : IFileInfo
        {
            private readonly SharpFileSystem.IFileSystem _fileSystem;
            private static readonly DateTime AssemblyLastModified = DateTime.UtcNow;
            private FileSystemPath _entity;

            public FileInfo(FileSystemPath entity, SharpFileSystem.IFileSystem fileSystem)
            {
                _fileSystem = fileSystem;
                _entity = entity;

                using (var stream = _fileSystem.OpenFile(entity, FileAccess.Read))
                {
                    Length = stream.ReadAllBytes().Length;
                }
            }

            public Stream CreateReadStream()
            {
                return _fileSystem.OpenFile(_entity, FileAccess.Read);
            }

            public long Length { get; }
            public string PhysicalPath => null;
            public string Name => _entity.EntityName;
            public DateTime LastModified => AssemblyLastModified;
            public bool IsDirectory => _entity.IsDirectory;
        }
    }
}