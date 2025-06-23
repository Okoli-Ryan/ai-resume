using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Resume_builder.Common;

public class BaseEntity
{
    [Key]
    public string Id { get; set; } = Ulid.NewUlid().ToString();

    public bool ActiveStatus { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}