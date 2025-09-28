using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KindNet.Migrations
{
    /// <inheritdoc />
    public partial class AttendanceSessions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VolunteersSessions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ApplicationId = table.Column<long>(type: "bigint", nullable: false),
                    SessionDate = table.Column<DateOnly>(type: "date", nullable: false),
                    HoursVolunteered = table.Column<double>(type: "double precision", nullable: false),
                    AttendanceStatus = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VolunteersSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VolunteersSessions_EventApplications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalTable: "EventApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VolunteersSessions_ApplicationId",
                table: "VolunteersSessions",
                column: "ApplicationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VolunteersSessions");
        }
    }
}
