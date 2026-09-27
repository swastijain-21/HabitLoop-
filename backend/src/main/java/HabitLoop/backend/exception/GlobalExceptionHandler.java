package HabitLoop.backend.exception;

import HabitLoop.backend.dto.analytics.ApiErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleIllegalArgumentException(IllegalArgumentException ex) {
        ApiErrorResponseDTO error = new ApiErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleMissingParams(MissingServletRequestParameterException ex) {
        ApiErrorResponseDTO error = new ApiErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "Missing Parameter",
                "Required parameter '" + ex.getParameterName() + "' is missing."
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String paramName = ex.getName();
        String message = "Parameter '" + paramName + "' has invalid format or value: " + ex.getValue();
        ApiErrorResponseDTO error = new ApiErrorResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "Type Mismatch",
                message
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponseDTO> handleGeneralException(Exception ex) {
        ApiErrorResponseDTO error = new ApiErrorResponseDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage() != null ? ex.getMessage() : "An unexpected server error occurred."
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
