using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Resume_builder.Migrations
{
    /// <inheritdoc />
    public partial class AddCertifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CertificationId",
                table: "BulletPoint",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Certification",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    CertificationName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CertificateLink = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DateAttained = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ResumeId = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ActiveStatus = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Certification_Resume_ResumeId",
                        column: x => x.ResumeId,
                        principalTable: "Resume",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Certification_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BulletPoint_CertificationId",
                table: "BulletPoint",
                column: "CertificationId");

            migrationBuilder.CreateIndex(
                name: "IX_Certification_ResumeId",
                table: "Certification",
                column: "ResumeId");

            migrationBuilder.CreateIndex(
                name: "IX_Certification_UserId",
                table: "Certification",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_BulletPoint_Certification_CertificationId",
                table: "BulletPoint",
                column: "CertificationId",
                principalTable: "Certification",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BulletPoint_Certification_CertificationId",
                table: "BulletPoint");

            migrationBuilder.DropTable(
                name: "Certification");

            migrationBuilder.DropIndex(
                name: "IX_BulletPoint_CertificationId",
                table: "BulletPoint");

            migrationBuilder.DropColumn(
                name: "CertificationId",
                table: "BulletPoint");
        }
    }
}
