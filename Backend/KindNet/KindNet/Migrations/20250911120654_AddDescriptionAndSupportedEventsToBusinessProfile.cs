using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KindNet.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptionAndSupportedEventsToBusinessProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "BusinessProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SupportedEventsCount",
                table: "BusinessProfiles",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "BusinessProfiles");

            migrationBuilder.DropColumn(
                name: "SupportedEventsCount",
                table: "BusinessProfiles");
        }
    }
}
