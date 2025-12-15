using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Resume_builder.Migrations
{
    /// <inheritdoc />
    public partial class link_index : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Index",
                table: "Link",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ResumeEntityId",
                table: "Link",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Link_ResumeEntityId",
                table: "Link",
                column: "ResumeEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Link_Resume_ResumeEntityId",
                table: "Link",
                column: "ResumeEntityId",
                principalTable: "Resume",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Link_Resume_ResumeEntityId",
                table: "Link");

            migrationBuilder.DropIndex(
                name: "IX_Link_ResumeEntityId",
                table: "Link");

            migrationBuilder.DropColumn(
                name: "Index",
                table: "Link");

            migrationBuilder.DropColumn(
                name: "ResumeEntityId",
                table: "Link");
        }
    }
}
