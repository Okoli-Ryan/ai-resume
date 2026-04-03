using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Resume_builder.Migrations
{
    /// <inheritdoc />
    public partial class AddFileUpload_UserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "FileUpload",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_FileUpload_UserId",
                table: "FileUpload",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileUpload_User_UserId",
                table: "FileUpload",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileUpload_User_UserId",
                table: "FileUpload");

            migrationBuilder.DropIndex(
                name: "IX_FileUpload_UserId",
                table: "FileUpload");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "FileUpload");
        }
    }
}
