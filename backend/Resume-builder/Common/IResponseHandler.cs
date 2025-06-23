namespace Resume_builder.Common;

public interface IResponseHandler<in TCommand, TResponse>
{
    Task<Response<TResponse>> Handle(TCommand command, CancellationToken cancellationToken);
}