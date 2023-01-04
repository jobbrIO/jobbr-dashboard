using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.FileProviders.Internal;
using Microsoft.Extensions.FileProviders.Physical;
using Microsoft.Extensions.Primitives;
using System.IO;
using System.IO.Compression;

namespace Jobbr.Dashboard
{
    internal class ZipContentTypeProvider : IFileProvider
    {
        private readonly string _tempPath = Path.Combine(Path.GetTempPath(), "dashboard-app");

        public ZipContentTypeProvider()
        {
            if (!Directory.Exists(_tempPath))
            {
                var zipPath = Path.Combine(Directory.GetCurrentDirectory(), "dashboard-app.zip");

                using (var file = File.OpenRead(zipPath))
                using (var zip = new ZipArchive(file, ZipArchiveMode.Read))
                {
                    zip.ExtractToDirectory(_tempPath);
                }
            }
        }

        public IFileInfo GetFileInfo(string subpath)
        {
            var fileInfo = new FileInfo(Path.Combine(_tempPath, subpath.TrimStart('/')));

            if (fileInfo.Exists)
            {
                return new PhysicalFileInfo(fileInfo);
            }

            return new PhysicalFileInfo(new FileInfo("index.html"));
        }

        public IDirectoryContents GetDirectoryContents(string subpath)
        {

            var subDirectory = Path.Combine(_tempPath, subpath.TrimStart('/'));

            if (Directory.Exists(subDirectory))
            {
                return new PhysicalDirectoryContents(subDirectory);
            }

            return new PhysicalDirectoryContents(_tempPath);
        }

        public IChangeToken Watch(string filter)
        {
            return Watch(filter);
        }

    }
}
