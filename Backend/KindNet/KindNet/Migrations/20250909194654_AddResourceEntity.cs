using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace KindNet.Migrations
{
    /// <inheritdoc />
    public partial class AddResourceEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ResourceRequests",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EventId = table.Column<long>(type: "bigint", nullable: false),
                    ItemName = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    QuantityNeeded = table.Column<int>(type: "integer", nullable: false),
                    QuantityFulfilled = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResourceRequests_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResourceFulfillments",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RequestId = table.Column<long>(type: "bigint", nullable: false),
                    ProviderUserId = table.Column<long>(type: "bigint", nullable: false),
                    ProviderId = table.Column<long>(type: "bigint", nullable: false),
                    QuantityProvided = table.Column<int>(type: "integer", nullable: false),
                    AgreementTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceFulfillments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResourceFulfillments_ResourceRequests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "ResourceRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResourceFulfillments_Users_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ResourceFulfillments_ProviderId",
                table: "ResourceFulfillments",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_ResourceFulfillments_RequestId",
                table: "ResourceFulfillments",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_ResourceRequests_EventId",
                table: "ResourceRequests",
                column: "EventId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ResourceFulfillments");

            migrationBuilder.DropTable(
                name: "ResourceRequests");
        }
    }
}
