using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Resume_builder.Migrations
{
    /// <inheritdoc />
    public partial class file_shortnedurl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ShortenedUrl",
                table: "FileUpload",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShortenedUrl",
                table: "FileUpload");
        }
    }
}
