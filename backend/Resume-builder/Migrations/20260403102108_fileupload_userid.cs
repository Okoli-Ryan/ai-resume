using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Resume_builder.Migrations
{
    /// <inheritdoc />
    public partial class fileupload_userid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Resume",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ResumeId",
                table: "BulletPoint",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Version",
                table: "Resume");

            migrationBuilder.DropColumn(
                name: "ResumeId",
                table: "BulletPoint");
        }
    }
}
