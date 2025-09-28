using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KindNet.Migrations
{
    /// <inheritdoc />
    public partial class ResourceFulfillmentChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProviderUserId",
                table: "ResourceFulfillments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ProviderUserId",
                table: "ResourceFulfillments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
