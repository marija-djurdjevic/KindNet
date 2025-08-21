using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KindNet.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationDeadlineAndRequiredSkills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ApplicationDeadline",
                table: "Events",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<List<string>>(
                name: "RequiredSkills",
                table: "Events",
                type: "text[]",
                nullable: true,
                defaultValue: new string[] { });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationDeadline",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "RequiredSkills",
                table: "Events");
        }
    }
}
