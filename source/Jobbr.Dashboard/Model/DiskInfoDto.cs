namespace Jobbr.Dashboard.Model
{
    public class DiskInfoDto
    {
        public string Name { get; set; }
        public double FreeSpace { get; set; }
        public string FreeSpaceReadable { get; set; }
        public double TotalSpace { get; set; }
        public string TotalSpaceReadable { get; set; }
        public double FreeSpacePercentage { get; set; }
        public string Type { get; set; }
    }
}
