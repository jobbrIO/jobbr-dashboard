namespace Jobbr.Dashboard.Model
{
    /// <summary>
    /// Hard drive information data transfer object.
    /// </summary>
    public class DiskInfoDto
    {
        /// <summary>
        /// Disk name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The amount of free space.
        /// </summary>
        public double FreeSpace { get; set; }

        /// <summary>
        /// The amount of readable free space.
        /// </summary>
        public string FreeSpaceReadable { get; set; }

        /// <summary>
        /// Total space.
        /// </summary>
        public double TotalSpace { get; set; }

        /// <summary>
        /// Total readable space.
        /// </summary>
        public string TotalSpaceReadable { get; set; }

        /// <summary>
        /// The amount of free space as a percentage of the total space.
        /// </summary>
        public double FreeSpacePercentage { get; set; }

        /// <summary>
        /// Disk type.
        /// </summary>
        public string Type { get; set; }
    }
}
