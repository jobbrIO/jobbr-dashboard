using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Primitives;
using SharpFileSystem;
using SharpFileSystem.FileSystems;
using SharpFileSystem.IO;

namespace Jobbr.Dashboard;

internal class ZipFileContentProvider : IFileProvider, IDisposable
{
    private readonly NetZipArchiveFileSystem _fileSystem;

    public ZipFileContentProvider(Stream stream)
    {
        _fileSystem = NetZipArchiveFileSystem.OpenReadOnly(stream);
    }

    public IFileInfo GetFileInfo(string subpath)
    {
        if (subpath != "/" && _fileSystem.Exists(subpath))
        {
            return new ZipFileInfo(subpath, _fileSystem);
        }

        return new ZipFileInfo("/index.html", _fileSystem);
    }

    public IDirectoryContents GetDirectoryContents(string subpath)
    {
        if (_fileSystem.Exists(subpath))
        {
            return new ZipDirectoryContents(subpath, _fileSystem);
        }

        return new NotFoundDirectoryContents();
    }

    public IChangeToken Watch(string filter)
    {
        throw new NotImplementedException();
    }

    public void Dispose()
    {
        _fileSystem?.Dispose();
    }

    private class ZipFileInfo : IFileInfo
    {
        private readonly IFileSystem _fileSystem;
        private static readonly DateTime AssemblyLastModified = DateTime.UtcNow;
        private FileSystemPath _path;

        public ZipFileInfo(FileSystemPath path, IFileSystem fileSystem)
        {
            _fileSystem = fileSystem;
            _path = path;

            if (_fileSystem.Exists(path))
            {
                using (var stream = _fileSystem.OpenFile(path, FileAccess.Read))
                {
                    Length = stream.ReadAllBytes().Length;
                }
            }
        }

        public Stream CreateReadStream()
        {
            return _fileSystem.OpenFile(_path, FileAccess.Read);
        }

        public bool Exists => _fileSystem.Exists(_path);

        DateTimeOffset IFileInfo.LastModified => LastModified;

        public long Length { get; }

        public string PhysicalPath => null;

        public string Name => _path.EntityName;

        public DateTime LastModified => AssemblyLastModified;

        public bool IsDirectory => _path.IsDirectory;
    }

    private class ZipDirectoryContents : IDirectoryContents
    {
        private readonly IFileSystem _fileSystem;
        private readonly FileSystemPath _path;

        public ZipDirectoryContents(FileSystemPath path, IFileSystem fileSystem)
        {
            _fileSystem = fileSystem;
            _path = path;
        }

        public IEnumerator<IFileInfo> GetEnumerator()
        {
            return _fileSystem.GetEntities(_path)
                .Select(p => new ZipFileInfo(p, _fileSystem))
                .GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public bool Exists => _fileSystem.Exists(_path);
    }
}