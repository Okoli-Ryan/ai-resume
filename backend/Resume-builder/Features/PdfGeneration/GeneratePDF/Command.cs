namespace Resume_builder.Features.PdfGeneration.GeneratePDF;

public record GeneratePdfCommand(string ResumeId);

public record GeneratePdfResult(byte[] PdfBytes, string Filename);
