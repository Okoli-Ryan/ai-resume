using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Resume_builder.Migrations
{
    /// <inheritdoc />
    public partial class removeongoing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOngoing",
                table: "WorkExperience");

            migrationBuilder.DropColumn(
                name: "IsOngoing",
                table: "Education");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOngoing",
                table: "WorkExperience",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsOngoing",
                table: "Education",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
