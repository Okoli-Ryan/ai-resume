namespace Resume_builder.Features.PdfGeneration.GeneratePdf;

public record GeneratePdfCommand(string ResumeId);

public record GeneratePdfResult(byte[] PdfBytes, string Filename);
