namespace Resume_builder.Features.Resume.Patch_Update_Order;

public record PatchUpdateOrderCommand(string ResumeId, PatchUpdateOrderRequest Request);

public class PatchUpdateOrderRequest
{
    public string? Order { get; set; }
}
